import { m } from "../../../lib/i18n/messages.ts";
import type { GameCardData } from "../types.ts";
import { ZoneCardModal } from "./ZoneCardModal.tsx";

interface TrashCardModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly cards: readonly GameCardData[];
}

/** Public Trash viewer shared by desktop piles and the compact counter strip. */
export function TrashCardModal({ open, onOpenChange, cards }: TrashCardModalProps) {
  return (
    <ZoneCardModal
      open={open}
      onOpenChange={onOpenChange}
      label={m["sim.seat.discard.label"]()}
      emptyLabel={m["sim.seat.discard.empty"]()}
      cards={cards}
      newestFirst
    />
  );
}
