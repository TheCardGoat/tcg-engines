import { Bot, ChevronDown, ChevronRight, Swords } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { FixtureCatalog } from "../fixture-catalog/FixtureCatalog.tsx";
import { Button } from "../primitives/index.ts";
import {
  DEFAULT_DECK_ID,
  SAMPLE_DECKS,
  SAMPLE_DECK_IDS,
  type SampleDeckId,
} from "../../data/sample-decks/index.ts";
import type { OpponentStrategyId } from "../../game/match-factory.ts";

import { DeckPicker } from "./DeckPicker.tsx";
import { OpponentPicker } from "./OpponentPicker.tsx";

export interface VsAiSetupProps {
  /** Optional navigation override — tests swap this in so clicking
   * "Start" doesn't trigger an actual router navigation. Production
   * uses the default (`useNavigate`). */
  readonly onStart?: (url: string) => void;
  readonly initialPlayerDeck?: SampleDeckId;
  readonly initialOpponentDeck?: SampleDeckId;
  readonly initialStrategy?: OpponentStrategyId;
}

/**
 * Pre-match splash screen. Lets the viewer pick their deck, the
 * opponent's deck, and the opponent's AI strategy, then navigates
 * to `/vs-ai?deck=..&opponent=..&strategy=..&start=1` — which the
 * loader recognises as the `vs-ai-match` boot path (see Step 4).
 *
 * State is intentionally ephemeral (no localStorage yet). The URL
 * is the source of truth for an active match; if the user refreshes
 * the setup page they restart their picks.
 */
export function VsAiSetup({
  onStart,
  initialPlayerDeck,
  initialOpponentDeck,
  initialStrategy,
}: VsAiSetupProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [playerDeck, setPlayerDeck] = useState<SampleDeckId>(
    () => initialPlayerDeck ?? pickRandomDeck(),
  );
  const [opponentDeck, setOpponentDeck] = useState<SampleDeckId>(
    () => initialOpponentDeck ?? pickRandomDeck(playerDeck),
  );
  const [strategy, setStrategy] = useState<OpponentStrategyId>(
    () => initialStrategy ?? "combat-aware",
  );
  const fixtureRoot = `${simulatorBasePath(location.pathname)}/tests`;

  const handleStart = () => {
    const params = new URLSearchParams({
      deck: playerDeck,
      opponent: opponentDeck,
      strategy,
      start: "1",
    });
    const url = `${location.pathname}?${params.toString()}`;
    if (onStart) {
      onStart(url);
      return;
    }
    void navigate(url);
  };

  const matchSetup = (
    <MatchSetupPanel
      playerDeck={playerDeck}
      opponentDeck={opponentDeck}
      strategy={strategy}
      onPlayerDeckChange={setPlayerDeck}
      onOpponentDeckChange={setOpponentDeck}
      onStrategyChange={setStrategy}
      onStart={handleStart}
      isSecondary={import.meta.env.DEV}
    />
  );

  return (
    <div
      data-testid="vs-ai-setup-scroll-region"
      className="gd-dark-surface h-dvh overflow-y-auto bg-hud-bg text-hud-text [color-scheme:dark]"
    >
      <main
        className={`mx-auto flex min-h-full w-full max-w-6xl flex-col gap-4 p-4 sm:p-6 ${
          import.meta.env.DEV ? "lg:py-8" : "justify-center lg:py-10"
        }`}
      >
        {import.meta.env.DEV ? (
          <>
            <FixtureCatalog fixtureRoot={fixtureRoot} />
            <details className="group overflow-hidden clip-hud-8 border border-hud-border bg-hud-surface/70">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-hud-text transition hover:bg-hud-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hud-info sm:px-5 [&::-webkit-details-marker]:hidden">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-hud-bg text-hud-info-deep ring-1 ring-inset ring-hud-border">
                    <Swords className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">Custom AI practice match</span>
                    <span className="block text-xs leading-5 text-hud-text-muted">
                      Choose both decks and set the opponent difficulty.
                    </span>
                  </span>
                </span>
                <ChevronDown
                  className="size-4 shrink-0 text-hud-text-muted transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="border-t border-hud-border/70">{matchSetup}</div>
            </details>
          </>
        ) : (
          matchSetup
        )}
      </main>
    </div>
  );
}

