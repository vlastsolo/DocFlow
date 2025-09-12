import AppDataSource from "../AppDataSource";
import { Request, Response, NextFunction } from "express";
import { Organization } from "../models/organization";


export async function organizationsFind(req: Request, res: Response, next: NextFunction) {
  try {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organizations = await organizationRepository.find();
    req.organizations = organizations;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching organizations:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      console.error("Unknown error occurred:", error);
      res.status(500).json({ error: "Internal server error" });
    }
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
      return res.status(404).json({ error: "Organization not found" });
    }

    req.organizations = [organization];

    next();
} catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching organizations:", error.message);
      res.status(500).json({ error: "Internal server error1" });
    } else {
      console.error("Unknown error occurred:", error);
      res.status(500).json({ error: "Internal server error1" });
    }
}
}

export async function organizationCreate (req: Request, res: Response, next: NextFunction) {
  try {
    // Для создания новой организации, а не поиска существующей
    req.organizations = []; // или установите пустой массив/объект
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error21" });
    } else {
      console.error("Unknown error occurred:", error);
      res.status(500).json({ error: "Internal server error21" });
    }
  }
}