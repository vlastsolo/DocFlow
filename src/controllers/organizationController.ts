import { Request, Response, NextFunction } from "express";
import AppDataSource from "../AppDataSource";
import {organizationsFind, organizationFindById, organizationCreateGet, organizationCreatePost} from "../middleware/organizationMiddleware";
import { handleError, createError } from "../utils/errorHandler";
import { OrganizationData } from "../types/organization.dto";
import { Organization } from "../models/organization";
import { ProductService } from "../models/productService";

export class organizationController {
    public getOrganizations = [organizationsFind, this.renderOrganizations];
    private renderOrganizations(req: Request, res: Response, next: NextFunction){
      try {
        res.render("organizations_list", {
          title: "Список организаций",
          organizations: req.organizations
        });
      } catch (error) {
        handleError(error, res, "Error rendering organizations list");
      }
    }

    public getOrganizationById = [organizationFindById, this.renderOrganizationById]
    private renderOrganizationById(req: Request, res: Response, next: NextFunction){
      try {
        res.render("organization_info", {
          title: "Информация об организации",
          organization: req.organizations?.[0]
        });
      } catch (error) {
        handleError(error, res, "Error rendering organization info");
      }
    }
    
    public createOrganizationGet = [organizationCreateGet, this.renderOrganizationGet];
    private renderOrganizationGet (req: Request, res: Response, next: NextFunction){
      try {
          res.render("create_organization_form")
      } catch (error) {
            handleError(error, res, "Error rendering organization form");
        }
    }
    public createOrganizationPost = [organizationCreatePost, this.processOrganizationPost];
    private async processOrganizationPost (req: Request, res: Response, next: NextFunction){
  try {
    const organizationRepository = AppDataSource.getRepository(Organization);
    console.log('Organization repository created successfully');
    const productServiceRepository = AppDataSource.getRepository(ProductService);
        console.log('Checking AppDataSource initialization status:', AppDataSource.isInitialized);
    
    // Проверяем, что сущности зарегистрированы
    const entityMetadatas = AppDataSource.entityMetadatas;
    console.log('Available entities:', entityMetadatas.map(e => e.name));
    
    if (!AppDataSource.isInitialized) {
      console.log('Initializing AppDataSource...');
      await AppDataSource.initialize();
    }
    // Добавляем подробную отладочную информацию
    console.log('=== DEBUG: processOrganizationPost ===');
    console.log('req.fileInfo:', req.fileInfo);
    console.log('req.fileInfo?.aiAnalysis:', req.fileInfo?.aiAnalysis);
    console.log('req.fileInfo?.aiAnalysis type:', typeof req.fileInfo?.aiAnalysis);
    
    if (!req.fileInfo?.aiAnalysis) {
      console.log('ERROR: AI analysis data is missing');
      throw createError("AI analysis data is missing", 400);
    }

    // Выводим полную структуру aiAnalysis для отладки
    console.log('Full aiAnalysis structure:', JSON.stringify(req.fileInfo.aiAnalysis, null, 2));
    
    // Проверяем различные возможные структуры данных
    let organizationData: OrganizationData | undefined;
    
    // Вариант 1: прямое свойство organizationData
    if ('organizationData' in req.fileInfo.aiAnalysis) {
      organizationData = (req.fileInfo.aiAnalysis as any).organizationData;
      console.log('Found organizationData in aiAnalysis:', organizationData);
    }
    
    // Вариант 2: данные могут быть напрямую в aiAnalysis
    else if ('name' in req.fileInfo.aiAnalysis && 'inn' in req.fileInfo.aiAnalysis) {
      organizationData = req.fileInfo.aiAnalysis as OrganizationData;
      console.log('aiAnalysis contains organization data directly:', organizationData);
    }
    
    // Вариант 3: другие возможные структуры
    else if (typeof req.fileInfo.aiAnalysis === 'object') {
      // Проверяем все возможные вложенные структуры
      const aiAnalysis = req.fileInfo.aiAnalysis as any;
      if (aiAnalysis.data?.organizationData) {
        organizationData = aiAnalysis.data.organizationData;
      } else if (aiAnalysis.result?.organizationData) {
        organizationData = aiAnalysis.result.organizationData;
      } else if (aiAnalysis.organization) {
        organizationData = aiAnalysis.organization;
      }
      console.log('Trying to extract from nested structure:', organizationData);
    }

    // Проверяем, что organizationData существует
    if (!organizationData) {
      console.log('ERROR: Could not extract organization data from:', req.fileInfo.aiAnalysis);
      throw createError("Organization data is missing from AI analysis", 400);
    }

    console.log('Extracted organizationData:', organizationData);


    // Валидация обязательных полей
    if (!organizationData.name) {
      throw createError("Organization name is required", 400);
    }

    if (!organizationData.inn) {
      throw createError("INN is required", 400);
    }

    // Проверка существующей организации
    const existingOrganization = await organizationRepository.findOne({
      where: { inn: organizationData.inn }
    });

    if (existingOrganization) {
      const productServices = await productServiceRepository.find();
      return res.render('organization_info', {
        organization: existingOrganization,
        productServices: productServices,
        message: "Organization with this INN already exists",
        error: true
      });
    }

    // Создание организации
    const organization = new Organization();
    organization.name = organizationData.name;
    organization.inn = organizationData.inn;
    organization.kpp = organizationData.kpp || null;
    organization.fullName = organizationData.name;
    organization.address = organizationData.legalAddress || null;
    organization.actualAddress = organizationData.actualAddress || null;
    organization.phone = organizationData.phone || null;
    organization.email = organizationData.email || null;
    organization.bankName = organizationData.bankName || null;
    organization.bankAccount = organizationData.bankAccount || null;
    organization.corrAccount = organizationData.correspondentAccount || null;
    organization.bik = organizationData.bankBik || null;
    organization.discount = 0;
    organization.isMyOrganization = false;
    organization.isDefaultOrganization = false;
    organization.photo = req.fileInfo?.filePath || null;
    organization.tags = [];
    organization.defaultProductService = null;

    const savedOrganization = await organizationRepository.save(organization);

    // Получаем список товаров/услуг для выпадающего списка
    const productServices = await productServiceRepository.find();

    // Рендерим шаблон с данными организации
    res.redirect(`/organizations/${savedOrganization.id}?success=true&message=Organization created successfully from document`);

  } catch (error) {
    console.error('Error creating organization:', error);
    
    let errorMessage = 'Ошибка при создании организации';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // Добавляем отладочную информацию
    console.log('Request fileInfo:', req.fileInfo);
    console.log('Request body:', req.body);
    
    res.redirect(`/organizations/create?error=true&message=${encodeURIComponent(errorMessage)}`);
  }
}
}
