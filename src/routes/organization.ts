import express  from "express";
import { organizationController } from "../controllers/organizationController";

const organizationCtrl = new organizationController();
export const organizationRouter = express.Router();

//create organization get
organizationRouter.get("/create", organizationCtrl.createOrganizationGet)

//get all organizations
organizationRouter.get("/", organizationCtrl.getOrganizations)

//get organization by id
organizationRouter.get("/:id", organizationCtrl.getOrganizationById)

//create organization post
