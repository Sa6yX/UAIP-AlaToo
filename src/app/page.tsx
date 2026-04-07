const stack = [
  "Next.js 16 (App Router)",
  "React 19 + TypeScript 6",
  "Tailwind CSS 4",
  "Supabase (Postgres, Auth, Storage)",
  "@tanstack/react-query",
  "Zod + React Hook Form",
  "Vitest + Playwright",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16 md:px-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">UAIP</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          The Unified Academic Information Portal
        </h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          Starter repository for Ala-Too International University. This baseline is prepared for
          role-based access, academic data workflows, and gradual scaling to a full university
          portal.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Current stack</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Next steps</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>Configure Supabase project and environment variables.</li>
            <li>Define DB schema + RLS policies for students/teachers/admins.</li>
            <li>Implement auth flow and protected routes.</li>
            <li>Build modules: schedules, grades, announcements, profile.</li>
          </ol>
        </article>
      </section>
    </main>
  );
}
