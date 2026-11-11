import { useCallback, useEffect, useMemo, useState } from "react";
import { CreditCard, Clock, CircleCheck, Wallet } from "lucide-react";
import { payments } from "@api";
import { useAuth } from "@context/AuthContext";
import { Card, PageHeader, StatCard } from "@components/ui";
import { FinanceTableState, PaymentTable } from "@components/finance/FinanceTable";

export default function Payments() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = user?.userId ? await payments.byStudentId(user.userId) : [];
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load payments.");
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => { void load(); }, [load]);
  const paid = useMemo(() => rows.filter((r) => String(r.status).toLowerCase() === "paid"), [rows]);
  const pending = useMemo(() => rows.filter((r) => String(r.status).toLowerCase() === "pending"), [rows]);
  const total = useMemo(() => rows.reduce((sum, r) => sum + Number(r.amount || r.total || 0), 0), [rows]);

  return <>
    <PageHeader eyebrow="Financials" title="Payments" description="Review your EduConnect payment history and statuses." />
    <div className="stats-grid">
      <StatCard icon={<Wallet />} label="Total value" value={`R ${total.toFixed(2)}`} />
      <StatCard icon={<CircleCheck />} label="Paid payments" value={paid.length} tone="green" />
      <StatCard icon={<Clock />} label="Pending payments" value={pending.length} tone="amber" />
      <StatCard icon={<CreditCard />} label="Transactions" value={rows.length} tone="violet" />
    </div>
    <Card><FinanceTableState loading={loading} error={error} empty={!rows.length} onRetry={load} /></Card>
    {!loading && !error && rows.length > 0 && <PaymentTable rows={rows} />}
  </>;
}
