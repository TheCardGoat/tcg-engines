import { useState } from "react";
import type { GrandArchiveTextDeckInput } from "@tcg/grand-archive-engine/automation";
import type { GrandArchiveServerEngine } from "@tcg/grand-archive-server-adapter";
import { X } from "lucide-react";

import { createGrandArchivePracticeEngineFromSetup } from "./practice-setup";
import { useGrandArchiveDialogFocus } from "./dialog-focus";

interface GrandArchivePracticeSetupProps {
  readonly initialDeck: GrandArchiveTextDeckInput;
  readonly onCancel: () => void;
  readonly onStart: (server: GrandArchiveServerEngine) => void;
}

export function GrandArchivePracticeSetup({
  initialDeck,
  onCancel,
  onStart,
}: GrandArchivePracticeSetupProps) {
  const [mainDeck, setMainDeck] = useState(initialDeck.mainDeck);
  const [materialDeck, setMaterialDeck] = useState(initialDeck.materialDeck);
  const [startingChampion, setStartingChampion] = useState(initialDeck.startingChampion);
  const [seed, setSeed] = useState("20260826");
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useGrandArchiveDialogFocus<HTMLElement>(true, onCancel);

  return (
    <div className="ga-practice-setup-backdrop" role="presentation">
      <section
        ref={dialogRef}
        className="ga-practice-setup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ga-practice-setup-title"
        tabIndex={-1}
      >
        <header>
          <div>
            <p>Local practice</p>
            <h1 id="ga-practice-setup-title">New deck matchup</h1>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close deck setup"
            data-dialog-autofocus
          >
            <X aria-hidden="true" size={19} />
          </button>
        </header>
        <p className="ga-practice-setup-intro">
          Paste canonical Grand Archive deck lines in <code>4x card-id</code> format. This deck is
          mirrored to the practice opponent; legality is enforced by the engine before play.
        </p>
        <div className="ga-practice-setup-grid">
          <label>
            <span>Main deck</span>
            <textarea
              value={mainDeck}
              onChange={(event) => setMainDeck(event.currentTarget.value)}
            />
          </label>
          <label>
            <span>Material deck</span>
            <textarea
              value={materialDeck}
              onChange={(event) => setMaterialDeck(event.currentTarget.value)}
            />
          </label>
        </div>
        <div className="ga-practice-setup-fields">
          <label>
            <span>Starting Champion</span>
            <input
              value={startingChampion}
              onChange={(event) => setStartingChampion(event.currentTarget.value)}
            />
          </label>
          <label>
            <span>Shuffle seed</span>
            <input
              value={seed}
              inputMode="numeric"
              onChange={(event) => setSeed(event.currentTarget.value)}
            />
          </label>
        </div>
        {error ? (
          <p role="alert" className="ga-practice-setup-error">
            {error}
          </p>
        ) : null}
        <footer>
          <button type="button" onClick={onCancel}>
            Keep current match
          </button>
          <button
            type="button"
            data-primary="true"
            onClick={() => {
              try {
                const randomSeed = Number(seed);
                const next = createGrandArchivePracticeEngineFromSetup({
                  deck: { mainDeck, materialDeck, startingChampion },
                  randomSeed,
                });
                setError(null);
                onStart(next);
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : String(caught));
              }
            }}
          >
            Start matchup
          </button>
        </footer>
      </section>
    </div>
  );
}
