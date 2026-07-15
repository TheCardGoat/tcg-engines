import { forwardRef } from "react";
import type { ButtonHTMLAttributes, MouseEvent } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";

import { useGundamGame } from "../../game/index.ts";
import { asCardColor, cardImageUrlOf } from "../containers/mappers.ts";
import { CardInfoBody, CARD_INFO_CARD_COLOR, CARD_INFO_DIALOG_W } from "./CardInfoDialog.tsx";
import type { CardType, GameCardData, KeywordEffectEntry } from "./types.ts";

export interface CardLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly cardId: string;
  readonly name: string;
  readonly onHover?: (cardId: string, event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Build the GameCardData shape CardInfoBody expects from a raw engine
 * Card + its instance id. Kept local — the hover card is the only caller.
 */
function toGameCard(
  def: ReturnType<ReturnType<typeof useGundamGame>["adapter"]["cardDefinitionOf"]>,
  instanceId: string,
): GameCardData | null {
  if (!def) return null;
  const isUnit = def.type === "unit";
  const isBase = def.type === "base";
  const hpValue = isUnit || isBase ? ((def as { hp?: number }).hp ?? null) : null;
  return {
    id: instanceId,
    name: def.name,
    cost: def.cost,
    level: def.level,
    cardType: def.type as CardType,
    ap: isUnit ? ((def as { ap?: number }).ap ?? null) : null,
    hp: hpValue,
    baseAp: isUnit ? ((def as { ap?: number }).ap ?? null) : null,
    baseHp: hpValue,
    keywords: (def.keywordEffects ?? []) as readonly KeywordEffectEntry[],
    traits: def.traits ?? [],
    effect: def.effect,
    set: (def.set?.code ?? def.cardNumber.split("-")[0])?.toLowerCase(),
    cardNumber: def.cardNumber,
    img: cardImageUrlOf(def),
    linkRequirement: (def as { linkCondition?: string }).linkCondition,
    color: asCardColor((def as { color?: string }).color),
  };
}

/**
 * Inline card-name reference rendered inside richer text (e.g. the Comms
 * log). Presents as a cyan underlined button — hovering it opens a
 * Radix HoverCard with the full card dossier. Radix handles the
 * enter/leave grace period so the cursor can slide from link to dialog
 * without the dialog closing, and closes the dialog once the cursor
 * leaves both the trigger AND the content.
 */
export const CardLink = forwardRef<HTMLButtonElement, CardLinkProps>(function CardLink(
  { cardId, name, className, onHover, onMouseEnter, onClick, ...rest },
  ref,
) {
  const { adapter } = useGundamGame();
  const card = toGameCard(adapter.cardDefinitionOf(cardId), cardId);
  const factionColor = (card?.color && CARD_INFO_CARD_COLOR[card.color]) || "#4cc3ff";

  return (
    <HoverCard.Root openDelay={80} closeDelay={120}>
      <HoverCard.Trigger asChild>
        <button
          ref={ref}
          type="button"
          data-card-id={cardId}
          className={[
            "font-body text-hud-info underline decoration-hud-info/40 decoration-dotted underline-offset-2",
            "hover:text-hud-accent-hot hover:decoration-hud-accent-hot",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hud-info",
            "cursor-pointer bg-transparent border-0 p-0 inline",
            className ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
          onMouseEnter={(event) => {
            onHover?.(cardId, event);
            onMouseEnter?.(event);
          }}
          onClick={(event) => {
            onClick?.(event);
          }}
          {...rest}
        >
          {name}
        </button>
      </HoverCard.Trigger>
      {card && (
        <HoverCard.Portal>
          <HoverCard.Content
            role="region"
            aria-label={`Dossier: ${card.name}`}
            side="top"
            align="start"
            sideOffset={10}
            collisionPadding={10}
            className="z-[250] font-body text-hud-text clip-hud-14 relative overflow-hidden data-[state=open]:[animation:gd-fade-in_.15s_ease] focus:outline-none"
            style={{
              width: CARD_INFO_DIALOG_W,
              background: "linear-gradient(180deg, rgba(255,255,255,.94), rgba(248,250,254,.96))",
              border: `1px solid ${factionColor}`,
              boxShadow: `0 0 0 1px rgba(45,107,255,.15), 0 0 32px ${factionColor}55`,
              backdropFilter: "blur(2px)",
            }}
          >
            <CardInfoBody card={card} />
          </HoverCard.Content>
        </HoverCard.Portal>
      )}
    </HoverCard.Root>
  );
});
