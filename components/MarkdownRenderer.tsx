import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        'prose prose-slate max-w-none',
        'prose-headings:font-semibold prose-headings:text-slate-900',
        'prose-p:text-slate-700 prose-p:leading-relaxed',
        'prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-slate-900 prose-strong:font-semibold',
        'prose-code:text-slate-800 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-slate-900 prose-pre:text-slate-100',
        'prose-blockquote:border-l-blue-600 prose-blockquote:text-slate-600',
        'prose-img:rounded-xl',
        'prose-hr:border-slate-200',
        'prose-ul:text-slate-700 prose-ol:text-slate-700',
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
