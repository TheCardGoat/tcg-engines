import type { SimulatorEntity } from "@tcg/simulator-contract";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { FabCardPreviewSurface } from "./FabCardPreview";

/** Reading a candidate is separate from the choice that submits it. */
export function FabMobileChoicePreview({
  entity,
  candidates,
}: {
  entity: SimulatorEntity;
  candidates: readonly SimulatorEntity[];
}) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const keyFor = (candidate: SimulatorEntity) => {
    const canonicalId = candidate.dataAttributes?.["data-fab-canonical-id"];
    return typeof canonicalId === "string" ? canonicalId : candidate.id;
  };
  const uniqueCards = new Map<string, SimulatorEntity>();
  for (const candidate of candidates) {
    const key = keyFor(candidate);
    if (!uniqueCards.has(key)) uniqueCards.set(key, candidate);
  }
  // Keep the selected duplicate's exact printing and instance presentation.
  uniqueCards.set(keyFor(entity), entity);
  const cards = [...uniqueCards.values()];
  const index = Math.max(
    0,
    cards.findIndex((card) => card.id === (previewId ?? entity.id)),
  );
  const current = cards[index] ?? entity;
  const movePreview = (nextIndex: number) => {
    const next = cards[nextIndex];
    if (next) setPreviewId(next.id);
  };

  return (
    <details className="fab-choice-card-preview">
      <summary>Preview {current.title}</summary>
      {cards.length > 1 ? (
        <div className="fab-choice-preview-navigation">
          <button
            type="button"
            aria-label="Preview previous card"
            disabled={index === 0}
            onClick={() => movePreview(index - 1)}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <span role="status">
            Card {index + 1} of {cards.length}
          </span>
          <button
            type="button"
            aria-label="Preview next card"
            disabled={index === cards.length - 1}
            onClick={() => movePreview(index + 1)}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <FabCardPreviewSurface entity={current} />
    </details>
  );
}
