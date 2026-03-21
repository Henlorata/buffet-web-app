const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-auto border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Buffet App</h3>
            <p className="text-sm leading-relaxed">
              The best food. Order at us with trust!
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><button className="hover:text-blue-400 transition-colors cursor-pointer"><a href="https://github.com/Henlorata/buffet-web-app" target="_blank">Github</a></button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contacts</h3>
            <p className="text-sm">Email: info@bufeapp.hu</p>
            <p className="text-sm">Tel: +36 30 123 4567</p>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-center text-xs">
          <p>© {new Date().getFullYear()} Buffet App</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer