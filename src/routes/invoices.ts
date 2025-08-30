import express from "express";
import {invoiceController} from "../controllers/invoiceController";

const invoiceCtrl = new invoiceController();
export const invoiceRouter = express.Router();

//get all invoices
invoiceRouter.get("/", invoiceCtrl.getInvoices)

//get invoice by id
invoiceRouter.get("/:id", invoiceCtrl.getInvoiceById)

//create invoice get
invoiceRouter.get("/create", invoiceCtrl.createInvoiceGet)

//create invoice post
invoiceRouter.post("/create", invoiceCtrl.createInvoicePost)

//update invoice get
invoiceRouter.get("/:id/update", invoiceCtrl.updateInvoiceGet)

//update invoice post
invoiceRouter.post("/:id/update", invoiceCtrl.updateInvoicePost)

//delete invoice get
invoiceRouter.get("/:id/delete", invoiceCtrl.deleteInvoiceGet)

//delete invoice post
invoiceRouter.post("/:id/delete", invoiceCtrl.deleteInvoicePost)







