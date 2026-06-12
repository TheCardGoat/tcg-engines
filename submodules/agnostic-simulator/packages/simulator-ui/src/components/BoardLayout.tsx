import type { HarnessFixture } from "@tcg/simulator-contract";

import { Board } from "./Board";

export interface BoardLayoutProps {
  fixture: HarnessFixture;
}

export function BoardLayout({ fixture }: BoardLayoutProps) {
  const eyebrowClass =
    "eyebrow text-[12px] font-extrabold leading-tight tracking-normal text-[var(--game-accent)] uppercase";

  return (
    <section
      className="board-layout min-w-0 overflow-hidden rounded-lg border border-[var(--board-border)] bg-[var(--board-layout-bg)] shadow-[var(--shadow)]"
      aria-label={fixture.boardLayout.title}
    >
      <div className="board-layout-header grid grid-cols-[minmax(0,1fr)_minmax(260px,420px)] items-start gap-[18px] border-b border-[var(--board-border)] p-[18px] max-[1280px]:grid-cols-1 max-[520px]:p-3">
        <div>
          <p className={eyebrowClass}>static board layout</p>
          <h2 className="mt-1.5 break-words text-2xl font-black leading-tight text-[var(--board-text)]">
            {fixture.boardLayout.title}
          </h2>
          <p className="mt-2 max-w-[72ch] text-sm leading-normal text-[var(--board-muted)]">
            {fixture.boardLayout.summary}
          </p>
        </div>
        <div
          className="board-building-blocks grid grid-cols-2 gap-2 max-[1280px]:grid-cols-3 max-[900px]:grid-cols-1"
          aria-label="Board building blocks"
        >
          {fixture.boardLayout.buildingBlocks.map((component) => (
            <article
              key={component.name}
              className="min-h-[86px] rounded-md border border-[var(--board-border)] bg-[var(--board-surface)] p-2.5"
            >
              <h4 className="text-xs font-black text-[var(--board-text)]">{component.name}</h4>
              <p className="mt-1 text-xs leading-snug text-[var(--board-muted)]">
                {component.responsibility}
              </p>
            </article>
          ))}
        </div>
      </div>
      <Board table={fixture.table} entities={fixture.entities} layout={fixture.boardLayout} />
    </section>
  );
}
