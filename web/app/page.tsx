import { ActivityTabs } from "@/components/activities/ActivityTabs";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-black to-slate-950 text-white">
      {/* animated background layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] sm:bg-[size:64px_64px] lg:bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        {/* primary glow orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[280px] w-[280px] sm:h-[420px] sm:w-[420px] lg:h-[600px] lg:w-[600px] rounded-full bg-gradient-to-r from-violet-600/30 to-purple-600/10 blur-[70px] sm:blur-[100px] lg:blur-[120px]" />

        <div className="absolute top-1/4 right-1/2 translate-x-1/2 h-[260px] w-[260px] sm:h-[380px] sm:w-[380px] lg:h-[500px] lg:w-[500px] rounded-full bg-gradient-to-l from-cyan-500/25 to-blue-500/10 blur-[60px] sm:blur-[90px] lg:blur-[100px]" />

        {/* accent glows */}
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 h-[220px] w-[220px] sm:h-[320px] sm:w-[320px] lg:h-[400px] lg:w-[400px] rounded-full bg-fuchsia-500/10 blur-[55px] sm:blur-[75px] lg:blur-[90px]" />

        <div className="absolute bottom-12 right-1/2 translate-x-1/2 h-[200px] w-[200px] sm:h-[280px] sm:w-[280px] lg:h-[350px] lg:w-[350px] rounded-full bg-emerald-500/10 blur-[50px] sm:blur-[70px] lg:blur-[80px]" />

        {/* edge highlights (desktop only) */}
        <div className="hidden lg:block absolute -right-20 top-1/4 h-[300px] w-[300px] rounded-full bg-pink-500/20 blur-[70px]" />
        <div className="hidden lg:block absolute -left-20 bottom-1/4 h-[300px] w-[300px] rounded-full bg-indigo-500/20 blur-[70px]" />
      </div>

      {/* content container */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <ActivityTabs />
        </div>
      </div>
    </main>
  );
}
