// Halaman: Ringkasan Portofolio (M1.1)
// Data dummy static — ganti dengan API call nanti

const stats = [
  { label: 'Total nasabah aktif', value: '82.450', change: '+1.2% bulan ini', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { label: 'Cluster aktif', value: '7', change: 'Persona teridentifikasi', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { label: 'Rata-rata profitabilitas', value: 'Rp 412rb', change: '+3.8% vs bulan lalu', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  { label: 'Nasabah watchlist churn', value: '1.084', change: 'Perlu perhatian', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
];

const churnPerCabang = [
  { cabang: 'Bandung', persen: 14, color: 'bg-emerald-500' },
  { cabang: 'Cimahi', persen: 22, color: 'bg-blue-500' },
  { cabang: 'Soreang', persen: 31, color: 'bg-red-500' },
  { cabang: 'Garut', persen: 18, color: 'bg-amber-500' },
  { cabang: 'Sumedang', persen: 12, color: 'bg-emerald-500' },
  { cabang: 'Majalaya', persen: 27, color: 'bg-orange-500' },
];

const produkTerlaris = [
  { nama: 'Tabungan berjangka', jumlah: 142 },
  { nama: 'Kredit multiguna', jumlah: 97 },
  { nama: 'Deposito digital', jumlah: 64 },
];

const watchlist = [
  { nasabah: 'Dedi Supriatna', persona: 'Mass affluent saver', churnScore: '82%', profitabilitas: 'Rp 1.4jt', prioritas: 'Hi priority' },
  { nasabah: 'Sri Wahyuni', persona: 'Stable retiree', churnScore: '71%', profitabilitas: 'Rp 980rb', prioritas: 'Med priority' },
  { nasabah: 'Agus Hidayat', persona: 'Young urban professional', churnScore: '64%', profitabilitas: 'Rp 560rb', prioritas: 'Low priority' },
  { nasabah: 'Nina Marlina', persona: 'Mass affluent saver', churnScore: '79%', profitabilitas: 'Rp 1.1jt', prioritas: 'Hi priority' },
];

function PrioritasBadge({ prioritas }: { prioritas: string }) {
  const colors: Record<string, string> = {
    'Hi priority': 'bg-red-100 text-red-700',
    'Med priority': 'bg-yellow-100 text-yellow-700',
    'Low priority': 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[prioritas] || 'bg-slate-100 text-slate-600'}`}>
      {prioritas}
    </span>
  );
}

export function ExecutivePortfolio() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ringkasan Portofolio</h1>
        <p className="text-sm text-slate-500 mt-1">
          Portofolio: 82.450 nasabah aktif · Terakhir diperbarui hari ini, 06.00 WIB
          <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-green-600 ml-1">Live</span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-xl border p-5 ${stat.bg} ${stat.border}`}>
            <p className="text-sm text-slate-600">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            <p className={`text-sm mt-1 ${stat.color}`}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Churn distribution per cabang */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-1">Churn distribution — semua cabang</h2>
          <p className="text-sm text-slate-500 mb-4">Skor churn rata-rata per cabang</p>
          <div className="space-y-3">
            {churnPerCabang.map((item) => (
              <div key={item.cabang} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-24">{item.cabang}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-4">
                  <div
                    className={`${item.color} h-4 rounded-full`}
                    style={{ width: `${item.persen * 2.5}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-slate-700 w-10 text-right">{item.persen}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Produk terlaris */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Produk terlaris hari ini</h2>
          <div className="space-y-4">
            {produkTerlaris.map((produk) => (
              <div key={produk.nama} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{produk.nama}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-100 rounded-full h-3">
                    <div
                      className="bg-indigo-500 h-3 rounded-full"
                      style={{ width: `${(produk.jumlah / 150) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-700 w-8 text-right">{produk.jumlah}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Watchlist table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Watchlist prioritas — tindak lanjut hari ini</h2>
          <a href="#" className="text-sm text-blue-600 hover:underline">Lihat semua →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 font-medium text-slate-600">Nasabah</th>
                <th className="text-left py-3 px-2 font-medium text-slate-600">Persona</th>
                <th className="text-left py-3 px-2 font-medium text-slate-600">Churn score</th>
                <th className="text-left py-3 px-2 font-medium text-slate-600">Profitabilitas</th>
                <th className="text-left py-3 px-2 font-medium text-slate-600">Prioritas</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((row) => (
                <tr key={row.nasabah} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-2 font-medium text-slate-900">{row.nasabah}</td>
                  <td className="py-3 px-2 text-slate-600">{row.persona}</td>
                  <td className="py-3 px-2 text-slate-700">{row.churnScore}</td>
                  <td className="py-3 px-2 text-slate-700">{row.profitabilitas}</td>
                  <td className="py-3 px-2"><PrioritasBadge prioritas={row.prioritas} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
