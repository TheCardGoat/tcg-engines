import { Modal, type ModalProps } from "@mantine/core";
import { CARD_PRESENTATION_LAYERS } from "./CardPresentationPlane";

/** Shared focus plane; the game retains its card details and inspection actions. */
export function CardInspectionDialog(props: Omit<ModalProps, "zIndex">) {
  return <Modal {...props} zIndex={CARD_PRESENTATION_LAYERS.focus} />;
}
