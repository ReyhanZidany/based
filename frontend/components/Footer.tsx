export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center gap-6">
                    <a href="https://base.org" target="_blank" className="text-gray-400 hover:text-blue-600 transition-colors">
                        Base
                    </a>
                    <a href="https://github.com/ReyhanZidany/based" target="_blank" className="text-gray-400 hover:text-black transition-colors">
                        GitHub
                    </a>
                </div>
                <p className="text-sm text-gray-500">
                    Built with 💙 for <span className="font-bold text-gray-900">Base Indonesia Hackathon 2025</span>
                </p>
            </div>
        </footer>
    );
}
