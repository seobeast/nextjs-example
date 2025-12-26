import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-white dark:bg-black">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          SEOBeast + Next.js
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          This is an example blog powered by SEOBeast as a headless CMS.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Blog &rarr;
          </Link>
          <a
            href="https://github.com/seobeast/nextjs-example"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            View on GitHub
          </a>
        </div>

        <div className="mt-16 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg text-left">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Quick Start
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400 text-sm">
            <li>Clone this repository</li>
            <li>
              Set <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">SEOBEAST_API_URL</code> and{" "}
              <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">SEOBEAST_WEBSITE_SLUG</code> in{" "}
              <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">.env.local</code>
            </li>
            <li>
              Configure webhook URL in SEOBeast dashboard
            </li>
            <li>
              Run <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">pnpm dev</code> and visit{" "}
              <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">/blog</code>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
