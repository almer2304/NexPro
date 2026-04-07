import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kebijakan Privasi | NexPro" };

const sections = [
  {
    title: "1. Informasi yang Kami Kumpulkan",
    content: `Kami mengumpulkan beberapa jenis informasi untuk menyediakan dan meningkatkan layanan NexPro:

**Informasi yang Anda berikan:**
- Data akun: nama lengkap, alamat email, nomor telepon, dan password
- Informasi profil: foto profil dan preferensi pencarian
- Data listing: informasi properti yang Anda pasang (untuk agen)
- Pesan dan komunikasi: pesan inquiry dan chat dengan agen/pembeli

**Informasi yang dikumpulkan otomatis:**
- Data penggunaan: halaman yang dikunjungi, properti yang dilihat, fitur yang digunakan
- Informasi perangkat: jenis browser, sistem operasi, alamat IP
- Data lokasi: lokasi kota (tidak presisi) untuk menyesuaikan hasil pencarian`,
  },
  {
    title: "2. Bagaimana Kami Menggunakan Informasi Anda",
    content: `Informasi yang kami kumpulkan digunakan untuk:

- **Menyediakan layanan**: memproses pendaftaran, menampilkan listing, menghubungkan pembeli dengan agen
- **Personalisasi**: menyesuaikan rekomendasi properti berdasarkan preferensi Anda
- **Komunikasi**: mengirimkan notifikasi inquiry, update listing, dan informasi akun
- **Keamanan**: mendeteksi dan mencegah aktivitas penipuan atau pelanggaran
- **Analitik**: memahami cara pengguna menggunakan platform untuk terus meningkatkan layanan
- **Hukum**: mematuhi kewajiban hukum yang berlaku di Indonesia`,
  },
  {
    title: "3. Berbagi Informasi dengan Pihak Ketiga",
    content: `NexPro tidak menjual data pribadi Anda. Kami hanya berbagi informasi dalam kondisi berikut:

- **Antar pengguna**: informasi kontak agen ditampilkan kepada calon pembeli yang tertarik
- **Penyedia layanan**: mitra teknologi yang membantu operasional platform (hosting, analitik, pembayaran)
- **Hukum**: jika diwajibkan oleh peraturan perundang-undangan atau perintah pengadilan
- **Pelindungan hak**: untuk melindungi hak, properti, atau keselamatan NexPro dan penggunanya`,
  },
  {
    title: "4. Keamanan Data",
    content: `Kami menggunakan langkah-langkah keamanan industri untuk melindungi data Anda:

- Enkripsi SSL/TLS untuk semua transmisi data
- Password disimpan dalam bentuk hash menggunakan algoritma bcrypt
- Akses database dibatasi melalui Row Level Security (RLS) Supabase
- Backup data dilakukan secara rutin
- Audit keamanan berkala

Meskipun kami berusaha keras untuk melindungi data Anda, tidak ada sistem yang 100% aman. Kami mendorong Anda untuk menggunakan password yang kuat dan menjaga kerahasiaan kredensial akun Anda.`,
  },
  {
    title: "5. Hak-Hak Anda",
    content: `Sesuai dengan regulasi perlindungan data yang berlaku, Anda memiliki hak untuk:

- **Akses**: meminta salinan data pribadi yang kami simpan tentang Anda
- **Koreksi**: memperbarui atau memperbaiki informasi yang tidak akurat
- **Penghapusan**: meminta penghapusan akun dan data Anda
- **Portabilitas**: mendapatkan data Anda dalam format yang dapat dibaca mesin
- **Keberatan**: menolak pemrosesan data untuk tujuan pemasaran

Untuk menggunakan hak-hak ini, hubungi kami di privacy@nexpro.id`,
  },
  {
    title: "6. Cookie dan Teknologi Pelacakan",
    content: `NexPro menggunakan cookie dan teknologi serupa untuk:

- Menjaga sesi login Anda tetap aktif
- Mengingat preferensi dan pengaturan Anda
- Menganalisis penggunaan platform secara anonim
- Meningkatkan performa dan pengalaman pengguna

Anda dapat mengatur browser untuk menolak cookie, namun ini dapat mempengaruhi fungsionalitas tertentu dari platform.`,
  },
  {
    title: "7. Retensi Data",
    content: `Kami menyimpan data Anda selama akun Anda aktif atau selama diperlukan untuk menyediakan layanan. Jika Anda menghapus akun, kami akan menghapus atau menyamarkan data Anda dalam waktu 30 hari, kecuali kami diwajibkan oleh hukum untuk menyimpannya lebih lama.`,
  },
  {
    title: "8. Perubahan Kebijakan",
    content: `Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di platform setidaknya 7 hari sebelum berlaku. Penggunaan berkelanjutan Anda atas layanan setelah perubahan berlaku dianggap sebagai persetujuan atas kebijakan yang diperbarui.`,
  },
  {
    title: "9. Hubungi Kami",
    content: `Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi:

- Email: privacy@nexpro.id
- Alamat: Jl. Sudirman Kav. 52, Jakarta Selatan 12190
- Telepon: +62 21 5000 8888

Kami berkomitmen untuk merespons pertanyaan Anda dalam waktu 3 hari kerja.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-20 pb-16 min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="bg-[#000802] text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-label mb-4 block">Legal</span>
          <h1 className="text-4xl font-extrabold mb-3">Kebijakan Privasi</h1>
          <p className="text-white/60 font-label">
            Terakhir diperbarui: 1 Januari 2026 · Berlaku untuk semua pengguna NexPro
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-[#e1e3e4] p-6 mb-8">
          <p className="text-[#476083] font-label leading-relaxed text-sm">
            NexPro Indonesia ("NexPro", "kami", "kita") berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform NexPro.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map(({ title, content }) => (
            <section key={title} className="bg-white rounded-2xl border border-[#e1e3e4] p-6">
              <h2 className="text-lg font-bold text-[#000802] mb-4">{title}</h2>
              <div className="text-sm text-[#476083] font-label leading-relaxed space-y-3">
                {content.split("\n\n").map((para, i) => (
                  <p key={i} className="whitespace-pre-line">{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
