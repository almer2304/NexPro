import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Syarat & Ketentuan | NexPro" };

const sections = [
  {
    title: "1. Penerimaan Syarat",
    content: `Dengan mengakses dan menggunakan platform NexPro (website, aplikasi mobile, atau layanan terkait), Anda menyatakan telah membaca, memahami, dan menyetujui Syarat & Ketentuan ini.

Jika Anda tidak menyetujui syarat-syarat ini, mohon untuk tidak menggunakan layanan NexPro. Penggunaan berkelanjutan atas platform setelah perubahan syarat dianggap sebagai penerimaan atas perubahan tersebut.`,
  },
  {
    title: "2. Deskripsi Layanan",
    content: `NexPro adalah marketplace properti digital yang menghubungkan:
- **Pembeli dan Penyewa**: individu yang mencari properti untuk dibeli atau disewa
- **Agen Properti**: profesional terverifikasi yang memasarkan properti klien
- **Pemilik Properti**: individu yang ingin menjual atau menyewakan properti

NexPro bertindak sebagai platform perantara dan tidak secara langsung terlibat dalam transaksi properti antara pengguna.`,
  },
  {
    title: "3. Pendaftaran Akun",
    content: `Untuk menggunakan fitur tertentu, Anda perlu membuat akun NexPro. Dengan membuat akun, Anda menyetujui untuk:

- Memberikan informasi yang akurat, lengkap, dan terkini
- Menjaga kerahasiaan password akun Anda
- Bertanggung jawab atas semua aktivitas yang terjadi di akun Anda
- Segera memberitahu kami jika ada penggunaan akun yang tidak sah

NexPro berhak menangguhkan atau menghapus akun yang melanggar syarat ini.`,
  },
  {
    title: "4. Ketentuan untuk Agen Properti",
    content: `Agen yang mendaftar di NexPro wajib:

- Memiliki izin praktik sebagai agen properti yang sah di Indonesia
- Memastikan semua informasi listing akurat dan tidak menyesatkan
- Memiliki hak atau otorisasi untuk memasarkan properti yang didaftarkan
- Merespons inquiry calon pembeli/penyewa dalam waktu yang wajar (maks. 2x24 jam)
- Tidak menggunakan platform untuk aktivitas penipuan atau ilegal

Pelanggaran ketentuan ini dapat mengakibatkan penghapusan akun dan dilaporkan ke pihak berwenang.`,
  },
  {
    title: "5. Konten yang Dilarang",
    content: `Pengguna dilarang memposting atau menyebarkan konten yang:

- Mengandung informasi palsu, menyesatkan, atau tidak akurat tentang properti
- Melanggar hak kekayaan intelektual pihak lain
- Bersifat diskriminatif berdasarkan suku, agama, ras, atau golongan
- Mengandung konten pornografi, kekerasan, atau ilegal
- Digunakan untuk kegiatan pencucian uang atau transaksi ilegal
- Berupa spam, iklan tidak sah, atau manipulasi sistem

NexPro berhak menghapus konten yang melanggar ketentuan ini tanpa pemberitahuan.`,
  },
  {
    title: "6. Hak Kekayaan Intelektual",
    content: `Semua konten di platform NexPro, termasuk logo, desain, teks, grafis, dan kode sumber, adalah milik NexPro Indonesia atau pemegang lisensinya dan dilindungi oleh hukum kekayaan intelektual Indonesia.

Anda diberikan lisensi terbatas, non-eksklusif, dan tidak dapat dipindahkan untuk menggunakan platform sesuai syarat ini. Anda tidak boleh mereproduksi, mendistribusikan, atau membuat karya turunan tanpa izin tertulis dari NexPro.`,
  },
  {
    title: "7. Privasi dan Perlindungan Data",
    content: `Penggunaan data pribadi Anda diatur dalam Kebijakan Privasi NexPro yang merupakan bagian tidak terpisahkan dari Syarat & Ketentuan ini. Dengan menggunakan layanan NexPro, Anda menyetujui pengumpulan dan penggunaan data sesuai Kebijakan Privasi kami.`,
  },
  {
    title: "8. Batasan Tanggung Jawab",
    content: `NexPro menyediakan platform sebagai-mana-adanya ("as is") tanpa jaminan tersurat maupun tersirat. NexPro tidak bertanggung jawab atas:

- Keakuratan informasi listing yang diposting oleh agen atau pemilik properti
- Transaksi properti yang terjadi antara pengguna
- Kerugian yang timbul dari penggunaan atau ketidakmampuan menggunakan platform
- Gangguan layanan akibat pemeliharaan atau kejadian di luar kendali kami
- Tindakan atau kelalaian pihak ketiga

Total kewajiban NexPro kepada Anda tidak akan melebihi jumlah yang Anda bayarkan kepada NexPro dalam 12 bulan terakhir.`,
  },
  {
    title: "9. Penyelesaian Sengketa",
    content: `Syarat & Ketentuan ini diatur oleh hukum Republik Indonesia. Jika terjadi sengketa yang tidak dapat diselesaikan melalui negosiasi dalam 30 hari, para pihak sepakat untuk menyelesaikannya melalui:

1. Mediasi oleh mediator yang disepakati bersama
2. Jika mediasi gagal, melalui Pengadilan Negeri Jakarta Selatan

Anda setuju untuk melepaskan hak menggugat sebagai bagian dari class action (gugatan kelompok).`,
  },
  {
    title: "10. Perubahan Layanan",
    content: `NexPro berhak untuk mengubah, menangguhkan, atau menghentikan layanan (atau bagian dari layanan) kapan saja dengan atau tanpa pemberitahuan. NexPro tidak bertanggung jawab atas perubahan, penangguhan, atau penghentian layanan tersebut.`,
  },
  {
    title: "11. Kontak",
    content: `Untuk pertanyaan tentang Syarat & Ketentuan ini, hubungi:

Email: legal@nexpro.id
Alamat: Jl. Sudirman Kav. 52, Jakarta Selatan 12190, Indonesia
Telepon: +62 21 5000 8888`,
  },
];

