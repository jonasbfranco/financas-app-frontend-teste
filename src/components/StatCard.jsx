export default function StatCard({ label, value, icon: Icon, hint }) {

  const valorNumerico = Number(value);
  const negativo = valorNumerico < 0;
  const positivo = valorNumerico >= 0;

  return (
    <div 
      className={`rounded-2xl border p-5 shadow-sm ${
        negativo
          ? "border-red-200 bg-red-50"
          : positivo ? "border-green-200 bg-green-50" 
          : "border-slate-200 bg-white"
      }`}
      >
      <div className="flex items-center justify-between">
        <div>
          <p 
             className={`text-sm font-medium ${
              negativo ? "text-red-600" 
              : positivo ? "text-green-600" : "text-slate-500"
            }`}
          >
            {label}
          </p>
          <p 
            className={`mt-2 text-3xl font-bold ${
              negativo ? "text-red-700" 
              : positivo ? "text-green-700" : "text-slate-900"
            }`}
          >
            {value}
          </p>
          {hint && (
            <p 
              className={`mt-1 text-xs ${
                negativo ? "text-red-500" 
                : positivo ? "text-green-500" : "text-slate-400"
              }`}
            >
              {hint}
            </p>
          )}
        </div>
        <div className={`rounded-2xl ${negativo ? "bg-red-200" : positivo ? "bg-green-200" : "bg-slate-100"} p-3 text-slate-700`}>
          <Icon className={`h-6 w-6 ${negativo ? "text-red-800" : positivo ? "text-green-800" : "text-slate-800"}`} />
        </div>
      </div>
    </div>
  );
}
