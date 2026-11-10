import { Card, EmptyState } from "@components/ui";

export default function AvailabilityManager({ slots, onToggle }) {
  return (
    <Card>
      <div className="card-heading">
        <h2>Weekly availability</h2>
      </div>

      {slots.length === 0 ? (
        <EmptyState title="No availability set" text="Add slots to start receiving requests." />
      ) : (
        <div className="availability-list">
          {slots.map((slot) => (
            <div key={slot.availabilityId}>
              <button
                className={`availability-slot ${slot.isAvailable ? "selected" : ""}`}
                onClick={() => onToggle(slot)}
              >
                <b>{slot.dayOfWeek}</b>
                <span>{slot.startTime} – {slot.endTime}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
