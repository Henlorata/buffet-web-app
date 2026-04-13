import { ShoppingBag, Star, Clock, Heart, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-bold mb-6">
                <Zap className="w-4 h-4 fill-amber-700" />
                <span>{t('home.heroBadge')}</span>
              </div>
              <h1 className="text-6xl font-black text-slate-900 leading-tight mb-6">
                {t('home.heroTitle')} <span className="text-amber-500 italic">{t('home.heroTitleHighlight')}</span> {t('home.heroTitleSuffix')}
              </h1>
              <p className="text-xl text-slate-500 mb-10 leading-relaxed">
                {t('home.heroDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/order"
                  className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-amber-500 transition-all shadow-xl hover:shadow-amber-500/20 active:scale-95 group"
                >
                  {t('home.orderBtn')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/order"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
                >
                  {t('home.menuBtn')}
                </Link>
              </div>
            </div>

            <div className="mt-16 lg:mt-0 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl rotate-2">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1000"
                  alt={t('home.heroImageAlt')}
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl -rotate-3 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t('home.rating')}</div>
                    <div className="text-sm text-slate-500">{t('home.ratingSub')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('home.feature1Title')}</h3>
              <p className="text-slate-500">{t('home.feature1Desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('home.feature2Title')}</h3>
              <p className="text-slate-500">{t('home.feature2Desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t('home.feature3Title')}</h3>
              <p className="text-slate-500">{t('home.feature3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/CTA */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative text-center max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-8">{t('home.ctaTitle')}</h2>
              <p className="text-amber-100/60 text-lg mb-12">
                {t('home.ctaDesc')}
              </p>
              <div className="flex flex-wrap justify-center gap-12">
                <div>
                  <div className="text-4xl font-black text-amber-500 mb-1">{t('home.stat1Value')}</div>
                  <div className="text-slate-400 font-medium">{t('home.stat1Label')}</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-amber-500 mb-1">{t('home.stat2Value')}</div>
                  <div className="text-slate-400 font-medium">{t('home.stat2Label')}</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-amber-500 mb-1">{t('home.stat3Value')}</div>
                  <div className="text-slate-400 font-medium">{t('home.stat3Label')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}