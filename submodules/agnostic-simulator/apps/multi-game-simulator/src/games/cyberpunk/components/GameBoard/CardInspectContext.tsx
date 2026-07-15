import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Modal } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import classes from "./CardInspect.module.css";

interface InspectCard {
  imageUrl: string;
  name?: string;
}

type CardColor = "blue" | "green" | "red" | "yellow";

const ACCENT_HEX: Record<CardColor, string> = {
  blue: "#4ad9ff",
  green: "#4af58a",
  red: "#ff4a6b",
  yellow: "#f5e642",
};
const INSPECT_TIMEOUT_MS = 15_000;
const INSPECT_TIMEOUT_SECONDS = INSPECT_TIMEOUT_MS / 1000;

interface InspectState {
  imageUrl: string;
  name?: string;
  zone?: string;
  color?: CardColor;
  attachments?: InspectCard[];
}

interface CardInspectContextValue {
  inspect: (state: InspectState) => void;
  close: () => void;
}

const CardInspectContext = createContext<CardInspectContextValue | null>(null);

/**
 * Provides a tap-to-inspect overlay for cards. Any consumer can call
 * inspect({ imageUrl, name }) to open a centered modal showing the card at a
 * readable size — solves the "card text is too small to read on mobile or in
 * the legends peek-strip" problem with a deliberate, focused viewer.
 *
 * The modal closes on tap-outside, X button, or Esc — matching the gesture
 * users expect from native dialogs.
 */
export function CardInspectProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InspectState | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(INSPECT_TIMEOUT_SECONDS);
  const closeInspect = useCallback(() => setState(null), []);

  const value = useMemo<CardInspectContextValue>(
    () => ({
      inspect: (next) => setState(next),
      close: closeInspect,
    }),
    [closeInspect],
  );
  const cards = state
    ? [{ imageUrl: state.imageUrl, name: state.name }, ...(state.attachments ?? [])]
    : [];
  const selectedCard = cards[selectedIndex] ?? cards[0];
  const inspectSessionKey = state
    ? [state.imageUrl, state.name ?? "", state.zone ?? ""].join("|")
    : null;

  useEffect(() => {
    setSelectedIndex(0);
  }, [state?.imageUrl]);

  useEffect(() => {
    if (!inspectSessionKey) {
      setRemainingSeconds(INSPECT_TIMEOUT_SECONDS);
      return undefined;
    }

    const openedAt = Date.now();
    setRemainingSeconds(INSPECT_TIMEOUT_SECONDS);

    const tick = () => {
      const elapsed = Date.now() - openedAt;
      setRemainingSeconds(Math.max(0, Math.ceil((INSPECT_TIMEOUT_MS - elapsed) / 1000)));
    };
    const intervalId = window.setInterval(tick, 1000);
    const timeoutId = window.setTimeout(closeInspect, INSPECT_TIMEOUT_MS);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [closeInspect, inspectSessionKey]);

  return (
    <CardInspectContext.Provider value={value}>
      {children}
      <Modal
        opened={!!state}
        onClose={() => setState(null)}
        fullScreen
        size="auto"
        padding={0}
        zIndex={5500}
        withCloseButton={false}
        overlayProps={{ backgroundOpacity: 0.85, blur: 4 }}
        classNames={{ content: classes.content, body: classes.body }}
      >
        {state && selectedCard ? (
          <div className={classes.stage} data-testid="card-inspect-stage">
            <div
              className={classes.dismissLayer}
              data-testid="card-inspect-dismiss-layer"
              onPointerDown={closeInspect}
              aria-hidden="true"
            />
            <div
              className={classes.shell}
              data-testid="card-inspect-modal"
              onPointerDown={(event) => event.stopPropagation()}
              style={
                {
                  "--accent": state.color ? ACCENT_HEX[state.color] : "#f5e642", // card color accent
                } as CSSProperties
              }
            >
              <img
                className={classes.image}
                data-testid="card-inspect-image"
                src={selectedCard.imageUrl}
                alt={selectedCard.name ?? ""}
              />
              {(state.name ?? state.zone) && (
                <div className={classes.meta}>
                  {selectedCard.name ? (
                    <span className={classes.name}>{selectedCard.name}</span>
                  ) : null}
                  {state.zone ? <span className={classes.zone}>{state.zone}</span> : null}
                </div>
              )}
              {cards.length > 1 ? (
                <div className={classes.gallery} aria-label="Attached card gallery">
                  {cards.map((card, index) => (
                    <button
                      key={`${card.imageUrl}-${index}`}
                      type="button"
                      className={classes.thumbnail}
                      data-active={index === selectedIndex ? "true" : "false"}
                      onClick={() => setSelectedIndex(index)}
                      aria-label={index === 0 ? "View main card" : `View attached gear ${index}`}
                    >
                      <img src={card.imageUrl} alt={card.name ?? ""} />
                      <span>{index === 0 ? "Unit" : `Gear ${index}`}</span>
                    </button>
                  ))}
                </div>
              ) : null}
              <button
                type="button"
                aria-label="Close inspect"
                className={classes.close}
                data-countdown={remainingSeconds}
                onClick={closeInspect}
              >
                <IconX size={18} stroke={2.5} aria-hidden="true" />
                <span className={classes.countdown} data-testid="card-inspect-countdown">
                  {remainingSeconds}
                </span>
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </CardInspectContext.Provider>
  );
}

export function useCardInspect(): CardInspectContextValue {
  const ctx = useContext(CardInspectContext);
  // Outside the provider, inspect is a no-op so cards still render.
  if (!ctx) {
    return { inspect: () => {}, close: () => {} };
  }
  return ctx;
}
