import api from "./client";

export const invoices = {
    all: () => api.get("/invoices/all").then((r) => r.data),
    byId: (id) => api.get(`/invoices/read/${id}`).then((r) => r.data),
    create: (payload) => api.post("/invoices/create", payload).then((r) => r.data),
    update: (payload) => api.put("/invoices/update", payload).then((r) => r.data),
    remove: (id) => api.delete(`/invoices/delete/${id}`),
    byInvoiceNumber: (invoiceNumber) =>
        api.get("/invoice/by-invoice-number", { params: { invoiceNumber } }).then((r) => r.data),
    existsByInvoiceNumber: (invoiceNumber) =>
        api.get("/invoice/exists-by-invoice-number", { params: { invoiceNumber } }).then((r) => r.data),
    byPayment: (payment) => api.post("/invoice/by-payment", payment).then((r) => r.data),
    byIssuedDateBetween: (start, end) =>
        api.get("/invoice/by-issued-date-between", { params: { start, end } }).then((r) => r.data),
    dueBefore: (date) => api.get("/invoice/due-before", { params: { date } }).then((r) => r.data),
    byStudentId: (userId) => api.get(`/invoice/by-student-id/${userId}`).then((r) => r.data),
};
