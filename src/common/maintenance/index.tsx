export default function UnderMaintenanceModePage(prop: { title: string }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-3xl rounded-[2rem] border border-green-200/70 bg-white/95 p-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <div className="mb-6 inline-flex rounded-full bg-green-100/80 px-4 py-2 text-sm font-semibold text-[var(--accent-strong)] ring-1 ring-green-200/30">
          Under Maintenance
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--accent-strong)]">{prop.title}</h1>
        <p className="mt-4 max-w-2xl text-gray-600 leading-7">
          This page is currently under maintenance and being updated. Please check back soon for a refreshed Fluent-inspired experience.
        </p>
      </div>
    </div>
  );
}