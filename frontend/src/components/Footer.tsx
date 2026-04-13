import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex items-center gap-2 text-amber-500 opacity-80 hover:opacity-100 transition-opacity">
            <Utensils className="w-5 h-5" />
            <span className="text-lg font-black tracking-tight text-slate-900">Buffet<span className="text-amber-500">App</span></span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link to="/terms" className="text-sm font-bold text-slate-500 hover:text-amber-500 transition-colors">{t('footer.terms')}</Link>
            <Link to="/privacy" className="text-sm font-bold text-slate-500 hover:text-amber-500 transition-colors">{t('footer.privacy')}</Link>
            <Link to="/contact" className="text-sm font-bold text-slate-500 hover:text-amber-500 transition-colors">{t('footer.contact')}</Link>
          </div>

          <div className="text-sm font-medium text-slate-400">
            &copy; {currentYear} BuffetApp. {t('footer.rights')}
          </div>
        </div>
      </div>
    </footer>
  );
}