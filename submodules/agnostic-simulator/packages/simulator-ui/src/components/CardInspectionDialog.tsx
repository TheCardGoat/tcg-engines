import { Modal, type ModalProps } from "@mantine/core";
import type { ReactNode } from "react";
import { CARD_PRESENTATION_LAYERS } from "./CardPresentationPlane";
import classes from "./CardInspectionDialog.module.css";

/** Shared focus plane; the game retains its card details and inspection actions. */
export function CardInspectionDialog({
  landscapeColumns = false,
  className,
  ...props
}: Omit<ModalProps, "zIndex"> & {
  /** Pair with CardInspectionLayout to keep artwork visible beside scrollable details. */
  landscapeColumns?: boolean;
}) {
  return (
    <Modal
      {...props}
      className={[className, landscapeColumns && classes.landscape].filter(Boolean).join(" ")}
      zIndex={CARD_PRESENTATION_LAYERS.focus}
    />
  );
}

/** An inspection keeps the complete artwork visible while long actions and rules scroll. */
export function CardInspectionLayout({
  artwork,
  children,
}: {
  artwork: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={classes.layout}>
      <div className={classes.artwork}>{artwork}</div>
      <div
        className={classes.details}
        tabIndex={0}
        role="region"
        aria-label="Card details and actions"
      >
        {children}
      </div>
    </div>
  );
}
