import Link from "next/link";

const heroHighlights = [
  {
    title: "Centralized review intake",
    description:
      "Normalize Hostaway data into a consistent format we can filter, sort, and act on instantly."
  },
  {
    title: "Manager-first workflows",
    description:
      "Curated controls to spot low scores, tag issues, and decide which stories we publish."
  },
  {
    title: "Property page sync",
    description:
      "Approved reviews flow straight into the Flex Living property layout—no extra CMS work."
  }
];

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
      <div className="grid gap-8 rounded-[32px] border border-slate-200 bg-white/80 p-10 shadow-card lg:grid-cols-[1.1fr,0.9fr]">
        <div className="flex flex-col gap-6">
          <span className="pill self-start bg-brand-100 text-brand-700">
            Flex Living Intelligence
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            One cockpit for Hostaway, Google, and Flex Living guest feedback.
          </h1>
          <p className="text-lg text-slate-600">
            Use the dashboard to triage every review, understand which buildings
            trend up or down, and declare which testimonials appear on our
            website. The property page layout mirrors flexliving.com so what you
            see is what guests will see.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="rounded-full bg-brand-600 px-6 py-3 text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-500"
            >
              Enter Manager Dashboard
            </Link>
            <Link
              href="/property/n1-loft"
              className="rounded-full border border-slate-200 px-6 py-3 text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
            >
              Preview Property Page
            </Link>
          </div>
        </div>
        <div className="grid gap-4 rounded-[28px] border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6">
          {heroHighlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm"
            >
              <p className="text-sm uppercase tracking-widest text-brand-700">
                {item.title}
              </p>
              <p className="mt-2 text-base text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-xl font-semibold text-slate-900">
            Workflow in three steps
          </h2>
          <ol className="mt-4 space-y-3 text-slate-600">
            <li>
              <span className="font-semibold text-slate-900">1.</span> Fetch
              Hostaway data through `/api/reviews/hostaway`.
            </li>
            <li>
              <span className="font-semibold text-slate-900">2.</span> Use the
              dashboard filters to audit, label, and approve guest stories.
            </li>
            <li>
              <span className="font-semibold text-slate-900">3.</span> Property
              pages showcase only the approved highlights.
            </li>
          </ol>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-brand-50 to-white p-6 shadow-card">
          <h2 className="text-xl font-semibold text-slate-900">
            What&apos;s included
          </h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>• Normalized API response with per-listing aggregates</li>
            <li>• Local approval state synced to browser storage</li>
            <li>• Filterable manager dashboard with insights</li>
            <li>• Property layout aligned with flexliving.com visuals</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

