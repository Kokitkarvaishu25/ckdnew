import PredictionPanel from "@/components/PredictionPanel";

export default function DashboardHome() {
  return (
    <div className="max-w-5xl mx-auto animation-fade-in text-black">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Welcome back to X-GENO
        </h1>
        <p className="text-gray-500">
          Here's an overview of your clinical data and latest updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[#e5e5e5] shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Patients
          </h3>
          <p className="text-3xl font-mono font-semibold">1,248</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#e5e5e5] shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Active Cases
          </h3>
          <p className="text-3xl font-mono font-semibold">42</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#e5e5e5] shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Pending Reports
          </h3>
          <p className="text-3xl font-mono font-semibold">7</p>
        </div>
      </div>

      <div className="mb-8">
        <PredictionPanel />
      </div>

      {/* Placeholder for larger content like a table or chart */}
      <div className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#e5e5e5]">
          <h3 className="font-semibold">Recent Patient Activities</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg bg-[#fafafa] border border-[#f0f0f0]"
              >
                <div>
                  <p className="font-medium">Patient Record #{1000 + i}</p>
                  <p className="text-sm text-gray-500">Genomic sequence uploaded</p>
                </div>
                <span className="text-sm font-mono text-gray-400">2h ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
