import { Request, Response, NextFunction } from "express";
import {organizationsFind, organizationFindById, organizationCreate} from "../middleware/organizationMiddleware";

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
    
    public createOrganizationGet = [organizationCreate, this.renderOrganizationGet];
    private renderOrganizationGet (req: Request, res: Response, next: NextFunction){
            try {
          res.render("create_organization_form")
      } catch (error) {
            next(error);
        }
    }

}