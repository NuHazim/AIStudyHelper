export default function Footer() {
  return (
    <footer className="py-12 border-t bg-white/10 backdrop-blur-lg shadow-lg">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-8">

        {/* TOP SECTION - LEFT ALIGNED */}
        <div className="flex flex-col items-start gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3 hover:cursor-pointer">
            <i className="fa-solid fa-book-open-reader bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white p-2.5 rounded-lg text-2xl shadow-[0_0_18px_rgba(108,108,245,0.5)]"></i>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">
              Clock In
            </h1>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 max-w-md leading-relaxed">
            The AI-powered academic survival system built for serious students who want peak performance without burnout.
          </p>

          {/* Socials */}
          <div className="flex gap-5 text-xl text-gray-300 mt-1">
            <a
              href="https://github.com/NuHazim"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              <i className="fa-brands fa-github"></i>
            </a>

            <a
              href="https://www.linkedin.com/in/nufailhazim/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10"></div>

        {/* BOTTOM SECTION - HORIZONTAL */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 text-sm text-gray-400">

          <p>© 2026 Clock In. Built for students, by Nufail Hazim.</p>

          <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/10 text-[#a5a5ff] font-semibold text-xs w-fit">
            c1. All systems operational
          </div>

        </div>

      </div>
    </footer>
  );
}