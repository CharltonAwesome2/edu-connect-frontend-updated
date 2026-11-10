import { useCallback, useEffect, useState } from "react";
import { admin } from "@api";
import { Card, EmptyState, Loading, Notice, PageHeader, StatusBadge, formatDate } from "@components/ui";

export default function AdminReports() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const data = await admin.reports(); setRows(Array.isArray(data) ? data : []); }
    catch (err) { setError(err.message || "Unable to load admin reports."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  return <>
    <PageHeader eyebrow="Administration" title="Admin reports" description="Review platform reports and moderation records." />
    <Card>
      {loading && <Loading label="Loading reports" />}
      {error && <Notice kind="error" onClose={load}>{error} Click to retry.</Notice>}
      {!loading && !error && !rows.length && <EmptyState title="No reports" text="No platform reports were returned." />}
      {!loading && !error && rows.length > 0 && <div className="table-wrap"><table><thead><tr><th>Date</th><th>Reporter</th><th>Reported user</th><th>Status</th><th>Details</th></tr></thead><tbody>{rows.map((row) => <tr key={row.reportId || row.id}><td>{formatDate(row.reportedAt || row.createdAt)}</td><td>{row.reporterId || row.reporter?.userId || "-"}</td><td>{row.reportedUserId || row.reportedUser?.userId || "-"}</td><td><StatusBadge status={row.status || "Open"} /></td><td>{row.description || row.message || "-"}</td></tr>)}</tbody></table></div>}
    </Card>
  </>;
}
