import { Fragment } from "react";

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&")
    .replaceAll("<", "<")
    .replaceAll(">", ">");
}

function inline(text: string) {
  const escaped = escapeHtml(text);
  const withCode = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
  const withBold = withCode.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return withBold.replaceAll("\n", "<br />");
}

export function Markdown({ content }: { content: string }) {
  const parts = content.split(/```/g);
  return (
    <div className="text-[0.95rem] leading-relaxed text-fg">
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          const nl = part.indexOf("\n");
          const code = nl === -1 ? part : part.slice(nl + 1);
          return (
            <pre
              key={i}
              className="my-3 overflow-x-auto rounded-md bg-elevated p-3 font-mono text-xs text-fg"
            >
              <code>{code.replace(/\n$/, "")}</code>
            </pre>
          );
        }
        return (
          <Fragment key={i}>
            <span dangerouslySetInnerHTML={{ __html: inline(part) }} />
          </Fragment>
        );
      })}
    </div>
  );
}
