import { Card, money } from "@components/ui";

export default function EarningsSummary({ sessions }) {
  const completed = sessions.filter((s) => s.status === "COMPLETED");
  const total = completed.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  return (
    <Card>
      <div className="card-heading">
        <div>
          <span className="eyebrow">Earnings</span>
          <h2>Summary</h2>
        </div>
      </div>
      <div className="earnings-summary">
        <div>
          <small>Total earned</small>
          <strong>{money(total)}</strong>
        </div>
        <div>
          <small>Completed sessions</small>
          <strong>{completed.length}</strong>
        </div>
      </div>
    </Card>
  );
}
