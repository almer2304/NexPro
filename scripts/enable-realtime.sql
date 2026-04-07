-- ============================================================
-- NexPro — Enable Realtime untuk Chat
-- Jalankan di Supabase → SQL Editor
-- ============================================================

-- Enable Realtime publication untuk tabel chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;

-- Verifikasi
SELECT pubname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
  AND tablename IN ('chat_messages', 'chat_rooms');

-- Harusnya muncul 2 rows:
-- supabase_realtime | chat_messages
-- supabase_realtime | chat_rooms

SELECT 'Realtime enabled untuk chat! ✅' AS status;

-- ============================================================
-- CATATAN PENTING:
-- Setelah menjalankan SQL ini, pergi ke:
-- Supabase Dashboard → Database → Replication
-- Pastikan "chat_messages" dan "chat_rooms" tercentang di
-- bagian "Source" / "supabase_realtime"
-- ============================================================
