import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function estimateReadingTime(body: string): number {
  const wordsPerMinute = 200;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function detectLanguage(title: string, body: string): 'PT' | 'EN' {
  const text = `${title} ${body}`.toLowerCase();

  // Check for Portuguese-specific characters
  const ptChars = /[ãõçêâàáéíóúü]/g;
  const charMatches = text.match(ptChars);
  if (charMatches && charMatches.length >= 3) return 'PT';

  // Check for common Portuguese words
  const ptWords = [
    'de', 'da', 'do', 'em', 'para', 'que', 'uma', 'com', 'por',
    'não', 'mas', 'como', 'mais', 'também', 'muito', 'esse', 'essa',
    'isso', 'este', 'esta', 'são', 'ser', 'ter', 'foi', 'dos', 'das',
    'nas', 'nos', 'pelo', 'pela', 'sobre', 'quando',
  ];

  const words = text.split(/\s+/);
  let ptWordCount = 0;
  for (const word of words) {
    const clean = word.replace(/[^a-záãõçêâàéíóúü]/g, '');
    if (ptWords.includes(clean)) ptWordCount++;
    if (ptWordCount >= 3) return 'PT';
  }

  // Check for lang tag in body
  if (/lang:\s*pt|tags:.*\bpt\b/i.test(body)) return 'PT';
  if (/-pt$/.test(title)) return 'PT';

  return 'EN';
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
