import { useEffect, useRef } from "react";

import { m } from "../../lib/i18n/messages.ts";
import { useLayoutMode } from "../../lib/use-layout-mode.ts";
import { GundamChoiceModal } from "./GundamChoiceModal.tsx";

export interface MulliganPromptProps {
  readonly onKeep: () => void;
  readonly onRedraw: () => void;
}

/**
 * UI for Gundam setup milestone 3 — rules 6-2-1-6 "alter hand (mulligan)".
 *
 * Rendered while the viewer is the one the engine is waiting on during the
 * mulligan phase. Two terminal choices: keep the dealt hand, or shuffle it
 * back and draw five fresh cards. Each player gets exactly one mulligan.
 */
export function MulliganPrompt({ onKeep, onRedraw }: MulliganPromptProps) {
  const promptRef = useRef<HTMLDivElement>(null);
  const layoutMode = useLayoutMode();

  useEffect(() => {
    if (layoutMode !== "mobile") return;

    // Dealing the opening hands expands the board after its initial scroll.
    // Reveal the viewer's cards for this decision, then respect manual scrolling.
    const frame = window.requestAnimationFrame(() => {
      const board = promptRef.current?.closest<HTMLElement>("[data-sim-board]");
      if (board) board.scrollTop = board.scrollHeight - board.clientHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [layoutMode]);

  return (
    <div ref={promptRef} className="contents">
      <GundamChoiceModal
        context="mulligan"
        title={m["sim.setup.mulligan.title"]()}
        description={m["sim.setup.mulligan.hint"]()}
        options={[
          {
            id: "keep",
            label: m["sim.setup.mulligan.keepAction"](),
          },
          {
            id: "redraw",
            label: m["sim.setup.mulligan.redrawAction"](),
          },
        ]}
        onSelect={(optionId) => {
          if (optionId === "keep") {
            onKeep();
            return;
          }

          if (optionId === "redraw") {
            onRedraw();
            return;
          }

          console.warn("Unexpected mulligan option id:", optionId);
        }}
      />
    </div>
  );
}
