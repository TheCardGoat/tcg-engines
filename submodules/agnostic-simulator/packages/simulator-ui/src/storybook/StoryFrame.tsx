import type { ReactNode } from "react";

export function StoryFrame({
  title,
  children,
  game = "cyberpunk",
  theme = "dark",
  width = "100%",
}: {
  title?: string;
  children: ReactNode;
  game?: "cyberpunk" | "gundam" | "lorcana" | "one-piece";
  theme?: "dark" | "light";
  width?: string;
}) {
  return (
    <div className="storybook-surface" data-game={game} data-theme={theme}>
      <div className="mx-auto grid gap-4" style={{ maxWidth: width }}>
        {title && (
          <h1 className="text-xl font-black leading-tight text-[var(--board-text)]">{title}</h1>
        )}
        {children}
      </div>
    </div>
  );
}

export function StoryGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export function StoryCase({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="storybook-panel grid min-w-0 gap-3 p-4">
      <h2 className="text-sm font-black uppercase tracking-normal text-[var(--board-muted)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
