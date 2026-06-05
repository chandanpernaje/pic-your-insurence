import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AGENT, whatsappLink } from "@/lib/agent";
import { useState } from "react";
import { z } from "zod";
import { ExternalLink, Send, ShieldCheck, Upload } from "lucide-react";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Get a Free Quote — Pic Your Insurance" },
      {
        name: "description",
        content:
          "Share your details and get a personalised insurance quote from Nandan Kumar Pernaje within the hour.",
      },
      { property: "og:title", content: "Get a Free Quote — Pic Your Insurance" },
      {
        property: "og:description",
        content: "Personalised insurance quotes from Nandan Kumar Pernaje.",
      },
    ],
  }),
  component: QuotePage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(120),
  vehicle: z.string().trim().min(2, "Please describe your vehicle or coverage need").max(120),
  type: z.enum(["Health", "Vehicle"]),
  expiry: z.string().trim().max(20).optional().or(z.literal("")),
});

const insuranceTypes = [
  { key: "Health", kn: "ಆರೋಗ್ಯ" },
  { key: "Vehicle", kn: "ವಾಹನ" },
] as const;

function QuotePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    type: "Health" as (typeof insuranceTypes)[number]["key"],
    expiry: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    const msg = `Hi ${AGENT.name}, I'd like a quote.

Name: ${parsed.data.name}
Phone: ${parsed.data.phone}
Email: ${parsed.data.email}
Insurance type: ${parsed.data.type}
Vehicle / coverage need: ${parsed.data.vehicle}
Current policy expiry: ${parsed.data.expiry || "—"}`;
    window.open(whatsappLink(msg), "_blank");
  }

  return (
    <Layout>
      <section className="gradient-hero text-primary-foreground">
        <div className="max-w-4xl mx-auto px-5 py-14 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-glow font-semibold">
            Free consultation · ಉಚಿತ ಸಲಹೆ
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">Get a free quote.</h1>
          <p className="mt-1 font-display text-2xl md:text-3xl text-accent-glow">ಉಚಿತ ಕೋಟ್ ಪಡೆಯಿರಿ.</p>
          <p className="mt-3 text-primary-foreground/75 max-w-lg">
            Tell us a little about yourself. {AGENT.name} will personally reach
            out on WhatsApp with tailored recommendations.
          </p>
          <p className="mt-2 text-primary-foreground/60 text-sm max-w-lg">
            ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ — {AGENT.name} WhatsApp ನಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 -mt-10 md:-mt-14 pb-16">
        <form
          onSubmit={submit}
          className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-elegant grid gap-5"
        >
          <Field label="Full name" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="input-field"
            />
          </Field>

          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Phone number" error={errors.phone}>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98xxxxxxxx"
                className="input-field"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-field"
              />
            </Field>
          </div>

          <Field label="Vehicle / coverage need" error={errors.vehicle}>
            <input
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              placeholder="Bike model, car make, previous insurer or sum insured"
              className="input-field"
            />
          </Field>

          <Field label="Insurance type · ವಿಮಾ ಪ್ರಕಾರ">
            <div className="grid grid-cols-2 gap-2">
              {insuranceTypes.map((t) => {
                const active = form.type === t.key;
                return (
                  <button
                    type="button"
                    key={t.key}
                    onClick={() => setForm({ ...form, type: t.key })}
                    className={`py-3 rounded-2xl text-sm font-medium border transition-all ${
                      active
                        ? "border-accent gradient-emerald text-accent-foreground shadow-emerald"
                        : "border-border bg-background hover:border-accent/50"
                    }`}
                  >
                    {t.key} · {t.kn}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Current policy expiry (optional) · ನವೀಕರಣ ದಿನಾಂಕ" error={errors.expiry}>
            <input
              type="date"
              value={form.expiry}
              onChange={(e) => setForm({ ...form, expiry: e.target.value })}
              className="input-field"
            />
          </Field>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 py-4 rounded-full gradient-emerald text-accent-foreground font-semibold shadow-emerald hover:translate-y-[-1px] transition"
          >
            Send to {AGENT.name} via WhatsApp <Send className="size-4" />
          </button>

          <p className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <ShieldCheck className="size-4 text-accent" />
            Your details are shared only with your advisor.
          </p>
        </form>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="font-display text-lg text-primary">
              Prefer to compare yourself?
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Nandan sources policies via these partner portals.
            </p>
            <div className="grid gap-2 mt-4">
              <a
                href={AGENT.portals.insuranceDekho}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border border-border bg-background hover:border-accent hover:bg-accent/5 transition text-sm font-medium text-primary"
              >
                <span>Open InsuranceDekho</span>
                <ExternalLink className="size-4 text-muted-foreground" />
              </a>
              <a
                href={AGENT.portals.policyBazaar}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border border-border bg-background hover:border-accent hover:bg-accent/5 transition text-sm font-medium text-primary"
              >
                <span>Open PolicyBazaar</span>
                <ExternalLink className="size-4 text-muted-foreground" />
              </a>
            </div>
          </div>
          <div className="bg-card border border-border rounded-3xl p-6 flex flex-col">
            <h3 className="font-display text-lg text-primary">
              Ready with KYC documents?
            </h3>
            <p className="text-sm text-muted-foreground mt-1 flex-1">
              Send Aadhaar, PAN, RC and old policy in one go and Nandan will
              share the payment link.
            </p>
            <Link
              to="/apply"
              className="mt-4 inline-flex items-center justify-center gap-2 py-3 rounded-full gradient-emerald text-accent-foreground font-semibold shadow-emerald hover:translate-y-[-1px] transition"
            >
              <Upload className="size-4" /> Apply with documents
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .input-field {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 0.9rem;
          background: var(--color-background);
          border: 1px solid var(--color-border);
          color: var(--color-foreground);
          font-size: 0.95rem;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input-field:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-accent) 18%, transparent);
        }
      `}</style>
    </Layout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-primary mb-2">{label}</span>
      {children}
      {error && <span className="block mt-1.5 text-xs text-destructive">{error}</span>}
    </label>
  );
}
