import SectionCard from "./SectionCard.jsx";

export default function CourseForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  isSaving
}) {
  return (
    <SectionCard
      eyebrow="Courses CRUD"
      title={isEditing ? "Refine existing course" : "Create a new course"}
      description="Every course action here hits the deployed backend API. No local fallback is used."
    >
      <form className="course-form" onSubmit={onSubmit}>
        <div className="form-grid form-grid--wide">
          <label>
            <span>Title</span>
            <input name="title" value={values.title} onChange={onChange} required />
          </label>

          <label>
            <span>Category</span>
            <input name="category" value={values.category} onChange={onChange} required />
          </label>

          <label>
            <span>Instructor</span>
            <input name="instructor" value={values.instructor} onChange={onChange} required />
          </label>

          <label>
            <span>Type</span>
            <select name="type" value={values.type} onChange={onChange}>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </label>

          <label>
            <span>Price</span>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={values.price}
              onChange={onChange}
              disabled={values.type === "free"}
            />
          </label>

          <label>
            <span>Duration (hours)</span>
            <input
              name="durationInHours"
              type="number"
              min="0"
              step="0.5"
              value={values.durationInHours}
              onChange={onChange}
            />
          </label>

          <label>
            <span>Display order</span>
            <input name="order" type="number" min="0" value={values.order} onChange={onChange} />
          </label>

          <label>
            <span>Thumbnail URL</span>
            <input
              name="thumbnailUrl"
              type="url"
              value={values.thumbnailUrl}
              onChange={onChange}
              placeholder="https://images.example.com/course-cover.jpg"
            />
          </label>
        </div>

        <label>
          <span>Description</span>
          <textarea name="description" value={values.description} onChange={onChange} rows="5" required />
        </label>

        <label className="checkbox-field">
          <input name="isPublished" type="checkbox" checked={values.isPublished} onChange={onChange} />
          <span>Publish immediately</span>
        </label>

        <div className="form-actions">
          <button className="button button--primary" type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : isEditing ? "Update course" : "Create course"}
          </button>

          {isEditing ? (
            <button className="button button--ghost" type="button" onClick={onCancel}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
    </SectionCard>
  );
}