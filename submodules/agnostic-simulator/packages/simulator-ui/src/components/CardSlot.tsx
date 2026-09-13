import { cx } from "../class-names";
import { ViewerSafeCardImage } from "./ViewerSafeCardImage";

export interface CardSlotProps {
  imageUrl?: string;
  label?: string;
  faceDown?: boolean;
  size?: "sm" | "md" | "lg" | "fill" | "fillHeight";
  dashed?: boolean;
  className?: string;
  alt?: string;
}

const SIZE_CLASSES: Record<NonNullable<CardSlotProps["size"]>, string> = {
  sm: "w-[55px]",
  md: "w-[80px]",
  lg: "w-[100px]",
  fill: "w-full",
  fillHeight: "h-full w-auto",
};

export function CardSlot({
  imageUrl,
  label,
  faceDown = false,
  size = "md",
  dashed = false,
  className,
  alt,
}: CardSlotProps) {
  const occupied = Boolean(imageUrl) || faceDown;

  return (
    <div
      className={cx(
        "card-slot relative aspect-[5/7] shrink-0 overflow-hidden rounded-[4px] border border-[var(--board-border)] bg-white/[0.03]",
        SIZE_CLASSES[size],
        dashed && "card-slot--dashed border-dashed",
        !occupied && "card-slot--empty",
        className,
      )}
      data-card-slot={size}
    >
      {faceDown ? (
        <div className="card-slot-face-down relative h-full w-full bg-[var(--card-bg)]">
          <span
            className="absolute inset-2 rounded-[2px] border border-[var(--card-border)]"
            aria-hidden="true"
          />
        </div>
      ) : imageUrl ? (
        <ViewerSafeCardImage
          entity={{
            id: `slot:${imageUrl}`,
            title: label ?? "card",
            subtitle: "Card",
            kind: "card",
            ownerId: "viewer",
            face: "public",
            states: [],
            stats: [],
            traits: [],
            imageUrl,
          }}
          className="block h-full w-full object-cover [transform:scaleX(var(--card-img-scale-x,1))]"
          alt={alt ?? label ?? "card"}
        />
      ) : (
        label && (
          <span className="card-slot-label absolute inset-0 flex items-center justify-center text-center text-[0.6rem] font-bold uppercase tracking-[0.1em] text-[var(--board-muted)]">
            {label}
          </span>
        )
      )}
    </div>
  );
}
