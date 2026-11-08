import { useCallback, useEffect, useState } from "react";
import { admin } from "@api";
import { Card, EmptyState, Loading, Notice, PageHeader, StatusBadge, formatDate, money } from "@components/ui";

export default function AdminFinancials() {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const [paymentData, invoiceData] = await Promise.all([admin.payments(), admin.invoices()]); setPayments(Array.isArray(paymentData) ? paymentData : []); setInvoices(Array.isArray(invoiceData) ? invoiceData : []); }
    catch (err) { setError(err.message || "Unable to load financial records."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  return <>
    <PageHeader eyebrow="Administration" title="Financials" description="Review platform payments and invoices." />
    {loading && <Card><Loading label="Loading financial records" /></Card>}
    {error && <Card><Notice kind="error" onClose={load}>{error} Click to retry.</Notice></Card>}
    {!loading && !error && <>
      <Card><h2>Payments</h2>{!payments.length ? <EmptyState title="No payments" text="No platform payments were returned." /> : <div className="table-wrap"><table><thead><tr><th>Date</th><th>Student</th><th>Reference</th><th>Amount</th><th>Status</th></tr></thead><tbody>{payments.map((row) => <tr key={row.paymentId || row.id || row.transactionReference}><td>{formatDate(row.paidAt || row.createdAt)}</td><td>{row.studentId || row.student?.userId || "-"}</td><td>{row.transactionReference || row.reference || "-"}</td><td><b>{money(row.amount || row.total)}</b></td><td><StatusBadge status={row.status || "Pending"} /></td></tr>)}</tbody></table></div>}</Card>
      <Card><h2>Invoices</h2>{!invoices.length ? <EmptyState title="No invoices" text="No platform invoices were returned." /> : <div className="table-wrap"><table><thead><tr><th>Invoice</th><th>Student</th><th>Issued</th><th>Total</th><th>Status</th></tr></thead><tbody>{invoices.map((row) => <tr key={row.invoiceId || row.id || row.invoiceNumber}><td>{row.invoiceNumber || row.number || "-"}</td><td>{row.studentId || row.student?.userId || "-"}</td><td>{formatDate(row.issuedDate || row.issueDate)}</td><td><b>{money(row.totalAmount || row.total || row.amount)}</b></td><td><StatusBadge status={row.status || "Pending"} /></td></tr>)}</tbody></table></div>}</Card>
    </>}
  </>;
}
