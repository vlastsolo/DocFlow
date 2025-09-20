import AppDataSource from "../AppDataSource";
import { Request, Response, NextFunction } from "express";
import { Organization } from "../models/organization";
import multiparty from "multiparty";
import fs from "fs";
import path from "path";
import { handleError, createError } from "../utils/errorHandler";
import { YANDEX_VISION_CONFIG, DEEP_SEEK_CONFIG } from "../config/api.config";
import {
  YandexVisionResponse,
  YandexVisionBlock,
  YandexVisionLine,
} from "../types/yandexVision";
import { OrganizationData } from "../types/organization.dto";
export async function organizationsFind(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organizations = await organizationRepository.find();
    req.organizations = organizations;
    next();
  } catch (error) {
    handleError(error, res, "Error fetching organizations");
  }
}

export async function organizationFindById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = await organizationRepository.findOne({
      where: { id: Number(req.params.id) }
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

export async function organizationCreateGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.organizations = []; // или установите пустой массив/объект
    next();
  } catch (error) {
    handleError(error, res, "Error preparing organization creation form");
  }
}

export async function organizationCreatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log('File info from previous middleware:', req.fileInfo);
    const form = new multiparty.Form();
    const uploadDir = path.join(process.cwd(), "uploads", "organizations");

    // Создаем директорию для загрузок, если она не существует
    try {
      await fs.promises.access(uploadDir);
    } catch {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }

      try {
        const file = files.file?.[0];

        if (!file) {
          throw createError("No file uploaded", 400);
        }

        // Генерируем уникальное имя файла
        const fileExtension = path.extname(file.originalFilename || "file");
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        // Перемещаем файл в целевую директорию
        await fs.promises.rename(file.path, filePath);
 
        async function sendToYandexVision(filePath: string) {
          try {
            const imageBuffer = await fs.promises.readFile(filePath);
            const base64Image = imageBuffer.toString("base64");

            const response = await fetch(YANDEX_VISION_CONFIG.apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Api-Key ${YANDEX_VISION_CONFIG.apiKey}`,
                "x-folder-id": YANDEX_VISION_CONFIG.folderId,
              },
              body: JSON.stringify({
                mimeType: "JPEG",
                languageCodes: ["ru", "en"],
                model: "page",
                content: base64Image,
              }),
            });

            if (!response.ok) {
              throw new Error(
                `Yandex Vision API error: ${response.status} ${response.statusText}`
              );
            }

            const data: YandexVisionResponse = await response.json();

            // Проверяем наличие полного текста в ответе
            const fullText = data?.result?.textAnnotation?.fullText;
            if (fullText && typeof fullText === "string") {
              return fullText.trim();
            }

            // Альтернативный вариант: проверяем структуру с pages
            const pages = data?.result?.textAnnotation?.pages;
            if (pages && pages.length > 0) {
              const firstPage = pages[0];
              if (firstPage.fullText) {
                return firstPage.fullText.trim();
              }

              // Собираем текст из блоков если fullText нет
              if (firstPage.blocks) {
                const extractedText = firstPage.blocks
                  .filter(
                    (block: YandexVisionBlock) =>
                      block.lines && block.lines.length > 0
                  )
                  .map((block: YandexVisionBlock) =>
                    block
                      .lines!.map((line: YandexVisionLine) => line.text || "")
                      .join("\n")
                  )
                  .join("\n\n");

                if (extractedText) {
                  return extractedText.trim();
                }
              }
            }

            // Fallback: собираем текст из корневых блоков
            const blocks = data?.result?.textAnnotation?.blocks;
            if (blocks && blocks.length > 0) {
              const extractedText = blocks
                .filter(
                  (block: YandexVisionBlock) =>
                    block.lines && block.lines.length > 0
                )
                .map((block: YandexVisionBlock) =>
                  block
                    .lines!.map((line: YandexVisionLine) => line.text || "")
                    .join("\n")
                )
                .join("\n\n");

              if (extractedText) {
                return extractedText.trim();
              }
            }

            throw new Error("No text could be extracted from the document");
          } catch (error) {
            console.error("Yandex Vision error:", error);
            throw new Error("Failed to process image with Yandex Vision");
          }
        }

        async function sendToDeepSeek(extractedText: string): Promise<OrganizationData> {
          try {
            const response = await fetch(DEEP_SEEK_CONFIG.apiUrl, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${DEEP_SEEK_CONFIG.apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                  {
                    role: "user",
                    content: `Проанализируй следующий текст, извлеченный из документа, и верни данные в формате JSON:
                  {
                    "name": "название организации",
                    "inn": "ИНН",
                    "kpp": "КПП", 
                    "ogrn": "ОГРН",
                    "legalAddress": "юридический адрес",
                    "actualAddress": "фактический адрес",
                    "director": "директор",
                    "okved": "ОКВЭД",
                    "email": "email",
                    "phone": "телефон",
                    "website": "сайт",
                    "bankAccount": "расчетный счет",
                    "bankName": "название банка",
                    "bankBik": "БИК банка",
                    "correspondentAccount": "корреспондентский счет"
                  }
                  
                  Текст для анализа:\n\n${extractedText}`,
                  },
                ],
                max_tokens: 2000,
                temperature: 0.1,
              }),
            });

            if (!response.ok) {
              throw new Error(
                `Deep Seek API error: ${response.status} ${response.statusText}`
              );
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            let organizationData: OrganizationData = {} as OrganizationData;

            // Обрабатываем ответ от AI
            if (typeof aiResponse === 'string') {
              // AI вернул текст, пытаемся извлечь JSON
              try {
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  organizationData = JSON.parse(jsonMatch[0]);
                }
              } catch (parseError) {
                console.warn("Failed to parse AI response as JSON:", parseError);
              }
            } else if (typeof aiResponse === 'object' && aiResponse !== null) {
              // AI уже вернул готовый объект
              organizationData = aiResponse as OrganizationData;
            } else {
              console.warn("Unexpected AI response format:", typeof aiResponse);
            }
            console.log('AI Analysis result:', aiResponse);
            return organizationData;
          } catch (error) {
            console.error("Deep Seek error:", error);
            throw new Error("Failed to analyze text with Deep Seek");
          }
        }
        
        const extractedText = await sendToYandexVision(filePath);
        const organizationData = await sendToDeepSeek(extractedText);
        
        // Сохраняем информацию о файле и данные организации в req
        req.fileInfo = {
          originalName: file.originalFilename,
          fileName: fileName,
          filePath: filePath,
          size: file.size,
          mimetype: file.headers["content-type"],
          extractedText: extractedText,
          aiAnalysis: organizationData, // Используем уже распарсенные данные
        };

        // Сохраняем поля формы
        req.formFields = fields;
        console.log(req.fileInfo?.aiAnalysis);
        next();
      } catch (error) {
        handleError(error, res, "Error processing file");
      }
    });
  } catch (error) {
    handleError(error, res, "Error in organization creation");
  }
}