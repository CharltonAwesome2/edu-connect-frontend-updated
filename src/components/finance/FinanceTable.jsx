import { Card, EmptyState, Loading, Notice, StatusBadge, formatDate, money } from "@components/ui";

export function FinanceTableState({ loading, error, empty, onRetry }) {
  if (loading) return <Loading label="Loading records" />;
  if (error) {
    return <Notice kind="error" onClose={onRetry}>{error} Click to retry.</Notice>;
  }
  if (empty) {
    return <EmptyState title="No records found" text="No records match the current filters." />;
  }
  return null;
}

export function PaymentTable({ rows }) {
  return (
    <Card>
      <div className="section-heading"><h2>Payments</h2><span>{rows.length} records</span></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Reference</th><th>Method</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>{rows.map((row) => (
            <tr key={row.paymentId || row.id || row.transactionReference}>
              <td>{formatDate(row.paidAt || row.createdAt)}</td>
              <td><b>{row.transactionReference || row.reference || "-"}</b></td>
              <td>{row.paymentMethod || row.method || "-"}</td>
              <td><b>{money(row.amount || row.total)}</b></td>
              <td><StatusBadge status={row.status || "Pending"} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Card>
  );
}

export function InvoiceTable({ rows }) {
  return (
    <Card>
      <div className="section-heading"><h2>Invoices</h2><span>{rows.length} records</span></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Invoice</th><th>Issued</th><th>Due</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>{rows.map((row) => (
            <tr key={row.invoiceId || row.id || row.invoiceNumber}>
              <td><b>{row.invoiceNumber || row.number || "-"}</b></td>
              <td>{formatDate(row.issuedDate || row.issueDate)}</td>
              <td>{formatDate(row.dueDate)}</td>
              <td><b>{money(row.total || row.amount)}</b></td>
              <td><StatusBadge status={row.status || "Pending"} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Card>
  );
}
