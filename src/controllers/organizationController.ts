import { Request, Response, NextFunction } from "express";
import {organizationsFind, organizationFindById, organizationCreateGet, organizationCreatePost} from "../middleware/organizationMiddleware";

export class organizationController {
    public getOrganizations = [organizationsFind, this.renderOrganizations];
    private renderOrganizations(req: Request, res: Response, next: NextFunction){
      res.render("organizations_list", {
        title: "Список организаций",
        organizations: req.organizations
      } )
    }

    public getOrganizationById = [organizationFindById, this.renderOrganizationById]
    private renderOrganizationById(req: Request, res: Response, next: NextFunction){
      res.render("organization_info", {
        title: "Информация об организации",
        organization: req.organizations
      })
    }
    
    public createOrganizationGet = [organizationCreateGet, this.renderOrganizationGet];
    private renderOrganizationGet (req: Request, res: Response, next: NextFunction){
            try {
          res.render("create_organization_form")
      } catch (error) {
            next(error);
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
        console.log(fileInfo?.originalName+' '+fileInfo?.mimetype)
      } catch (error) {
        console.error('Error creating organization:', error);
        res.redirect('/organizations/create?error=true&message=Error creating organization');
      }
    }
}

