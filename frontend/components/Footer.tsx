export default function Footer() {
    return (
        <footer className="bg-white border-t-2 border-black py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-6">
                    <span className="font-bold bg-black text-white px-2 py-0.5">BASED_ID // 2025</span>
                    <a href="https://base.org" target="_blank" className="text-gray-500 hover:text-blue-600 hover:underline transition-colors uppercase">
                        [BASE_ORG]
                    </a>
                    <a href="https://github.com/ReyhanZidany/based" target="_blank" className="text-gray-500 hover:text-black hover:underline transition-colors uppercase">
                        [SOURCE_CODE]
                    </a>
                </div>
                <p className="text-gray-500 text-center md:text-right">
                    DEPLOYED FOR <span className="font-bold text-black border-b border-black">BASE INDONESIA HACKATHON</span>
                </p>
            </div>
        </footer>
    );
}
