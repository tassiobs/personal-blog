import { cn } from '@/lib/utils';
import { PostLanguage } from '@/types';

interface LanguageBadgeProps {
  language: PostLanguage | null;
  className?: string;
}

const LABELS: Record<PostLanguage, string> = {
  'en': 'EN',
  'pt-BR': 'PT',
};

export function LanguageBadge({ language, className }: LanguageBadgeProps) {
  if (!language) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        language === 'pt-BR' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700',
        className
      )}
    >
      {LABELS[language]}
    </span>
  );
}
