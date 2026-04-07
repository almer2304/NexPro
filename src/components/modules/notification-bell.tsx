"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck, MessageSquare, Heart, Zap, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useNotificationStore } from "@/lib/stores";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/supabase/actions";
import { timeAgo } from "@/lib/utils";
import type { Notification } from "@/types";

const ICON_MAP = {
  inquiry: MessageSquare,
  favorite: Heart,
  system: Zap,
};

export function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, setNotifications, addNotification, markRead, markAllRead } =
    useNotificationStore();

  // Load initial notifications
  useEffect(() => {
    getNotifications().then((data) => setNotifications(data as Notification[]));
  }, []);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          addNotification(payload.new as Notification);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // Click outside to close
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleMarkRead(id: string) {
    markRead(id);
    await markNotificationRead(id);
  }

  async function handleMarkAllRead() {
    markAllRead();
    await markAllNotificationsRead();
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[#476083] hover:bg-[#f3f4f5] transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-card-hover border border-[#e1e3e4] overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f3f4f5]">
              <div className="flex items-center gap-2">
                <Bell size={15} className="text-[#476083]" />
                <p className="text-sm font-bold text-[#191c1d]">Notifications</p>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-label"
                >
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell size={24} className="text-[#c4c6cf] mx-auto mb-2" />
                  <p className="text-sm text-[#74777f] font-label">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = ICON_MAP[n.type] ?? Bell;
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-[#f3f4f5] last:border-0 transition-colors ${
                        !n.is_read ? "bg-emerald-50/50" : "hover:bg-[#f8f9fa]"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        n.type === "inquiry" ? "bg-blue-100" : n.type === "favorite" ? "bg-red-100" : "bg-amber-100"
                      }`}>
                        <Icon size={14} className={
                          n.type === "inquiry" ? "text-blue-600" : n.type === "favorite" ? "text-red-500" : "text-amber-600"
                        } />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-tight ${!n.is_read ? "font-bold text-[#191c1d]" : "font-medium text-[#476083]"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-[#74777f] font-label mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-[#c4c6cf] font-label mt-1">{timeAgo(n.created_at)}</p>
                      </div>
                      {!n.is_read && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#e7e8e9] transition-colors"
                        >
                          <Check size={12} className="text-[#74777f]" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-[#f3f4f5] text-center">
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs text-[#476083] hover:text-emerald-600 font-label transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
