import { FileText, Shield, Scale, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Terms() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12 border-b border-slate-50 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                <FileText className="w-8 h-8 text-amber-400" />
              </div>
              <h1 className="text-4xl font-black mb-4">{t('terms.title')}</h1>
              <p className="text-slate-400 font-medium">{t('terms.lastUpdated')}</p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">{t('terms.section1Title')}</h2>
              </div>
              <div className="text-slate-600 leading-relaxed space-y-4">
                <p>{t('terms.section1P1')}</p>
                <p>{t('terms.section1P2')}</p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Scale className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">{t('terms.section2Title')}</h2>
              </div>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      <span>{t('terms.section2Item1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      <span>{t('terms.section2Item2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      <span>{t('terms.section2Item3')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">{t('terms.section3Title')}</h2>
              </div>
              <div className="text-slate-600 leading-relaxed">
                <p>{t('terms.section3P1')}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}