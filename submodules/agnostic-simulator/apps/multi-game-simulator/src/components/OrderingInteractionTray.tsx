import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { pointerWithin, rectIntersection } from "@dnd-kit/core";
import {
  PointerDragDropSurface,
  PointerDraggable,
  PointerDroppable,
  useInteractionDraft,
  type useInteractionSurface,
} from "@tcg/simulator-ui";
import type { OrderingInput } from "@tcg/protocol";
import { resolveInteractionText } from "@tcg/simulator-ui";
import type { TargetCard } from "@tcg/simulator-presentation/target-modal";
import "./ordering-interaction-tray.css";

/** The draft owns the order. This control never resolves a game effect locally. */
export function OrderingInteractionTray({
  input,
  surface,
  cards,
  reducedMotion,
  onMove,
}: {
  input: OrderingInput;
  surface: ReturnType<typeof useInteractionSurface>;
  cards: ReadonlyMap<string, TargetCard>;
  reducedMotion?: boolean;
  onMove?: () => void;
}) {
  const draft = useInteractionDraft();
  const initial = input.candidates
    .filter((candidate) => candidate.enabled !== false)
    .map((candidate) => candidate.entity.instanceId);
  const value = surface.values[input.id];
  const order = Array.isArray(value) ? value : initial;
  useEffect(() => {
    if (value === undefined && !surface.locked) draft.change(input.id, initial);
  }, [surface.requestId, value, surface.locked]);
  const move = (from: string, to: string) => {
    if (surface.locked || !order.includes(from) || !order.includes(to) || from === to) return false;
    const next = [...order];
    next.splice(next.indexOf(from), 1);
    next.splice(order.indexOf(to), 0, from);
    draft.change(input.id, next);
    onMove?.();
    return true;
  };
  const label = (id: string) =>
    cards.get(id)?.label ??
    resolveInteractionText(
      input.candidates.find((candidate) => candidate.entity.instanceId === id)?.text ?? {
        key: "Effect",
      },
    );
  const effects = input.entityKind === "effect";
  const marker = (id: string) => {
    const card = cards.get(id);
    return (
      <div className={`tcg-order-marker ${effects ? "tcg-order-ability" : "tcg-order-card"}`}>
        {card?.imageUrl ? (
          <img src={card.imageUrl} alt="" draggable={false} />
        ) : (
          <div className="tcg-order-art-fallback" aria-hidden="true">
            ✦
          </div>
        )}
        {effects && (
          <div className="tcg-order-ability-copy">
            <span className="tcg-order-kind">Triggered ability · {initial.indexOf(id) + 1}</span>
            <strong>{label(id)}</strong>
            <p>
              {card?.detail ?? (card ? "Triggered ability" : "Drag to change resolution order.")}
            </p>
          </div>
        )}
      </div>
    );
  };
  return (
    <section
      className="tcg-order-tray"
      aria-label="Order simultaneous items"
      data-reduced-motion={reducedMotion || undefined}
    >
      <header className="tcg-order-heading">
        <span className="tcg-order-eyebrow">
          {effects ? "Simultaneous effects" : "Simultaneous arrivals"}
        </span>
        <h2>{effects ? "Choose resolution order" : "Arrange your Oblivion"}</h2>
        <p>Drag {effects ? "abilities" : "cards"} to change their order.</p>
      </header>
      <div className="tcg-order-stage">
        <div className="tcg-order-direction" aria-hidden="true">
          <span>{effects ? "Resolves first" : "Top of pile"}</span>
          <span className="tcg-order-line" />
          <ArrowRight size={16} />
          <span>{effects ? "Resolves last" : "Below"}</span>
        </div>
        <PointerDragDropSurface
          id={`order-${surface.requestId}`}
          cancelKey={surface.requestId}
          decodeSource={(id) => (order.includes(id) ? id : null)}
          collisionDetection={(args) => {
            const hits = pointerWithin(args);
            return hits.length ? hits : rectIntersection(args);
          }}
          dropAnimation={reducedMotion ? null : undefined}
          renderOverlay={marker}
          onDragEnd={(id, target) => ({
            kind: id && target && move(id, target.replace(/^slot:/, "")) ? "accepted" : "rejected",
          })}
        >
          <ol aria-label="Resolution order">
            {order.map((id, index) => (
              <li key={id} data-order-id={id}>
                <PointerDroppable
                  id={`slot:${id}`}
                  disabled={surface.locked}
                  className="tcg-order-slot"
                >
                  <span className="tcg-order-number" aria-label={`Position ${index + 1}`}>
                    {index + 1}
                  </span>
                  <PointerDraggable
                    id={id}
                    disabled={surface.locked}
                    transformBehavior="overlay-only"
                    aria-label={`Move item ${index + 1}`}
                  >
                    {marker(id)}
                  </PointerDraggable>
                  {!effects && <span className="tcg-order-card-name">{label(id)}</span>}
                  <div className="tcg-order-controls">
                    <button
                      disabled={surface.locked || index === 0}
                      aria-label={`Move item ${index + 1} earlier`}
                      title="Move earlier"
                      onClick={() => move(id, order[index - 1])}
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <span>
                      {index === 0
                        ? effects
                          ? "First"
                          : "Top"
                        : index === order.length - 1
                          ? "Last"
                          : `${index + 1} of ${order.length}`}
                    </span>
                    <button
                      disabled={surface.locked || index === order.length - 1}
                      aria-label={`Move item ${index + 1} later`}
                      title="Move later"
                      onClick={() => move(id, order[index + 1])}
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </PointerDroppable>
              </li>
            ))}
          </ol>
        </PointerDragDropSurface>
      </div>
      <footer className="tcg-order-footer">
        <button
          className="tcg-order-reset"
          disabled={surface.locked}
          onClick={() => draft.change(input.id, initial)}
        >
          <RotateCcw size={15} /> Reset order
        </button>
        <button
          className="tcg-order-confirm"
          aria-label={surface.rejected ? "Retry order" : "Confirm order"}
          disabled={!surface.canConfirm}
          onClick={surface.confirm}
        >
          {surface.rejected ? "Retry order" : "Done"}
        </button>
        <button
          className="tcg-order-cancel"
          disabled={surface.locked}
          onClick={() => {
            draft.change(input.id, initial);
            surface.minimize();
          }}
        >
          Cancel changes
        </button>
        <p className="tcg-order-hint">
          {surface.rejected
            ? "The order was not accepted. Review it and try again."
            : "Nothing resolves until you confirm."}
        </p>
      </footer>
    </section>
  );
}
