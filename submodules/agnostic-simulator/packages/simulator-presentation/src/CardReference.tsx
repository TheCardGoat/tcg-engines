import { Popover } from "@mantine/core";
import { useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import "./card-reference.css";

export interface CardIdentityMarker {
  readonly label: string;
  readonly color?: string;
}
export interface ReferencedCard {
  readonly id: string;
  readonly label: string;
  readonly imageUrl?: string;
  readonly aspectRatio?: number;
  readonly identity?: readonly CardIdentityMarker[];
}

/** Supply only viewer-authorized data. Identity and game rules stay with the caller. */
export function CardReference({
  card,
  previewMode = "internal",
  className = "",
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  card: ReferencedCard;
  previewMode?: "internal" | "external";
}) {
  const [compactLandscape, setCompactLandscape] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-height: 540px) and (min-width: 600px)");
    const update = () => setCompactLandscape(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const [opened, setOpened] = useState(false);
  const [pinned, setPinned] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clear = () => {
    if (timer.current !== undefined) clearTimeout(timer.current);
  };
  useEffect(
    () => () => {
      if (timer.current !== undefined) clearTimeout(timer.current);
    },
    [],
  );
  const show = () => {
    clear();
    setOpened(true);
  };
  const hide = () => {
    clear();
    if (!pinned) timer.current = setTimeout(() => setOpened(false), 160);
  };
  const dismiss = () => {
    clear();
    setPinned(false);
    setOpened(false);
  };
  const label = (
    <>
      {card.identity?.length ? (
        <span
          className="tcg-card-reference__identity"
          aria-label={card.identity.map((marker) => marker.label).join(" · ")}
        >
          {card.identity.map((marker, index) => (
            <span
              key={`${marker.label}:${index}`}
              title={marker.label}
              className="tcg-card-reference__marker"
              style={{ backgroundColor: marker.color ?? "#a7b6c1" }}
            />
          ))}
        </span>
      ) : null}
      <span
        className="tcg-card-reference__name"
        style={{ color: card.identity?.length === 1 ? card.identity[0].color : undefined }}
      >
        {card.label}
      </span>
      <span className="tcg-card-reference__hint" aria-hidden="true">
        <svg width="12" height="10" viewBox="0 0 24 18" fill="none" aria-hidden="true">
          <path
            d="M1 9s4-7 11-7 11 7 11 7-4 7-11 7S1 9 1 9Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
    </>
  );
  const button = (
    <button
      type="button"
      className={`tcg-card-reference ${className}`}
      aria-label={`Preview ${card.label}`}
      aria-expanded={previewMode === "internal" ? opened : undefined}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onClick={(event) => {
        event.stopPropagation();
        if (pinned) dismiss();
        else {
          show();
          setPinned(true);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          dismiss();
        }
      }}
      {...props}
    >
      {label}
    </button>
  );
  if (previewMode === "external") return button;
  return (
    <Popover
      opened={opened}
      onDismiss={dismiss}
      position={compactLandscape ? "left" : "top"}
      withinPortal
      trapFocus={false}
      offset={compactLandscape ? 24 : 70}
      transitionProps={{ transition: "fade", duration: 160 }}
      styles={{ dropdown: { padding: 0, border: 0, background: "transparent", boxShadow: "none" } }}
      width={`min(320px, 72vw, ${46 * (card.aspectRatio ?? 5 / 7)}dvh)`}
      zIndex={450}
    >
      <Popover.Target>{button}</Popover.Target>
      <Popover.Dropdown
        className="tcg-card-reference__preview"
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        <div className="tcg-card-reference__lift">
          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.label}
              style={{ aspectRatio: card.aspectRatio ?? 5 / 7 }}
            />
          ) : (
            <strong>{card.label}</strong>
          )}
          {pinned && (
            <button
              className="tcg-card-reference__close"
              type="button"
              onClick={dismiss}
              aria-label={`Close preview of ${card.label}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="m7 7 10 10M17 7 7 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
