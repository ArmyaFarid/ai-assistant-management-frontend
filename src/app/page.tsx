import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="signup"
          >
            Creer son compte
          </Link>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="login"
          >
            Se connecter
          </a>
        </div>
      </main>
        <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6 p-4 text-gray-600">
            <div className="flex items-center text-center gap-2">
                <span>Développé par </span>
                <a
                    href="https://www.linkedin.com/in/farid-bakouan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                    cleanCodev226
                </a>
            </div>
            <div className="flex items-center text-center gap-2">
                <span>DM me in </span>
                <a
                    href="https://www.linkedin.com/in/farid-bakouan/"  // Update with your preferred contact method
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                    LinkedIn
                </a>
            </div>
        </footer>

    </div>
  );
}
