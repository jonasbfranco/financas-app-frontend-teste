export default function StatCard({ label, value, icon: Icon, hint }) {

  const valorNumerico = Number(value);
  const negativo = valorNumerico < 0;

  return (
    <div 
      className={`rounded-2xl border p-5 shadow-sm ${
        negativo
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-white"
      }`}
      >
      <div className="flex items-center justify-between">
        <div>
          <p 
             className={`text-sm font-medium ${
              negativo ? "text-red-600" : "text-slate-500"
            }`}
          >
            {label}
          </p>
          <p 
            className={`mt-2 text-3xl font-bold ${
              negativo ? "text-red-700" : "text-slate-900"
            }`}
          >
            {value}
          </p>
          {hint && (
            <p 
              className={`mt-1 text-xs ${
                negativo ? "text-red-500" : "text-slate-400"
              }`}
            >
              {hint}
            </p>
          )}
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
