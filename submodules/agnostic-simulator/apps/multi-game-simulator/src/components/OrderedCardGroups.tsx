import { useState } from "react";
import { EntityPartitionValue, type EntityPartitionInput } from "@tcg/protocol";
import type { InteractionSubmissionValue } from "@tcg/protocol";
import { resolveInteractionText } from "@tcg/simulator-ui";
import {
  ChoiceDragProvider,
  ChoiceDraggable,
  ChoiceDropSlot,
  ChoiceDropRegion,
  placeChoice,
  type ChoiceAssignments,
} from "@tcg/simulator-presentation/choice-drag";
import type { TargetCard } from "@tcg/simulator-presentation/target-modal";
import "./ordered-card-groups.css";

/** Viewer-safe ordered groups. Pointer drag and keyboard use the same placement rules. */
export function OrderedCardGroups({
  input,
  value,
  cards,
  locked,
  reducedMotion = false,
  onChange,
  onPlace,
}: {
  input: EntityPartitionInput;
  value: InteractionSubmissionValue | undefined;
  cards: ReadonlyMap<string, TargetCard>;
  locked: boolean;
  reducedMotion?: boolean;
  onChange: (value: Record<string, string[]>) => void;
  onPlace?: () => void;
}) {
  const [status, setStatus] = useState("");
  const parsed = EntityPartitionValue.safeParse(value);
  const groups = parsed.success ? parsed.data : {};
  const tokens = input.candidates
    .filter((candidate) => candidate.enabled !== false)
    .map((candidate) => {
      const id = candidate.entity.instanceId;
      return {
        id,
        label:
          cards.get(id)?.label ??
          (candidate.text ? resolveInteractionText(candidate.text) : "Card"),
        imageUrl: cards.get(id)?.imageUrl,
      };
    });
  const slots = input.routes.map((route) => ({
    id: route.id,
    label: resolveInteractionText(route.text),
    min: route.min,
    max: route.max,
    ordered: route.ordered,
    accepts: tokens
      .filter((token) => !route.candidateIds || route.candidateIds.includes(token.id))
      .map((token) => token.id),
  }));
  const assigned = new Set(Object.values(groups).flat());
  const remainingMessage = (count: number) =>
    `${count} ${count === 1 ? "card still needs" : "cards still need"} a group.`;
  const change = (next: ChoiceAssignments) => {
    onChange(Object.fromEntries(Object.entries(next).map(([id, group]) => [id, [...group]])));
    const remaining = tokens.length - new Set(Object.values(next).flat()).size;
    setStatus(remaining > 0 ? remainingMessage(remaining) : "Order updated. Confirm when ready.");
    onPlace?.();
  };
  const unplaced = tokens.filter((token) => !assigned.has(token.id));
  const cardFace = (id: string) => {
    const token = tokens.find((entry) => entry.id === id);
    return (
      <ChoiceDraggable id={id}>
        {token?.imageUrl ? (
          <img src={token.imageUrl} alt="" draggable={false} />
        ) : (
          <span>{token?.label}</span>
        )}
      </ChoiceDraggable>
    );
  };
  return (
    <div className="tcg-ordered-groups" data-reduced-motion={reducedMotion}>
      <p className="tcg-ordered-groups__instruction">
        Choose a destination for each card, or drag it. Set the order, then confirm.
      </p>
      <ChoiceDragProvider
        tokens={tokens}
        slots={slots}
        value={groups}
        locked={locked}
        ghostClassName="tcg-order-ghost"
        onChange={change}
        onReject={() => setStatus("That placement is not permitted. Your order has not changed.")}
      >
        <div className="tcg-ordered-groups__stage" data-route-count={input.routes.length}>
          <section aria-label="Unplaced cards" className="tcg-ordered-groups__pool">
            <header>
              <h3>
                {input.candidateSetText ? resolveInteractionText(input.candidateSetText) : "Cards"}
              </h3>
              <span>{unplaced.length} to place</span>
            </header>
            <div className="tcg-ordered-groups__hand">
              {unplaced.map((token) => (
                <div key={token.id}>
                  {cardFace(token.id)}
                  <div className="tcg-ordered-groups__quick-place">
                    {slots.map((slot) => (
                      <ChoiceDropSlot key={slot.id} id={slot.id} tokenId={token.id}>
                        {slot.label}
                      </ChoiceDropSlot>
                    ))}
                  </div>
                </div>
              ))}
              {!unplaced.length && (
                <div className="tcg-ordered-groups__complete">
                  <span aria-hidden="true">✓</span>Ready to confirm
                </div>
              )}
            </div>
          </section>
          <div className="tcg-ordered-groups__routes">
            {input.routes.map((route) => {
              const ids = groups[route.id] ?? [];
              return (
                <ChoiceDropRegion key={route.id} id={route.id}>
                  <header>
                    <h3>{resolveInteractionText(route.text)}</h3>
                    <span>
                      {route.orderDirection === "bottom-first" ? "Deepest first →" : "Draw order →"}
                    </span>
                  </header>
                  <div className="tcg-ordered-groups__destination" data-empty={!ids.length}>
                    <ol>
                      {ids.map((id, index) => (
                        <li key={id}>
                          <ChoiceDropSlot
                            id={route.id}
                            before={id}
                            className="tcg-ordered-groups__insert"
                          >
                            <span className="choice-sr">Insert at position {index + 1}</span>
                            <span aria-hidden="true">+</span>
                          </ChoiceDropSlot>
                          <div className="tcg-ordered-groups__card" data-order-card={id}>
                            {cardFace(id)}
                            <b aria-label={`Position ${index + 1}`}>{index + 1}</b>
                          </div>
                          <div className="tcg-ordered-groups__reorder">
                            <button
                              disabled={locked || index === 0}
                              aria-label={`Move ${tokens.find((token) => token.id === id)?.label} earlier`}
                              onClick={() =>
                                change(placeChoice(slots, groups, id, route.id, ids[index - 1]))
                              }
                            >
                              <span aria-hidden="true">←</span>
                            </button>
                            <button
                              disabled={locked || index === ids.length - 1}
                              aria-label={`Move ${tokens.find((token) => token.id === id)?.label} later`}
                              onClick={() =>
                                change(placeChoice(slots, groups, id, route.id, ids[index + 2]))
                              }
                            >
                              <span aria-hidden="true">→</span>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <ChoiceDropSlot id={route.id} className="tcg-ordered-groups__end">
                      <span aria-hidden="true">{ids.length ? "+" : "◇"}</span>
                      <span>{ids.length ? "Add here" : "Drop cards here"}</span>
                    </ChoiceDropSlot>
                  </div>
                </ChoiceDropRegion>
              );
            })}
          </div>
        </div>
      </ChoiceDragProvider>
      <div className="tcg-ordered-groups__tools">
        <button
          className="tcg-ordered-groups__reset"
          disabled={locked || assigned.size === 0}
          onClick={() => {
            onChange({});
            setStatus("Changes cancelled. Place the cards again to retry.");
          }}
        >
          Cancel changes
        </button>
        <p role="status">{status || remainingMessage(unplaced.length)}</p>
        <span className="tcg-ordered-groups__keyboard">
          Click or Enter to pick up · Esc to release
        </span>
      </div>
    </div>
  );
}
