"use client";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="bg-black min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-[120px] md:text-[180px] font-extrabold text-red-500/10 leading-none select-none">500</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white -mt-8 mb-4">Something Went Wrong</h1>
          <p className="text-gray-400 mb-2 max-w-md mx-auto">An unexpected error occurred. Our team has been notified.</p>
          {error?.digest && <p className="text-gray-600 text-xs mb-8">Error ID: {error.digest}</p>}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={reset} className="bg-yellow-500 text-black px-8 py-3 rounded font-bold hover:bg-yellow-400 transition">
              Try Again
            </button>
            <Link href="/" className="border border-yellow-500 text-yellow-500 px-8 py-3 rounded font-bold hover:bg-yellow-500/10 transition">
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
