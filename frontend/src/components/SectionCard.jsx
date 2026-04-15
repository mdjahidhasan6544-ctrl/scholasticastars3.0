export default function SectionCard({ eyebrow, title, description, actions, children, className = "" }) {
  return (
    <section className={`section-card ${className}`.trim()}>
      <header className="section-card__header">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          {description ? <p className="section-description">{description}</p> : null}
        </div>

        {actions ? <div className="section-card__actions">{actions}</div> : null}
      </header>

      {children}
    </section>
  );
}