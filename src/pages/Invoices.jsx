import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, AlertCircle, CircleCheck, Wallet } from "lucide-react";
import { invoices } from "@api";
import { useAuth } from "@context/AuthContext";
import { Card, PageHeader, StatCard } from "@components/ui";
import { FinanceTableState, InvoiceTable } from "@components/finance/FinanceTable";

export default function Invoices() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = user?.userId ? await invoices.byStudentId(user.userId) : [];
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load invoices.");
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => { void load(); }, [load]);
  const total = useMemo(() => rows.reduce((sum, r) => sum + Number(r.total || r.amount || 0), 0), [rows]);
  const paid = rows.filter((r) => String(r.status).toLowerCase() === "paid").length;
  const overdue = rows.filter((r) => String(r.status).toLowerCase() === "overdue").length;

  return <>
    <PageHeader eyebrow="Financials" title="Invoices" description="View billing records and outstanding amounts." />
    <div className="stats-grid">
      <StatCard icon={<FileText />} label="Invoices" value={rows.length} />
      <StatCard icon={<Wallet />} label="Total invoiced" value={`R ${total.toFixed(2)}`} tone="violet" />
      <StatCard icon={<CircleCheck />} label="Paid invoices" value={paid} tone="green" />
      <StatCard icon={<AlertCircle />} label="Overdue invoices" value={overdue} tone="amber" />
    </div>
    <Card><FinanceTableState loading={loading} error={error} empty={!rows.length} onRetry={load} /></Card>
    {!loading && !error && rows.length > 0 && <InvoiceTable rows={rows} />}
  </>;
}
