import { Bell, BellDot, Trash2 } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export default function NotificationCenter() {
  const { notifications, markAsRead, clearAll } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-slate-600 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-all">
          {unreadCount > 0 ? <BellDot className="w-5 h-5 text-amber-500 animate-bounce" /> : <Bell className="w-5 h-5" />}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white rounded-2xl shadow-2xl border-slate-100 overflow-hidden" align="end">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-slate-900">Értesítések</h3>
          <div className="flex gap-2">
            <button onClick={clearAll} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-400 font-medium">Nincs új értesítésed.</p>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-4 border-b border-slate-50 last:border-0 cursor-pointer transition-colors ${n.read ? 'opacity-60' : 'bg-amber-50/30'}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <p className="font-bold text-sm text-slate-900">{n.title}</p>
                  {!n.read && <div className="w-2 h-2 bg-amber-500 rounded-full mt-1"></div>}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                  {new Intl.DateTimeFormat('hu-HU', { hour: '2-digit', minute: '2-digit' }).format(n.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}