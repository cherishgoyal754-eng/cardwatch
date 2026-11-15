import React from 'react';

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isUser = false }) => {
  if (isUser) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  // Parse inline tokens: **bold**, *italic*, `code`, [link](url)
  const parseInline = (text: string): React.ReactNode[] => {
    const tokens: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+?\*\*|\*[^*]+?\*|`[^`]+?`|\[[^\]]+?\]\([^)]+?\))/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(text.slice(lastIndex, match.index));
      }
      const token = match[0];
      const key = `${match.index}-${token.slice(0, 10)}`;

      if (token.startsWith('**') && token.endsWith('**')) {
        tokens.push(
          <strong key={key} className="font-extrabold text-slate-950">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        tokens.push(
          <em key={key} className="italic text-slate-800">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        tokens.push(
          <code key={key} className="bg-emerald-100/70 text-emerald-900 px-1 py-0.5 rounded font-mono text-[11px]">
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('[') && token.includes('](')) {
        const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          tokens.push(
            <a
              key={key}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 underline font-bold transition-colors"
            >
              {linkMatch[1]}
            </a>
          );
        } else {
          tokens.push(token);
        }
      } else {
        tokens.push(token);
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push(text.slice(lastIndex));
    }
    return tokens.length > 0 ? tokens : [text];
  };

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-1.5 space-y-1 pl-1">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((rawLine, idx) => {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Headings: ###, ##, #
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={idx} className="text-xs sm:text-sm font-extrabold text-slate-900 mt-2.5 mb-1 tracking-tight flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
          <span>{parseInline(trimmed.slice(4))}</span>
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={idx} className="text-sm sm:text-base font-extrabold text-slate-950 mt-3 mb-1.5 tracking-tight border-b border-emerald-100 pb-1">
          {parseInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={idx} className="text-base sm:text-lg font-black text-slate-950 mt-3.5 mb-1.5 tracking-tight">
          {parseInline(trimmed.slice(2))}
        </h2>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <div key={idx} className="my-2 p-2.5 bg-emerald-100/50 border-l-3 border-emerald-600 rounded-r-lg text-slate-800 text-[11px] leading-relaxed">
          {parseInline(trimmed.slice(2))}
        </div>
      );
      return;
    }

    // Divider: ---
    if (trimmed === '---' || trimmed === '***') {
      flushList();
      elements.push(<hr key={idx} className="my-2 border-emerald-200/60" />);
      return;
    }

    // List item: * , - , • 
    const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ');
    const isSubBullet = rawLine.startsWith('  * ') || rawLine.startsWith('  - ') || rawLine.startsWith('  • ') || rawLine.startsWith('    * ') || rawLine.startsWith('    - ');

    if (isBullet || isSubBullet) {
      inList = true;
      const bulletText = trimmed.replace(/^(\*|-|•)\s+/, '');
      listItems.push(
        <li key={idx} className={`flex items-start gap-2 text-slate-800 leading-relaxed ${isSubBullet ? 'pl-4 text-[11px]' : ''}`}>
          <span className="text-emerald-600 font-bold select-none shrink-0">•</span>
          <span className="flex-1">{parseInline(bulletText)}</span>
        </li>
      );
      return;
    }

    // Numbered list: 1. , 2. 
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberMatch) {
      inList = true;
      listItems.push(
        <li key={idx} className="flex items-start gap-2 text-slate-800 leading-relaxed">
          <span className="text-emerald-700 font-bold font-mono text-[10px] select-none shrink-0 bg-emerald-100 px-1.5 py-0.5 rounded-full">
            {numberMatch[1]}
          </span>
          <span className="flex-1">{parseInline(numberMatch[2])}</span>
        </li>
      );
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={idx} className="my-1 text-slate-800 leading-relaxed">
        {parseInline(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className="space-y-1 text-xs leading-relaxed">{elements}</div>;
};
