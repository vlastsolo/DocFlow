import AppDataSource from "../AppDataSource";
import { Request, Response, NextFunction } from "express";
import { Organization } from "../models/organization";
import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';
import { handleError, createError } from "../utils/errorHandler";

export async function organizationsFind(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organizations = await organizationRepository.find();
    req.organizations = organizations;
    next();
  } catch (error) {
    handleError(error, res, "Error fetching organizations");
    }
}

export async function organizationFindById(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = await organizationRepository.findOne({
      where: { id: Number(req.params.id) },
      relations: ['invoices'],
    });

    if (!organization) {
      throw createError("Organization not found", 404);
    }

    req.organizations = [organization];

    next();
} catch (error) {
    handleError(error, res, "Error fetching organization");
    }
}

export async function organizationCreateGet (req: Request, res: Response, next: NextFunction) {
  try {
    req.organizations = []; // или установите пустой массив/объект
    next();
  } catch (error) {
      handleError(error, res, "Error preparing organization creation form");
    }
}

export async function organizationCreatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const form = new multiparty.Form();
    const uploadDir = path.join(process.cwd(), 'uploads', 'organizations');
    
    // Создаем директорию для загрузок, если она не существует
    try {
      await fs.promises.access(uploadDir);
    } catch {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      try {
        const file = files.file?.[0];
        
        if (!file) {
          throw createError('No file uploaded', 400);
        }

        // Генерируем уникальное имя файла
        const fileExtension = path.extname(file.originalFilename || 'file');
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        // Перемещаем файл в целевую директорию
        await fs.promises.rename(file.path, filePath);

        // Сохраняем информацию о файле в req для использования в контроллере
        req.fileInfo = {
          originalName: file.originalFilename,
          fileName: fileName,
          filePath: filePath,
          size: file.size,
          mimetype: file.headers['content-type']
        };

        // Сохраняем поля формы
        req.formFields = fields;

        next();
      } catch (error) {
        handleError(error, res, 'Error processing file');
      }
    });
  } catch (error) {
    handleError(error, res, "Error in organization creation");
  }
}