export default function TermsPage() {
  return (
    <div className="pt-20 pb-16 min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="bg-[#000802] text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-label mb-4 block">Legal</span>
          <h1 className="text-4xl font-extrabold mb-3">Syarat & Ketentuan</h1>
          <p className="text-white/60 font-label">
            Terakhir diperbarui: 1 Januari 2026 · Berlaku untuk semua pengguna NexPro
          </p>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-[#e1e3e4] p-6 mb-8">
          <p className="text-xs font-bold text-[#476083] uppercase tracking-wider font-label mb-4">Daftar Isi</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map(({ title }, i) => (
              <a
                key={title}
                href={`#section-${i}`}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-label hover:underline"
              >
                {title}
              </a>
            ))}
          </div>
        </div>

        {/* Intro */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8">
          <p className="text-sm text-amber-800 font-label leading-relaxed">
            ⚠️ <strong>Penting:</strong> Harap baca Syarat & Ketentuan ini dengan saksama sebelum menggunakan layanan NexPro. Dokumen ini merupakan perjanjian yang mengikat secara hukum antara Anda dan NexPro Indonesia.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map(({ title, content }, i) => (
            <section key={title} id={`section-${i}`} className="bg-white rounded-2xl border border-[#e1e3e4] p-6">
              <h2 className="text-base font-bold text-[#000802] mb-4">{title}</h2>
              <div className="text-sm text-[#476083] font-label leading-relaxed space-y-3">
                {content.split("\n\n").map((para, j) => (
                  <p key={j} className="whitespace-pre-line">{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 p-5 bg-white rounded-2xl border border-[#e1e3e4] text-center">
          <p className="text-sm text-[#476083] font-label">
            Dengan menggunakan NexPro, Anda menyatakan telah membaca dan menyetujui syarat ini.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link href="/privacy" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold">
              Kebijakan Privasi
            </Link>
            <span className="text-[#c4c6cf]">·</span>
            <Link href="/about" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold">
              Tentang Kami
            </Link>
            <span className="text-[#c4c6cf]">·</span>
            <Link href="/search" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold">
              Mulai Cari Properti
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
