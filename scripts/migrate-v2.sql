-- ============================================================
-- NexPro — Feature Migration v2
-- Run this in Supabase SQL Editor AFTER the initial seed.sql
-- ============================================================

-- 1. Property Views table (analytics)
CREATE TABLE IF NOT EXISTS public.property_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_hash TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewed_at ON public.property_views(viewed_at);

ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert views" ON public.property_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Agents can view their property stats" ON public.property_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE public.properties.id = property_views.property_id
      AND public.properties.agent_id = auth.uid()
    )
  );

-- 2. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('inquiry', 'favorite', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- 3. Property comparisons (ephemeral — stored client side via Zustand, no table needed)

-- 4. Add view_count computed via trigger
CREATE OR REPLACE FUNCTION public.notify_agent_on_inquiry()
RETURNS trigger AS $$
DECLARE
  v_property_title TEXT;
  v_agent_id UUID;
BEGIN
  SELECT title, agent_id INTO v_property_title, v_agent_id
  FROM public.properties WHERE id = NEW.property_id;

  INSERT INTO public.notifications (user_id, type, title, message, link)
  VALUES (
    v_agent_id,
    'inquiry',
    'New inquiry received',
    'Someone sent a message about: ' || v_property_title,
    '/dashboard/inquiries'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_inquiry ON public.inquiries;
CREATE TRIGGER on_new_inquiry
  AFTER INSERT ON public.inquiries
  FOR EACH ROW EXECUTE PROCEDURE public.notify_agent_on_inquiry();

-- 5. Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Verify
SELECT 'Migration v2 complete ✅' as status;
