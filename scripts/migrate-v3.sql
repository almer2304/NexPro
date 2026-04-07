-- ============================================================
-- NexPro — Update Auth Trigger + Chat Tables
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- 1. Update trigger handle_new_user agar menyimpan phone_number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, phone_number)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'customer'),
    new.raw_user_meta_data->>'phone_number'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone_number = COALESCE(EXCLUDED.phone_number, public.profiles.phone_number),
    role = EXCLUDED.role;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Chat tables
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, buyer_id, agent_id)
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON public.chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_buyer ON public.chat_rooms(buyer_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_agent ON public.chat_rooms(agent_id);

-- 3. RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_rooms_access" ON public.chat_rooms;
CREATE POLICY "chat_rooms_access"
  ON public.chat_rooms FOR ALL
  USING (auth.uid() = buyer_id OR auth.uid() = agent_id);

DROP POLICY IF EXISTS "chat_messages_access" ON public.chat_messages;
CREATE POLICY "chat_messages_access"
  ON public.chat_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_rooms
      WHERE chat_rooms.id = chat_messages.room_id
      AND (chat_rooms.buyer_id = auth.uid() OR chat_rooms.agent_id = auth.uid())
    )
  );

-- 4. Trigger update timestamp chat_rooms
CREATE OR REPLACE FUNCTION public.update_chat_room_timestamp()
RETURNS trigger AS $$
BEGIN
  UPDATE public.chat_rooms SET updated_at = NOW() WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_chat_message ON public.chat_messages;
CREATE TRIGGER on_new_chat_message
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE PROCEDURE public.update_chat_room_timestamp();

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;

SELECT 'Migration selesai! ✅' AS status;
