import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('contact.successToast'));
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10" />
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">{t('contact.title')}</h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-white rounded-[3rem] p-4 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">

          {/* Elérhetőségek panel */}
          <div className="lg:col-span-2 space-y-8 bg-slate-900 p-8 md:p-10 rounded-[2.5rem] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <h3 className="text-2xl font-bold mb-8 relative">{t('contact.infoTitle')}</h3>

            <div className="space-y-8 relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10">
                  <Mail className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">{t('contact.emailTitle')}</p>
                  <p className="font-bold text-lg">{t('contact.emailValue')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10">
                  <Phone className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">{t('contact.phoneTitle')}</p>
                  <p className="font-bold text-lg">{t('contact.phoneValue')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10">
                  <MapPin className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">{t('contact.locationTitle')}</p>
                  <p className="font-bold text-lg leading-snug">{t('contact.locationValue')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Űrlap panel */}
          <div className="lg:col-span-3 p-4 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">{t('contact.nameLabel')}</label>
                  <input
                    required
                    type="text"
                    placeholder={t('contact.namePlaceholder')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 font-medium transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">{t('contact.emailLabel')}</label>
                  <input
                    required
                    type="email"
                    placeholder={t('contact.emailPlaceholder')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">{t('contact.messageLabel')}</label>
                <textarea
                  required
                  rows={5}
                  placeholder={t('contact.messagePlaceholder')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 font-medium resize-none transition-all"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95 group mt-4"
              >
                <span>{t('contact.sendBtn')}</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}