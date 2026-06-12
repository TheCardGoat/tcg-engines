import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "../primitives/index.ts";
import {
  DEFAULT_DECK_ID,
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
  initialPlayerDeck = DEFAULT_DECK_ID,
  initialOpponentDeck,
  initialStrategy = "pass-only",
}: VsAiSetupProps) {
  const navigate = useNavigate();
  const [playerDeck, setPlayerDeck] = useState<SampleDeckId>(initialPlayerDeck);
  const [opponentDeck, setOpponentDeck] = useState<SampleDeckId>(
    // If the caller didn't specify, default the opponent to whichever
    // deck is NOT the player's pick (avoids the trivially-mirror
    // matchup as the first impression). Falls back to the default if
    // there's only one deck in the catalog.
    initialOpponentDeck ?? pickDifferent(initialPlayerDeck),
  );
  const [strategy, setStrategy] = useState<OpponentStrategyId>(initialStrategy);

  const handleStart = () => {
    const params = new URLSearchParams({
      deck: playerDeck,
      opponent: opponentDeck,
      strategy,
      start: "1",
    });
    const url = `/vs-ai?${params.toString()}`;
    if (onStart) {
      onStart(url);
      return;
    }
    void navigate(url);
  };

  return (
    <div className="min-h-dvh bg-hud-bg text-hud-text flex items-center justify-center p-4 sm:p-6">
      <div
        className="w-full max-w-3xl clip-hud-8 border border-hud-border bg-[linear-gradient(180deg,#ffffff,#eef2f9)] p-5 sm:p-7"
        style={{
          boxShadow: "0 0 40px rgba(45,107,255,.14), 0 20px 50px rgba(26,37,66,.18)",
        }}
      >
        <div className="mb-5 sm:mb-7">
          <div className="gd-mono text-hud-2xs font-bold tracking-hud-label uppercase text-hud-info mb-1">
            VS-AI · MISSION SELECT
          </div>
          <h1 className="gd-display font-extrabold text-hud-xl sm:text-hud-2xl tracking-hud-body text-hud-text leading-tight">
            Launch a match
          </h1>
          <p className="text-hud-sm text-hud-text-muted mt-1.5 max-w-prose">
            Pick a deck for each side and the opponent's AI strategy. Decks shuffle on start; the
            match opens on the first-player choice.
          </p>
        </div>

        <div className="flex flex-col gap-5 mb-6">
          <DeckPicker
            idPrefix="player-deck"
            label="Your deck"
            selected={playerDeck}
            onSelect={setPlayerDeck}
            opponentId={opponentDeck}
          />
          <DeckPicker
            idPrefix="opponent-deck"
            label="Opponent deck"
            selected={opponentDeck}
            onSelect={setOpponentDeck}
          />
          <OpponentPicker selected={strategy} onSelect={setStrategy} />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
          <Button
            onClick={handleStart}
            variant="primary"
            size="lg"
            className="tracking-hud-display clip-hud-6 px-6"
            aria-label="Start match"
          >
            ▶ START MATCH
          </Button>
        </div>
      </div>
    </div>
  );
}

function pickDifferent(anchor: SampleDeckId): SampleDeckId {
  // Derive from the canonical `SAMPLE_DECK_IDS` source so adding or
  // renaming a sample deck automatically flows through here — no
  // hard-coded mirror to keep in sync. Falls back to the anchor when
  // only one deck exists in the catalog.
  const other = SAMPLE_DECK_IDS.find((id) => id !== anchor);
  return other ?? anchor;
}
