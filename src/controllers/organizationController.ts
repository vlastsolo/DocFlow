import { Request, Response, NextFunction } from "express";
import {organizationsFind, organizationFindById, organizationCreateGet, organizationCreatePost} from "../middleware/organizationMiddleware";
import { handleError, createError } from "../utils/errorHandler";

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
        const { fileInfo } = req;
        if (!fileInfo) {
          return res.status(400).redirect('/organizations/create?error=true&message=No file uploaded');
        }
        
        // Перенаправляем с сообщением об успехе
         res.redirect('/organizations/create?success=true');
      } catch (error) {
        
        console.error('Error creating organization:', error);
        
        let errorMessage = 'Ошибка при создании организации';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        res.redirect(`/organizations/create?error=true&message=${encodeURIComponent(errorMessage)}`);
      }
    }
}
