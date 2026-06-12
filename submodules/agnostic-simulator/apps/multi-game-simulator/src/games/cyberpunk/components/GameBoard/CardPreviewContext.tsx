import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { IconX } from "@tabler/icons-react";
import { CARD_BACK, CardImage } from "./CardImage";
import classes from "./CardPreview.module.css";

type CardAccent = "blue" | "green" | "red" | "yellow";

interface CardPreviewState {
  imageUrl: string;
  alt?: string;
  color?: CardAccent;
  details?: CardPreviewDetails;
}

type PreviewImageStatus = "loading" | "loaded" | "error";

export interface CardPreviewDetails {
  name?: string;
  cardType?: string | null;
  cost?: number | null;
  effectiveCost?: number | null;
  power?: number | null;
  effectivePower?: number | null;
  classifications?: readonly string[];
  keywords?: readonly string[];
  rules?: readonly string[];
  costEffects?: readonly { label: string; detail: string }[];
  activeEffects?: readonly { label: string; detail: string }[];
  hasSellTag?: boolean;
}

const ACCENT_HEX: Record<CardAccent, string> = {
  blue: "#4ad9ff",
  green: "#4af58a",
  red: "#ff4a6b",
  yellow: "#f5e642",
};

interface CardPreviewContextValue {
  show: (state: CardPreviewState) => void;
  hide: () => void;
}

const CardPreviewContext = createContext<CardPreviewContextValue | null>(null);

export function CardPreviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CardPreviewState | null>(null);
  const [imageStatus, setImageStatus] = useState<PreviewImageStatus>("loading");
  const loadedImageUrls = useRef(new Set<string>());
  const handleImageLoad = useCallback(() => {
    if (state?.imageUrl) {
      loadedImageUrls.current.add(state.imageUrl);
    }
    setImageStatus("loaded");
  }, [state?.imageUrl]);
  const handleImageError = useCallback(() => setImageStatus("error"), []);

  const value = useMemo<CardPreviewContextValue>(
    () => ({
      show: (next) => {
        setImageStatus(loadedImageUrls.current.has(next.imageUrl) ? "loaded" : "loading");
        setState(next);
      },
      hide: () => setState(null),
    }),
    [],
  );

  return (
    <CardPreviewContext.Provider value={value}>
      {children}
      <div
        className={`${classes.preview} ${state ? classes.visible : ""}`}
        style={
          state
            ? ({
                border: `2px solid ${state.color ? ACCENT_HEX[state.color] : "#f5e642"}`,
                boxShadow: `0 0 0 1px rgb(0 0 0 / 80%), 0 0 24px ${
                  state.color ? ACCENT_HEX[state.color] : "#f5e642"
                }55, 0 20px 50px rgb(0 0 0 / 90%)`,
                backgroundImage: `url("${state.imageUrl}"), url("${CARD_BACK}")`,
                ["--accent" as string]: state.color ? ACCENT_HEX[state.color] : "#f5e642",
              } as CSSProperties)
            : undefined
        }
      >
        {state ? (
          <>
            <CardImage
              className={classes.image}
              imageUrl={state.imageUrl}
              alt={state.alt ?? ""}
              color={state.color}
              disablePreview
              onImageLoad={handleImageLoad}
              onImageError={handleImageError}
            />
            {imageStatus !== "loaded" ? (
              <CardPreviewFallback state={state} status={imageStatus} />
            ) : null}
            <button
              type="button"
              aria-label="Close preview"
              className={classes.close}
              onClick={() => setState(null)}
            >
              <IconX size={18} stroke={2.5} aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>
    </CardPreviewContext.Provider>
  );
}

function CardPreviewFallback({
  state,
  status,
}: {
  state: CardPreviewState;
  status: Exclude<PreviewImageStatus, "loaded">;
}) {
  const details = state.details;
  const displayName = details?.name || state.alt || "Unknown card";
  const typeLabel = formatCardType(details?.cardType);
  const stats = [
    typeLabel,
    details?.effectiveCost !== null && details?.effectiveCost !== undefined
      ? details.cost !== null &&
        details.cost !== undefined &&
        details.effectiveCost !== details.cost
        ? `Cost ${details.cost} -> ${details.effectiveCost}`
        : `Cost ${details.effectiveCost}`
      : details?.cost !== null && details?.cost !== undefined
        ? `Cost ${details.cost}`
        : null,
    details?.effectivePower !== null && details?.effectivePower !== undefined
      ? details.power !== null &&
        details.power !== undefined &&
        details.effectivePower !== details.power
        ? `Power ${details.power} -> ${details.effectivePower}`
        : `Power ${details.effectivePower}`
      : details?.power !== null && details?.power !== undefined
        ? `Power ${details.power}`
        : null,
    details?.hasSellTag ? "Sell tag" : null,
  ].filter((item): item is string => Boolean(item));
  const traits = unique([
    ...(details?.classifications ?? []),
    ...(details?.keywords ?? []).map(formatRuleLabel),
  ]);
  const rules = details?.rules?.filter(Boolean) ?? [];
  const activeEffects = [...(details?.costEffects ?? []), ...(details?.activeEffects ?? [])];
  const statusLabel = status === "error" ? "Image failed" : "Image loading";
  const statusText =
    status === "error" ? "Card image failed to load." : "Card image is still loading.";

  return (
    <div className={classes.fallback} role="status" aria-live="polite">
      <div className={classes.fallbackStatusRow}>
        <span className={classes.fallbackKicker}>Card preview</span>
        <span className={status === "error" ? classes.statusError : classes.statusLoading}>
          {statusLabel}
        </span>
      </div>
      <strong>{displayName}</strong>
      <span className={classes.statusCopy}>{statusText}</span>
      {stats.length > 0 ? (
        <div className={classes.statRow} aria-label="Card stats">
          {stats.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}
      {traits.length > 0 ? <span className={classes.traits}>{traits.join(" / ")}</span> : null}
      {rules.length > 0 ? (
        <div className={classes.rules}>
          {rules.map((rule) => (
            <p key={rule}>{rule}</p>
          ))}
        </div>
      ) : (
        <p className={classes.noRules}>No rules text.</p>
      )}
      {activeEffects.length > 0 ? (
        <div className={classes.effects} aria-label="Active effects">
          {activeEffects.map((effect) => (
            <span key={`${effect.label}-${effect.detail}`}>{effect.detail}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function formatCardType(type: string | null | undefined): string | null {
  if (!type) return null;
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatRuleLabel(rule: string): string {
  return rule
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function useCardPreview(): CardPreviewContextValue {
  const ctx = useContext(CardPreviewContext);
  // Outside the provider, the hooks are no-ops so cards can still render.
  if (!ctx) {
    return { show: () => {}, hide: () => {} };
  }
  return ctx;
}
