import Link from "next/link";

export default function Home() {
  return (
     <div className="text-white mx-auto max-w-3xl flex flex-col items-center justify-center min-h-screen text-center lg:max-w-5xl xl:max-w-7xl">
      <h1 className="text-4xl mb-10 lg:text-8xl xl:text-8xl">AI Monitoring System</h1>
      <p className="text-lg text-[#CBD5E1] mb-6 lg:text-xl xl:text-xl">
        Monitor your services in real-time with latency, errors, availability and anomaly detection.
      </p>
      <p className="text-lg text-[#CBD5E1] mb-6 lg:text-xl xl:text-xl">
        Start monitoring your services now.
      </p>

      <div className="mx-auto flex gap-20 justify-center">
        <Link href="/auth/register" className="bg-[#6366F1] py-2 px-6 rounded-sm hover:bg-[#6366F1]/80">Get started</Link>
        <Link href="/auth/login" className="bg-[#14B8A6] py-2 px-6 rounded-sm hover:bg-[#14B8A6]/80">Login</Link>
      </div>
    </div>
  );
}
