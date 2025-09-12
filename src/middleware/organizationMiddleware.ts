import AppDataSource from "../AppDataSource";
import { Request, Response, NextFunction } from "express";
import { Organization } from "../models/organization";
import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';

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

export async function organizationCreateGet (req: Request, res: Response, next: NextFunction) {
  try {
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

export async function organizationCreatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const form = new multiparty.Form();
    const uploadDir = path.join(process.cwd(), 'uploads', 'organizations');
    
    // Создаем директорию для загрузок, если она не существует
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      try {
        const file = files.file?.[0];
        
        if (!file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        // Генерируем уникальное имя файла
        const fileExtension = path.extname(file.originalFilename || 'file');
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        // Перемещаем файл в целевую директорию
        fs.renameSync(file.path, filePath);

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
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error processing file' });
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    } else {
      console.error("Unknown error occurred:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}