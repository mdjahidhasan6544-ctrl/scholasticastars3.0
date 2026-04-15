import SectionCard from "./SectionCard.jsx";
import StatusBadge from "./StatusBadge.jsx";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value || 0);
}

export default function CourseGrid({ courses, onEdit, onDelete, isRefreshing }) {
  return (
    <SectionCard
      eyebrow="Catalog overview"
      title="Course inventory"
      description="A readout of the backend data store with direct update and delete actions."
      actions={isRefreshing ? <span className="inline-note">Refreshing…</span> : null}
      className="section-card--full"
    >
      {courses.length === 0 ? (
        <div className="empty-state">
          <p>No courses have been created yet.</p>
          <span>Use the creation panel above to seed your first academic product.</span>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => {
            const courseId = course._id || course.id;

            return (
              <article className="course-card" key={courseId}>
                <div
                  className="course-card__art"
                  style={
                    course.thumbnailUrl
                      ? { backgroundImage: `linear-gradient(180deg, rgba(8, 15, 32, 0.08), rgba(8, 15, 32, 0.82)), url(${course.thumbnailUrl})` }
                      : undefined
                  }
                >
                  <div className="course-card__badges">
                    <StatusBadge tone={course.isPublished ? "success" : "warning"}>
                      {course.isPublished ? "Published" : "Draft"}
                    </StatusBadge>
                    <StatusBadge tone={course.type === "paid" ? "accent" : "neutral"}>
                      {course.type}
                    </StatusBadge>
                  </div>
                </div>

                <div className="course-card__body">
                  <div>
                    <p className="eyebrow">{course.category}</p>
                    <h3>{course.title}</h3>
                    <p className="course-card__description">{course.description}</p>
                  </div>

                  <dl className="data-list">
                    <div>
                      <dt>Instructor</dt>
                      <dd>{course.instructor}</dd>
                    </div>
                    <div>
                      <dt>Price</dt>
                      <dd>{course.type === "paid" ? formatCurrency(course.price) : "Included"}</dd>
                    </div>
                    <div>
                      <dt>Duration</dt>
                      <dd>{course.durationInHours || 0}h</dd>
                    </div>
                    <div>
                      <dt>Order</dt>
                      <dd>{course.order}</dd>
                    </div>
                  </dl>

                  <div className="card-actions">
                    <button className="button button--ghost" type="button" onClick={() => onEdit(course)}>
                      Edit
                    </button>
                    <button className="button button--danger" type="button" onClick={() => onDelete(course)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}