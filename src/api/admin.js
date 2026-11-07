import { invoices } from "./invoices";
import { payments } from "./payments";
import { reports } from "./reports";
import { users } from "./users";

export const admin = {
  dashboard: async () => {
    const [userData, paymentData, invoiceData, reportData] = await Promise.all([
      users.all(),
      payments.all(),
      invoices.all(),
      reports.all(),
    ]);

    return {
      users: Array.isArray(userData) ? userData : [],
      payments: Array.isArray(paymentData) ? paymentData : [],
      invoices: Array.isArray(invoiceData) ? invoiceData : [],
      reports: Array.isArray(reportData) ? reportData : [],
    };
  },
  users: () => users.all(),
  payments: () => payments.all(),
  invoices: () => invoices.all(),
  reports: () => reports.all(),
};
