import { Card, EmptyState, StatusBadge, formatDate, money } from "@components/ui";

export default function UpcomingSessions({ sessions, title = "Upcoming sessions" }) {
  return (
    <Card className="span-two">
      <div className="card-heading">
        <div>
          <span className="eyebrow">Schedule</span>
          <h2>{title}</h2>
        </div>
      </div>

      {sessions.length === 0 ? (
        <EmptyState title="No sessions" text="Sessions will appear here." />
      ) : (
        <div className="session-list">
          {sessions.map((s) => (
            <SessionRow key={s.tutoringSessionId} session={s} />
          ))}
        </div>
      )}
    </Card>
  );
}

function SessionRow({ session }) {
  const d = new Date(session.startTime);
  return (
    <div className="session-row">
      <div className="date-tile">
        <b>{d.getDate()}</b>
        <span>{d.toLocaleString("en", { month: "short" })}</span>
      </div>
      <div className="session-info">
        <h3>{session.subject?.subjectName || "Tutoring session"}</h3>
        <p>{formatDate(session.startTime)} · {money(session.amount)}</p>
      </div>
      <StatusBadge status={session.status} />
    </div>
  );
}
