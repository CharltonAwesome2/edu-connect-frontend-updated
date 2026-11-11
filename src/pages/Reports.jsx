import { useCallback, useEffect, useState } from "react";
import { reports } from "@api";
import { useAuth } from "@context/AuthContext";
import { Card, EmptyState, Loading, Notice, PageHeader, StatusBadge, formatDate } from "@components/ui";

export default function Reports() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const data = await reports.byReporterId(user?.userId); setRows(Array.isArray(data) ? data : []); }
    catch (err) { setError(err.message || "Unable to load reports."); }
    finally { setLoading(false); }
  }, [user?.userId]);
  useEffect(() => { void load(); }, [load]);

  return <>
    <PageHeader eyebrow="Activity" title="Reports" description="Review reports submitted from your account." />
    <Card>
      {loading && <Loading label="Loading reports" />}
      {error && <Notice kind="error" onClose={load}>{error} Click to retry.</Notice>}
      {!loading && !error && !rows.length && <EmptyState title="No reports found" text="There are no reports associated with your account." />}
      {!loading && !error && rows.length > 0 && <div className="table-wrap"><table><thead><tr><th>Date</th><th>Subject</th><th>Status</th><th>Details</th></tr></thead><tbody>{rows.map((row) => <tr key={row.reportId || row.id}><td>{formatDate(row.reportedAt || row.createdAt)}</td><td>{row.subject || row.reason || "-"}</td><td><StatusBadge status={row.status || "Open"} /></td><td>{row.description || row.message || "-"}</td></tr>)}</tbody></table></div>}
    </Card>
  </>;
}
