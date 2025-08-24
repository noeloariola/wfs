export default function UnderMaintenanceModePage(prop: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold mb-4">{prop.title}</h1>
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded shadow">
        <p>
          This page is currently under maintenance and being updated.
          <br />
          Please check back soon!
        </p>
      </div>
    </div>
  );
}