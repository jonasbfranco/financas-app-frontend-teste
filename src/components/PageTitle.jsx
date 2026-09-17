export default function PageTitle({ title, description, action }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      </div>

      {action}
    </div>
  );
}
