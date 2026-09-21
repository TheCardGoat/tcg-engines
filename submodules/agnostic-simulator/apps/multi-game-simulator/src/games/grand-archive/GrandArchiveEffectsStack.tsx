import { GrandArchiveRoleCard } from "./GrandArchiveRoleCard";
import { ActionIcon } from "@mantine/core";
import { ArrowDown, ArrowUp, RotateCcw, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

export function GrandArchiveEffectsStack({
  zone,
  viewerId,
  entities,
  candidateIds,
  selectedIds,
  selectedOrder,
  onSelect,
  onPreview,
}: {
  readonly viewerId?: string;
  readonly zone: SimulatorZone | undefined;
  readonly entities: readonly SimulatorEntity[];
  readonly candidateIds: readonly string[];
  readonly selectedIds: readonly string[];
  readonly selectedOrder: ReadonlyMap<string, number>;
  readonly onSelect: (id: string) => void;
  readonly onPreview: (entity: SimulatorEntity | undefined) => void;
}) {
  const [placement, setPlacement] = useState<"center" | "top" | "bottom">("center");
  const [expandedIdentity, setExpandedIdentity] = useState<string | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const previewId = useRef<string | null>(null);
  const identity = zone?.entityIds.join("|") ?? "";
  const items = (zone?.entityIds ?? [])
    .map((id) => entities.find((entity) => entity.id === id))
    .filter((entity): entity is SimulatorEntity => Boolean(entity));
  const choosing = items.some((entity) => candidateIds.includes(entity.id));
  const expanded =
    items.length > 1 && (choosing || items.length > 3 || expandedIdentity === identity);
  const nextPlacement = placement === "center" ? "top" : placement === "top" ? "bottom" : "center";
  const preview = (entity: SimulatorEntity | undefined) => {
    previewId.current = entity?.id ?? null;
    onPreview(entity);
  };

  useEffect(() => {
    if (previewId.current && !zone?.entityIds.includes(previewId.current)) {
      previewId.current = null;
      onPreview(undefined);
    }
  }, [identity, zone, onPreview]);

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setExpandedIdentity(null);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  if (items.length === 0) return null;
  return (
    <section
      ref={panelRef}
      className="ga-effects-stack"
      data-placement={placement}
      data-expanded={expanded}
      data-stack-count={items.length}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setExpandedIdentity(null);
          preview(undefined);
        }
      }}
      aria-label={`Effects Stack, ${items.length} ${items.length === 1 ? "layer" : "layers"}`}
    >
      <header>
        <strong>Effects Stack</strong>
        <span className="ga-effects-stack__controls">
          <span>
            {items.length} {items.length === 1 ? "layer" : "layers"}
          </span>
          {items.length > 1 && items.length <= 3 && !choosing ? (
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label={expanded ? "Collapse Effects Stack" : "Expand Effects Stack"}
              aria-expanded={expanded}
              onClick={() => setExpandedIdentity(expanded ? null : identity)}
            >
              <Layers size={14} aria-hidden="true" />
            </ActionIcon>
          ) : null}
          <ActionIcon
            className="ga-effects-stack__placement"
            variant="subtle"
            color="gray"
            aria-label={`Move Effects Stack to ${nextPlacement}`}
            title={`Move Effects Stack to ${nextPlacement}`}
            onClick={() => setPlacement(nextPlacement)}
          >
            {placement === "center" ? (
              <ArrowUp size={14} />
            ) : placement === "top" ? (
              <ArrowDown size={14} />
            ) : (
              <RotateCcw size={14} />
            )}
          </ActionIcon>
        </span>
      </header>
      <ol className="ga-effects-stack__items" aria-label="Cards and abilities in resolution order">
        {items.toReversed().map((entity, index) => (
          <li
            className="ga-effects-stack__item"
            data-top={index === 0 ? "true" : undefined}
            aria-label={`Layer ${items.length - index}${index === 0 ? ", resolves next" : ""}`}
            key={entity.id}
            onFocus={() => {
              setExpandedIdentity(identity);
              preview(entity);
            }}
            onBlur={() => preview(undefined)}
          >
            <span className="ga-effects-stack__layer">{items.length - index}</span>
            {selectedOrder.has(entity.id) ? (
              <span className="ga-interaction-order" aria-hidden="true">
                {selectedOrder.get(entity.id)}
              </span>
            ) : null}
            <GrandArchiveRoleCard
              entity={entity}
              density="mini"
              fill
              selected={selectedIds.includes(entity.id)}
              targetable={candidateIds.includes(entity.id)}
              dimmed={candidateIds.length > 0 && !candidateIds.includes(entity.id)}
              tabIndex={0}
              accessibleLabel={`${entity.title}, layer ${items.length - index}, ${index === 0 ? "resolves next" : `resolves ${index + 1}`}, controlled by ${entity.ownerId === viewerId ? "You" : "Opponent"}, ${entity.subtitle ?? "pending resolution"}${selectedOrder.has(entity.id) ? `, selection ${selectedOrder.get(entity.id)}` : ""}`}
              onClick={() => {
                if (candidateIds.includes(entity.id)) onSelect(entity.id);
                else {
                  setExpandedIdentity(identity);
                  preview(entity);
                }
              }}
              onHoverEnter={preview}
              onHoverLeave={() => preview(undefined)}
            />
            <span className="ga-effects-stack__owner" aria-hidden="true">
              {entity.subtitle ? (
                <span>
                  {entity.subtitle}
                  <br />
                </span>
              ) : null}
              {entity.ownerId === viewerId ? "You" : "Opponent"}
              {index === 0 ? " · Next" : ""}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
