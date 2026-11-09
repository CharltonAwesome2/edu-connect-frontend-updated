import { useCallback, useEffect, useState } from "react";
import { admin } from "@api";
import { Card, EmptyState, Loading, Notice, PageHeader } from "@components/ui";

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const data = await admin.users(); setRows(Array.isArray(data) ? data : []); }
    catch (err) { setError(err.message || "Unable to load users."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  return <>
    <PageHeader eyebrow="Administration" title="Users" description="Review platform account records." />
    <Card>
      {loading && <Loading label="Loading users" />}
      {error && <Notice kind="error" onClose={load}>{error} Click to retry.</Notice>}
      {!loading && !error && !rows.length && <EmptyState title="No users" text="No users were returned." />}
      {!loading && !error && rows.length > 0 && <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Student</th><th>Tutor</th></tr></thead><tbody>{rows.map((row) => <tr key={row.userId || row.id || row.email}><td><b>{[row.name, row.surname].filter(Boolean).join(" ") || "-"}</b></td><td>{row.email || "-"}</td><td>{row.role || "-"}</td><td>{row.isStudent ? "Yes" : "No"}</td><td>{row.isTutor ? "Yes" : "No"}</td></tr>)}</tbody></table></div>}
    </Card>
  </>;
}
