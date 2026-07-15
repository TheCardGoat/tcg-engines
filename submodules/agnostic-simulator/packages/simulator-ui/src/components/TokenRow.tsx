import type { BoardToken } from "@tcg/simulator-contract";

import { cx } from "../class-names";

export interface TokenRowProps {
  tokens: BoardToken[];
}

export function TokenRow({ tokens }: TokenRowProps) {
  return (
    <div className="token-row flex flex-wrap gap-1.5">
      {tokens.map((token, index) => (
        <span
          key={`${token.label}:${index}`}
          className={cx(
            "inline-flex min-h-6 items-center rounded-full border px-2 py-1 text-[11px] font-extrabold leading-none",
            token.state === "active"
              ? "border-[var(--game-accent)] bg-[var(--game-accent)]/20 text-[var(--game-accent)]"
              : token.state === "rested" || token.state === "hidden"
                ? "border-[var(--board-border)] bg-[var(--board-surface)] text-[var(--board-muted)] opacity-60"
                : "border-[var(--board-border)] bg-[var(--board-surface)] text-[var(--board-text)]",
          )}
        >
          {token.label}: {token.value}
        </span>
      ))}
    </div>
  );
}
