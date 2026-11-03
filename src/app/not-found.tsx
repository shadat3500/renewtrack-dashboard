import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-stat font-bold text-primary-600">404</p>
      <h1 className="text-h3 font-semibold">Page not found</h1>
      <Link href="/" className="text-body font-medium text-primary-600 hover:text-primary-700">
        Go to dashboard
      </Link>
    </div>
  );
}
