import { useMediaQuery } from "@mantine/hooks";
import { MoveHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ReturnToV1 } from "./version";
import classes from "./RotateGuidance.module.css";

const PORTRAIT_COARSE = "(orientation: portrait) and (pointer: coarse)";
const PEEK_STORAGE_KEY = "tcg:cyberpunk:ui-v2-rotate-peek";

function readPeek(): boolean {
  try {
    return sessionStorage.getItem(PEEK_STORAGE_KEY) === "peeked";
  } catch {
    return false;
  }
}

/**
 * Portrait-phone guidance for the V2 board: a floating card instead of the
 * old bare text strip. Primary action returns to V1; "peek" dismisses the
 * card for this session and unhides the portrait board (the table re-hides
 * itself through the CSS media query unless data-rotate-peek is set).
 */
export function RotateGuidance() {
  const portrait = useMediaQuery(PORTRAIT_COARSE, false);
  const [peek, setPeek] = useState(false);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setPeek(readPeek());
  }, []);

  useEffect(() => {
    const root = (layerRef.current ?? pillRef.current)?.closest(
      '[data-testid="cyberpunk-board-v2"]',
    );
    if (!root) return;
    if (peek) root.setAttribute("data-rotate-peek", "true");
    else root.removeAttribute("data-rotate-peek");
    return () => root.removeAttribute("data-rotate-peek");
  }, [peek]);

  if (!portrait) return null;

  if (peek) {
    return (
      <button
        ref={pillRef}
        type="button"
        className={classes.peekPill}
        onClick={() => {
          try {
            sessionStorage.removeItem(PEEK_STORAGE_KEY);
          } catch {
            // Blocked storage must not stop the card from returning.
          }
          setPeek(false);
        }}
        data-testid="rotate-peek-pill"
      >
        <MoveHorizontal size={14} aria-hidden="true" />
        Rotate for the full board
      </button>
    );
  }

  return (
    <div ref={layerRef} className={classes.layer} data-testid="rotate-guidance">
      <div className={classes.card} role="status">
        <span className={classes.iconPlate} aria-hidden="true">
          <MoveHorizontal size={28} strokeWidth={2.4} />
        </span>
        <p className={classes.eyebrow}>Orientation</p>
        <h2 className={classes.title}>Rotate your device</h2>
        <p className={classes.body}>
          The board is built for landscape. Turn your phone sideways — your match keeps running
          either way.
        </p>
        <div className={classes.actions}>
          <ReturnToV1 className={classes.primary} />
          <button
            type="button"
            className={classes.secondary}
            onClick={() => {
              try {
                sessionStorage.setItem(PEEK_STORAGE_KEY, "peeked");
              } catch {
                // Blocked storage only costs the player the across-reloads peek.
              }
              setPeek(true);
            }}
          >
            Peek at the board anyway
          </button>
        </div>
      </div>
    </div>
  );
}
