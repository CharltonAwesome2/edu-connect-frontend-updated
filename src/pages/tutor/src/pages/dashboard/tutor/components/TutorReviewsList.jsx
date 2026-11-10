import { Card, EmptyState, formatDate } from "@components/ui";

export default function TutorReviewsList({ reviews }) {
  return (
    <Card>
      <div className="card-heading"><h2>Student reviews</h2></div>

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" text="Reviews appear after completed sessions." />
      ) : (
        <div className="review-list">
          {reviews.map((r) => (
            <blockquote key={r.tutorReviewId}>
              <div>{"★".repeat(r.rating)}</div>
              <p>{r.comment || "No comment"}</p>
              <small>{formatDate(r.createdAt)}</small>
            </blockquote>
          ))}
        </div>
      )}
    </Card>
  );
}
