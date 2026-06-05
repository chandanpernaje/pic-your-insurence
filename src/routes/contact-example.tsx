import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { createContact, getContacts } from "@/lib/contacts.server";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/contact-example")({
  loader: async () => {
    return { contacts: await getContacts() };
  },
  head: () => ({
    meta: [
      { title: "Contact Us — PYC Insurance" },
      {
        name: "description",
        content: "Get in touch with our insurance advisors",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { contacts } = useLoaderData({ from: "/contact-example" });

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 mb-4">
              We'd love to hear from you. Get in touch with us for any insurance inquiries.
            </p>
            <ContactForm />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Messages</h2>
            <div className="space-y-4">
              {contacts?.length ? (
                contacts.map((contact) => (
                  <div key={contact.id} className="p-4 border rounded-lg">
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                    <p className="text-sm mt-2">{contact.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No messages yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => form.name.trim().length > 1 && form.email.trim().length > 5 && form.message.trim().length > 10,
    [form],
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      await createContact({ data: form });
      setForm({ name: "", email: "", message: "" });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setError("Unable to send your message. Please try again later.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          type="text"
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Your name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          type="email"
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="your@email.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg h-32"
          placeholder="Your message"
          required
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {status === "success" ? (
        <p className="text-sm text-emerald-600">Message sent successfully.</p>
      ) : null}
      <button
        type="submit"
        disabled={!canSubmit || status === "loading"}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
