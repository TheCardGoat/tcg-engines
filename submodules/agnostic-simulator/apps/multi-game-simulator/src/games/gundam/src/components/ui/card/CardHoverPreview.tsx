import { useCardInspect } from "./card-inspect-context.tsx";
import { CARD_IMAGE_DIMENSIONS, CARD_SIZE_SCALES, type CardSize } from "./card-image-format.ts";
import { CardFace } from "./CardFace.tsx";

const PREVIEW_SIZE: CardSize = "medium";
const { width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT } = {
  width: Math.round(CARD_IMAGE_DIMENSIONS.full.width * CARD_SIZE_SCALES[PREVIEW_SIZE]),
  height: Math.round(CARD_IMAGE_DIMENSIONS.full.height * CARD_SIZE_SCALES[PREVIEW_SIZE]),
};

export function CardHoverPreview() {
  const ctx = useCardInspect();
  if (!ctx?.hovered) return null;

  const card = ctx.hovered.card;

  return (
    <div
      data-testid="card-hover-preview"
      data-card-id={card.id}
      className="fixed top-4 left-4 z-[500] pointer-events-none [animation:gd-fade-in_.12s_ease]"
      style={{
        filter: "drop-shadow(0 8px 24px rgba(0,0,0,.6)) drop-shadow(0 0 18px rgba(45,107,255,.25))",
      }}
      aria-hidden
    >
      <CardFace
        card={{ ...card, exerted: false, selected: false, highlight: false }}
        width={PREVIEW_WIDTH}
        height={PREVIEW_HEIGHT}
      />
    </div>
  );
}
