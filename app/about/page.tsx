import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — Tassio Batista',
  description: 'About Tassio Batista — writer focused on AI, product management, and software.',
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">About</h1>

      <div className="prose prose-slate max-w-none space-y-5 text-slate-600 leading-relaxed">
        <p>
          I&apos;m Tassio Batista &mdash; a product manager and software thinker based in Brazil.
        </p>
        <p>
          I write about AI, product management, and software &mdash; mostly as a way to think out loud.
          Some posts are in English, others in Portuguese, depending on who I&apos;m writing for.
        </p>
        <p>
          My work lives at the intersection of building products and understanding how technology
          shapes decisions. I&apos;m particularly interested in how AI is changing what it means to
          create software and manage teams that do.
        </p>
        <p>
          If something I wrote resonated with you, I&apos;d love to hear from you.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-100">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Read the writing
        </Link>
      </div>
    </div>
  );
}
