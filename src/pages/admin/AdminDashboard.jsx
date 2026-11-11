import { useCallback, useEffect, useMemo, useState } from "react";
import { CreditCard, FileText, Flag, Users } from "lucide-react";
import { admin } from "@api";
import { Card, EmptyState, Loading, Notice, PageHeader, StatCard, money } from "@components/ui";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setData(await admin.dashboard()); }
    catch (err) { setError(err.message || "Unable to load the admin dashboard."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const paymentTotal = useMemo(() => (data?.payments || []).reduce((sum, row) => sum + Number(row.amount || row.total || 0), 0), [data]);

  return <>
    <PageHeader eyebrow="Administration" title="Admin dashboard" description="Platform-wide users, payments, invoices, and reports." />
    {loading && <Card><Loading label="Loading dashboard" /></Card>}
    {error && <Card><Notice kind="error" onClose={load}>{error} Click to retry.</Notice></Card>}
    {!loading && !error && data && <>
      <div className="stats-grid">
        <StatCard icon={<Users />} label="Users" value={data.users.length} />
        <StatCard icon={<CreditCard />} label="Payment value" value={money(paymentTotal)} tone="green" />
        <StatCard icon={<FileText />} label="Invoices" value={data.invoices.length} tone="violet" />
        <StatCard icon={<Flag />} label="Reports" value={data.reports.length} tone="amber" />
      </div>
      <Card><h2>Administration overview</h2><p>Use the sidebar to inspect financial records, reports, and users.</p></Card>
    </>}
    {!loading && !error && !data && <EmptyState title="No dashboard data" text="The admin dashboard returned no data." />}
  </>;
}
