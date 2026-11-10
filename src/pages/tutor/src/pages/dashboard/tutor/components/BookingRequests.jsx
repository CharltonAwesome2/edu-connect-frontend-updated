import { CalendarCheck2, CheckCircle2, XCircle } from "lucide-react";
import { Card, EmptyState, StatusBadge, formatDate, money } from "@components/ui";

export default function BookingRequests({ requests, onAction, compact = false }) {
  return (
    <Card>
      <div className="card-heading">
        <div>
          <span className="eyebrow">Requests</span>
          <h2>{compact ? "Pending" : "All booking requests"}</h2>
        </div>
      </div>

      {requests.length === 0 ? (
        <EmptyState title="Nothing here" text="No booking requests to show." />
      ) : (
        <div className="request-list">
          {requests.map((r) => (
            <article key={r.bookingRequestId}>
              <span className="request-icon"><CalendarCheck2 size={16} /></span>
              <div>
                <h3>{r.subject?.subjectName || "Session request"}</h3>
                <p>{formatDate(r.preferredStartTime)} · {money(r.offeredAmount)}</p>
                {!compact && <small>Student: {r.student?.name || r.studentId}</small>}
              </div>
              <StatusBadge status={r.status} />
              {r.status === "PENDING" && (
                <div className="request-actions">
                  <button
                    className="button button-success"
                    onClick={() => onAction(r, "ACCEPTED")}
                  >
                    <CheckCircle2 size={14} /> Accept
                  </button>
                  <button
                    className="button button-danger"
                    onClick={() => onAction(r, "DECLINED")}
                  >
                    <XCircle size={14} /> Decline
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </Card>
  );
}
