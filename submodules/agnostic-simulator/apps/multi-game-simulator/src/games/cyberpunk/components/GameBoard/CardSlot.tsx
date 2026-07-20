import { ViewerSafeCardImage } from "@tcg/simulator-ui";

import classes from "./CardSlot.module.css";

interface CardSlotProps {
  imageUrl?: string;
  label?: string;
  faceDown?: boolean;
  size?: "sm" | "md" | "lg" | "fill" | "fillHeight";
  dashed?: boolean;
}

export function CardSlot({
  imageUrl,
  label,
  faceDown = false,
  size = "md",
  dashed = false,
}: CardSlotProps) {
  const slotClass = [
    classes.slot,
    classes[size],
    dashed ? classes.dashed : "",
    imageUrl || faceDown ? classes.occupied : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={slotClass}>
      {faceDown ? (
        <div className={classes.faceDown} />
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
          imageClassName={classes.image}
          alt={label ?? "card"}
          fill
        />
      ) : (
        label && <span className={classes.label}>{label}</span>
      )}
    </div>
  );
}
