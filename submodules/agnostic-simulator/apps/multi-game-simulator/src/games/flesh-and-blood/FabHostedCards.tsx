import * as Popover from "@radix-ui/react-popover";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { Link2, X } from "lucide-react";
import type { CSSProperties, SyntheticEvent } from "react";

import { useFabPreviewTarget } from "./FabCardPreview";

const VISIBLE_CARD_PEEKS = 2;

function stopHostSelection(event: SyntheticEvent<HTMLElement>) {
  event.stopPropagation();
}

function HostedCardPeek({
  card,
  hostName,
  index,
}: {
  readonly card: SimulatorEntity;
  readonly hostName: string;
  readonly index: number;
}) {
  const previewTarget = useFabPreviewTarget(card, { pinOnClick: true });

  return (
    <button
      type="button"
      className="fab-hosted-card-peek"
      aria-label={`${card.title}, under ${hostName}`}
      style={{ "--fab-hosted-index": index } as CSSProperties}
      {...previewTarget.previewProps}
      onPointerDown={stopHostSelection}
      onClick={(event) => {
        stopHostSelection(event);
        previewTarget.previewProps.onClick?.();
      }}
    >
      {card.imageUrl ? <img src={card.imageUrl} alt="" /> : null}
      <span>{card.title}</span>
    </button>
  );
}

function HostedCardDisclosureItem({
  card,
  hostName,
}: {
  readonly card: SimulatorEntity;
  readonly hostName: string;
}) {
  const previewTarget = useFabPreviewTarget(card, { pinOnClick: true });

  return (
    <li>
      <button
        type="button"
        className="fab-hosted-card-disclosure-item"
        aria-label={`Preview ${card.title}, under ${hostName}`}
        {...previewTarget.previewProps}
        onClick={(event) => {
          stopHostSelection(event);
          previewTarget.previewProps.onClick?.();
        }}
      >
        <span className="fab-hosted-card-disclosure-art" aria-hidden="true">
          {card.imageUrl ? <img src={card.imageUrl} alt="" /> : <Link2 size={16} />}
        </span>
        <span>
          <strong>{card.title}</strong>
          <small>{card.subtitle || "Card"}</small>
        </span>
      </button>
    </li>
  );
}

export function FabHostedCards({
  hostName,
  cards,
}: {
  readonly hostName: string;
  readonly cards: readonly SimulatorEntity[];
}) {
  if (cards.length === 0) return null;
  const cardNoun = cards.length === 1 ? "card" : "cards";

  return (
    <Popover.Root>
      <span
        className="fab-hosted-cards"
        data-hosted-count={cards.length}
        aria-label={`${cards.map((card) => card.title).join(", ")} ${
          cards.length === 1 ? "is" : "are"
        } under ${hostName}`}
      >
        <span className="fab-hosted-card-peeks">
          {cards.slice(0, VISIBLE_CARD_PEEKS).map((card, index) => (
            <HostedCardPeek key={card.id} card={card} hostName={hostName} index={index} />
          ))}
        </span>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="fab-hosted-card-badge"
            aria-label={`View ${cards.length} ${cardNoun} under ${hostName}`}
            title={`${cards.length} ${cardNoun} under ${hostName}`}
            onPointerDown={stopHostSelection}
            onClick={stopHostSelection}
          >
            <Link2 size={11} strokeWidth={2.4} aria-hidden="true" />
            <strong>{cards.length}</strong>
          </button>
        </Popover.Trigger>
      </span>
      <Popover.Portal>
        <Popover.Content
          className="fab-hosted-card-disclosure"
          side="top"
          align="center"
          sideOffset={8}
          collisionPadding={12}
          role="dialog"
          aria-label={`Cards under ${hostName}`}
        >
          <header>
            <span>
              <Link2 size={14} strokeWidth={2.2} aria-hidden="true" />
              Cards under
            </span>
            <strong>{hostName}</strong>
          </header>
          <ul>
            {cards.map((card) => (
              <HostedCardDisclosureItem key={card.id} card={card} hostName={hostName} />
            ))}
          </ul>
          <Popover.Close
            className="fab-hosted-card-disclosure-close"
            aria-label="Close cards under"
          >
            <X size={14} strokeWidth={2.3} aria-hidden="true" />
          </Popover.Close>
          <Popover.Arrow className="fab-hosted-card-disclosure-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
