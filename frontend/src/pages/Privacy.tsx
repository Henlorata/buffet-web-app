import { Shield, Lock, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">

        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />

          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900">{t('privacy.title')}</h1>
          </div>

          <div className="space-y-10 text-slate-600 font-medium leading-relaxed">
            <p className="text-lg">{t('privacy.intro')}</p>

            <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-black text-slate-800">{t('privacy.sec1Title')}</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0" />
                  <span className="text-slate-700">{t('privacy.sec1Item1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0" />
                  <span className="text-slate-700">{t('privacy.sec1Item2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0" />
                  <span className="text-slate-700">{t('privacy.sec1Item3')}</span>
                </li>
              </ul>
            </section>

            <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-black text-slate-800">{t('privacy.sec2Title')}</h2>
              </div>
              <p className="text-slate-700 leading-loose">
                {t('privacy.sec2Desc')}
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}