function MatchSetupPanel({
  playerDeck,
  opponentDeck,
  strategy,
  onPlayerDeckChange,
  onOpponentDeckChange,
  onStrategyChange,
  onStart,
  isSecondary,
}: {
  readonly playerDeck: SampleDeckId;
  readonly opponentDeck: SampleDeckId;
  readonly strategy: OpponentStrategyId;
  readonly onPlayerDeckChange: (deck: SampleDeckId) => void;
  readonly onOpponentDeckChange: (deck: SampleDeckId) => void;
  readonly onStrategyChange: (strategy: OpponentStrategyId) => void;
  readonly onStart: () => void;
  readonly isSecondary: boolean;
}) {
  const Heading = isSecondary ? "h2" : "h1";

  return (
    <section className="w-full overflow-hidden bg-hud-deep text-hud-text">
      <header className="border-b border-hud-border/70 bg-hud-surface/65 px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-hud-label text-hud-info-deep">
          <Swords className="size-4" aria-hidden="true" />
          VS AI practice
        </div>
        <Heading className="gd-display mt-1 text-2xl font-extrabold leading-tight tracking-hud-body text-hud-text sm:text-3xl">
          Set up your match
        </Heading>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-hud-text-muted">
          Choose both decks and how challenging the AI should be. You’ll choose the first player
          after the decks shuffle.
        </p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <DeckPicker
              idPrefix="player-deck"
              label="Your deck"
              selected={playerDeck}
              onSelect={onPlayerDeckChange}
              opponentId={opponentDeck}
            />
            <DeckPicker
              idPrefix="opponent-deck"
              label="Opponent deck"
              selected={opponentDeck}
              onSelect={onOpponentDeckChange}
              opponentId={playerDeck}
            />
          </div>
          <OpponentPicker selected={strategy} onSelect={onStrategyChange} />
        </div>

        <aside className="flex flex-col justify-between border-t border-hud-border/70 bg-hud-bg p-5 text-hud-text lg:border-l lg:border-t-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-hud-label text-hud-info">
              <Bot className="size-4" aria-hidden="true" />
              Match ready
            </div>
            <div className="mt-5 space-y-4">
              <MatchupRow label="You" value={SAMPLE_DECKS[playerDeck].name} />
              <div className="h-px bg-hud-line" />
              <MatchupRow label="Opponent" value={SAMPLE_DECKS[opponentDeck].name} />
              <MatchupRow label="Difficulty" value={strategyLabel(strategy)} />
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs leading-5 text-hud-text-muted">
              Decks shuffle when the match starts.
            </p>
            <Button
              onClick={onStart}
              variant="primary"
              size="lg"
              className="w-full clip-hud-6 px-5 tracking-hud-display"
              aria-label="Start practice match"
            >
              Start practice match
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}

function MatchupRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-hud-label text-hud-text-dim">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold leading-5 text-hud-text">{value}</div>
    </div>
  );
}

function strategyLabel(strategy: OpponentStrategyId): string {
  switch (strategy) {
    case "pass-only":
      return "Rookie · Learn the flow";
    case "greedy-legal":
      return "Veteran · Active opponent";
    case "combat-aware":
      return "Ace · Full challenge";
    default:
      return strategy.replaceAll("-", " ");
  }
}

function simulatorBasePath(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, "");
  if (normalized.endsWith("/vs-ai")) {
    return normalized.slice(0, -"/vs-ai".length);
  }
  return normalized;
}

function pickRandomDeck(exclude?: SampleDeckId): SampleDeckId {
  const candidates = exclude ? SAMPLE_DECK_IDS.filter((id) => id !== exclude) : SAMPLE_DECK_IDS;
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index] ?? exclude ?? DEFAULT_DECK_ID;
}
