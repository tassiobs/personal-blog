import { cn } from '@/lib/utils';

interface LanguageBadgeProps {
  language: 'PT' | 'EN';
  className?: string;
}

export function LanguageBadge({ language, className }: LanguageBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        language === 'PT'
          ? 'bg-green-100 text-green-700'
          : 'bg-blue-100 text-blue-700',
        className
      )}
    >
      {language}
    </span>
  );
}
