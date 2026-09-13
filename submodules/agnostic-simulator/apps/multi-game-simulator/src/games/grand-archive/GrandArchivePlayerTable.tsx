import { getGrandArchiveCard } from "@tcg/grand-archive-cards";
import { GrandArchiveRoleCard } from "./GrandArchiveRoleCard";
import { Modal, Group, Tooltip } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { SimulatorViewportRailPortal, useSimulatorViewportLayout } from "@tcg/simulator-ui";
import { Layers, Library, Skull, Flame, Brain } from "lucide-react";
import {
  grandArchiveCardPresentation,
  grandArchiveConcealedCard,
} from "@tcg/grand-archive-server-adapter";
import type { SimulatorEntity, SimulatorZone, SimulatorSeat } from "@tcg/simulator-contract";
import type { GrandArchiveSimulatorWaitState } from "@tcg/grand-archive-server-adapter";
import { GrandArchiveAgencySignal } from "./GrandArchiveAgencySignal";
import { useGrandArchiveInteractionWorkspace } from "./GrandArchiveInteractionLayer";

interface GrandArchivePlayerTableProps {
  readonly seat: SimulatorSeat;
  readonly zones: readonly SimulatorZone[];
  readonly entities: readonly SimulatorEntity[];
  readonly side: "top" | "bottom";
  readonly turnPlayerId: string;
  readonly waitState: GrandArchiveSimulatorWaitState;
}

function agencyLabel(waitState: GrandArchiveSimulatorWaitState, isSelf: boolean): string {
  switch (waitState.kind) {
    case "opportunity":
      return isSelf ? "You have Opportunity" : "Opponent has Opportunity";
    case "decision":
      return isSelf ? "Your decision" : "Opponent is deciding";
    case "materialization-choice":
      return isSelf ? "Choose what to materialize" : "Opponent is materializing";
    case "pregame-action":
      return isSelf ? "Your pregame action" : "Opponent is taking a pregame action";
    case "resolving":
      return "Resolving";
    case "game-over":
      return "Game over";
  }
}

/** Public field with compact support-zone counters in the viewport rails on phones. */
export function GrandArchivePlayerTable({
  seat,
  zones,
  entities,
  side,
  turnPlayerId,
  waitState,
}: GrandArchivePlayerTableProps) {
  const entitiesById = useMemo(
    () => new Map(entities.map((entity) => [entity.id, entity])),
    [entities],
  );
  const [inspectionPortalTarget, setInspectionPortalTarget] = useState<HTMLElement | null>(null);
  const interaction = useGrandArchiveInteractionWorkspace();
  const isSelf = side === "bottom";
  const agencyPlayerId = "playerId" in waitState ? waitState.playerId : undefined;
  const hasAgency = agencyPlayerId === seat.id;
  const hasOpportunity = waitState.kind === "opportunity" && hasAgency;
  return (
    <section
      ref={setInspectionPortalTarget}
      className="ga-player-table"
      data-seat-side={side}
      data-player-id={seat.id}
      data-testid={`ga-player-table-${side}`}
      data-turn={turnPlayerId === seat.id ? "true" : undefined}
      data-agency={hasAgency ? "true" : undefined}
      data-opportunity={hasOpportunity ? "true" : undefined}
      data-agency-kind={hasAgency ? waitState.kind : undefined}
      aria-label={`${isSelf ? "Your" : "Opponent"} arena`}
    >
      <GrandArchiveAgencySignal
        active={hasAgency}
        side={side === "top" ? "bottom" : "top"}
        statusLabel={agencyLabel(waitState, isSelf)}
      />
      {interaction.candidateIds.includes(seat.id) ? (
        <button
          type="button"
          className="ga-player-target"
          data-selected={interaction.selectedIds.includes(seat.id) || undefined}
          aria-pressed={interaction.selectedIds.includes(seat.id)}
          onClick={() => interaction.selectEntity(seat.id)}
        >
          Select {isSelf ? "yourself" : seat.label}
        </button>
      ) : null}
      <div
        className="ga-seat-grid ga-seat-layout"
        aria-label={`${isSelf ? "Your" : "Opponent"} board zones`}
      >
        <div className="ga-seat-field-area">
          <GrandArchiveSeatZone
            name="field"
            label="Field"
            seat={seat}
            zones={zones}
            entitiesById={entitiesById}
            isSelf={isSelf}
          />
          <div className="ga-seat-extra-zones">
            {(
              [
                ["intent", "Intent"],
                ["pantheon", "Pantheon"],
                ["inner-lineage", "Inner Lineage"],
                ["loaded", "Loaded"],
              ] as const
            ).map(([name, label]) => (
              <GrandArchiveSeatZone
                key={name}
                name={name}
                label={label}
                seat={seat}
                zones={zones}
                entitiesById={entitiesById}
                isSelf={isSelf}
                hideWhenEmpty
              />
            ))}
          </div>
        </div>
        <GrandArchiveZoneCounters
          seat={seat}
          zones={zones}
          entitiesById={entitiesById}
          side={side}
          inspectionPortalTarget={inspectionPortalTarget}
        />
      </div>
    </section>
  );
}

function GrandArchiveSeatZone({
  name,
  label,
  seat,
  zones,
  entitiesById,
  isSelf,
  hideWhenEmpty = false,
}: {
  readonly name: "field" | "memory" | "intent" | "pantheon" | "inner-lineage" | "loaded";
  readonly label: string;
  readonly seat: SimulatorSeat;
  readonly zones: readonly SimulatorZone[];
  readonly entitiesById: ReadonlyMap<string, SimulatorEntity>;
  readonly isSelf: boolean;
  readonly hideWhenEmpty?: boolean;
}) {
  const interaction = useGrandArchiveInteractionWorkspace();
  // Zone membership comes from the viewer projection, never card ownership.
  const zone = zones.find((entry) => entry.id === `${seat.id}:${name}`);
  const visible = (zone?.entityIds ?? []).flatMap((id) => {
    const entity = entitiesById.get(id);
    return entity ? [entity] : [];
  });
  const fieldIds = new Set(
    zones.filter((entry) => entry.id.endsWith(":field")).flatMap((entry) => entry.entityIds),
  );
  const displayed =
    name === "inner-lineage"
      ? visible.filter((entity) => !fieldIds.has(String(entity.dataAttributes?.["data-host-id"])))
      : visible;
  // Remove only cards already rendered in field stacks. Concealed cards still
  // contribute to the zone's count and must retain anonymous placeholders.
  const count = (zone?.count ?? visible.length) - (visible.length - displayed.length);
  if (hideWhenEmpty && count === 0) return null;
  const cards: SimulatorEntity[] = [
    ...displayed,
    ...Array.from({ length: Math.max(0, count - displayed.length) }, (_, index) =>
      grandArchiveConcealedCard(`${seat.id}:${name}:concealed:${index}`, seat.id),
    ),
  ];
  const renderCard = (entity: SimulatorEntity) => {
    const known = entity.face === "public";
    // Private identities remain available for inspection (rules 6.1),
    // but Memory cards lie face down unless explicitly revealed (rules 1, 9).
    const faceDown =
      !known || (name === "memory" && entity.dataAttributes?.["data-facing"] !== "face-up");
    const targetable = interaction.candidateIds.includes(entity.id);
    const inspectionAnchor = known && faceDown;
    // Authorized card backs need a menu/preview anchor. Keep the inner
    // card button as the sole keyboard stop; concealed opponents get none.
    return (
      <div
        key={entity.id}
        className="ga-seat-zone__card"
        data-sim-entity-id={inspectionAnchor ? entity.id : undefined}
        role={inspectionAnchor ? "group" : undefined}
        tabIndex={inspectionAnchor ? -1 : undefined}
        onFocus={() => {
          if (known) interaction.previewEntity(entity);
        }}
        onBlur={() => interaction.previewEntity(undefined)}
      >
        {name !== "field" && typeof entity.dataAttributes?.["data-host-id"] === "string" ? (
          <span className="ga-zone-host">
            {(entitiesById.get(entity.dataAttributes["data-host-id"])?.face === "public"
              ? entitiesById.get(entity.dataAttributes["data-host-id"])?.title
              : undefined) ?? "Attached card"}
          </span>
        ) : null}
        {/* Projected public cards also carry the shared back for owner-visible face-down zones. */}
        <GrandArchiveRoleCard
          entity={faceDown ? { ...entity, face: "hidden" } : entity}
          accessibleLabel={known && faceDown ? entity.title : undefined}
          density="mini"
          fullImageFit="contain"
          as={known || targetable ? "button" : "div"}
          tabIndex={known || targetable ? 0 : -1}
          selected={interaction.selectedIds.includes(entity.id)}
          targetable={targetable}
          dimmed={interaction.candidateIds.length > 0 && !targetable}
          onClick={() => {
            if (targetable) interaction.selectEntity(entity.id);
            else if (known) interaction.previewEntity(entity);
          }}
          onHoverEnter={() => {
            if (known) interaction.previewEntity(entity);
          }}
          onHoverLeave={() => interaction.previewEntity(undefined)}
        />
      </div>
    );
  };
  return (
    <section
      key={name}
      className={`ga-seat-zone ga-seat-zone--${name}`}
      data-zone={name}
      aria-label={`${isSelf ? "Your" : "Opponent"} ${name}, ${count} cards`}
    >
      <header>
        {label}
        <span>{count}</span>
      </header>
      <div className="ga-seat-zone__cards">
        {cards.map((entity) => {
          const lineage =
            name === "field"
              ? zones
                  .filter((entry) => entry.id.endsWith(":inner-lineage"))
                  .flatMap((entry) => entry.entityIds)
                  .flatMap((id) => {
                    const card = entitiesById.get(id);
                    return card?.dataAttributes?.["data-host-id"] === entity.id ? [card] : [];
                  })
              : [];
          if (lineage.length === 0) return renderCard(entity);
          // Champion / Leveling Up 1, 6–7: one field object, with earlier cards
          // underneath. The engine's base object adopts the newest card's face;
          // display its original face once below the physical level-up cards.
          const definitionId = entity.dataAttributes?.["data-base-definition-id"];
          const base =
            typeof definitionId === "string" ? getGrandArchiveCard(definitionId) : undefined;
          const hasChampionLevel = lineage.some((card) => card.kind === "leader");
          const current = lineage.findLast(
            (card) =>
              card.kind === "leader" &&
              typeof card.dataAttributes?.["data-definition-id"] === "string" &&
              card.dataAttributes["data-definition-id"] ===
                entity.dataAttributes?.["data-definition-id"],
          );
          const top = current && interaction.candidateIds.includes(current.id) ? current : entity;
          const lowerCards = lineage.filter((card) => card.id !== current?.id);
          if (base && hasChampionLevel)
            lowerCards.push(
              grandArchiveCardPresentation({
                id: `${entity.id}:lineage-base`,
                title: base.name,
                subtitle: "Inner Lineage",
                ownerId: entity.ownerId,
                kind: "card",
                face: "public",
                imageUrl: base.printings[0]?.imageUrl,
                imageAspectRatio: 5 / 7,
                states: [],
                stats: [],
                traits: [],
                dataAttributes: {
                  "data-definition-id": base.canonicalId,
                  "data-lineage-position": entity.dataAttributes?.["data-lineage-position"] ?? -1,
                },
              }),
            );
          lowerCards.sort(
            (left, right) =>
              Number(left.dataAttributes?.["data-lineage-position"] ?? -1) -
              Number(right.dataAttributes?.["data-lineage-position"] ?? -1),
          );
          return (
            <div
              key={entity.id}
              className="ga-champion-lineage"
              role="group"
              aria-label={`${entity.title} lineage`}
            >
              {lowerCards.map(renderCard)}
              {renderCard(top)}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function GrandArchiveZoneCounters({
  seat,
  zones,
  entitiesById,
  side,
  inspectionPortalTarget,
}: {
  readonly inspectionPortalTarget: HTMLElement | null;
  readonly seat: SimulatorSeat;
  readonly zones: readonly SimulatorZone[];
  readonly entitiesById: ReadonlyMap<string, SimulatorEntity>;
  readonly side: "top" | "bottom";
}) {
  const layout = useSimulatorViewportLayout();
  const counters = (
    <div
      className="ga-zone-counters"
      data-side={side}
      role="group"
      aria-label={`${side === "bottom" ? "Your" : "Opponent"} zone counts`}
    >
      {(
        [
          ["main-deck", "Deck", Layers],
          ["material-deck", "Material Deck", Library],
          ["graveyard", "Graveyard", Skull],
          ["banishment", "Banishment", Flame],
          ["memory", "Memory", Brain],
        ] as const
      ).map(([name, label, Icon]) => (
        <GrandArchivePile
          key={name}
          name={name}
          label={label}
          Icon={Icon}
          inspectionPortalTarget={inspectionPortalTarget}
          seat={seat}
          zones={zones}
          entitiesById={entitiesById}
        />
      ))}
    </div>
  );
  return layout === "mobile" ? (
    <SimulatorViewportRailPortal position={side === "bottom" ? "bottom" : "top"}>
      {counters}
    </SimulatorViewportRailPortal>
  ) : (
    counters
  );
}

function GrandArchivePile({
  name,
  label,
  Icon,
  inspectionPortalTarget,
  seat,
  zones,
  entitiesById,
}: {
  readonly name: "material-deck" | "main-deck" | "banishment" | "graveyard" | "memory";
  readonly Icon: typeof Layers;
  readonly inspectionPortalTarget: HTMLElement | null;
  readonly label: string;
  readonly seat: SimulatorSeat;
  readonly zones: readonly SimulatorZone[];
  readonly entitiesById: ReadonlyMap<string, SimulatorEntity>;
}) {
  const [open, setOpen] = useState(false);
  const interaction = useGrandArchiveInteractionWorkspace();
  useEffect(() => {
    if (interaction.active) setOpen(false);
  }, [interaction.active]);
  const zone = zones.find((entry) => entry.id === `${seat.id}:${name}`);
  const visible = (zone?.entityIds ?? []).flatMap((id) => {
    const entity = entitiesById.get(id);
    return entity ? [entity] : [];
  });
  // Private projections authorize identities, not their original pile positions.
  const unorderedReveals = name === "main-deck" || zone?.visibility === "private";
  if (unorderedReveals)
    visible.sort(
      (left, right) => left.title.localeCompare(right.title) || left.id.localeCompare(right.id),
    );
  const count = zone?.count ?? visible.length;
  const inspectionLabel =
    name === "main-deck"
      ? "Revealed deck cards"
      : unorderedReveals
        ? `Revealed ${label} cards`
        : label;
  const countLabel = `${count} ${count === 1 ? "card" : "cards"}`;
  const deck = name === "main-deck" || name === "material-deck";
  const ownerLabel = seat.perspective === "bottom" ? "Your" : "Opponent";
  const accessibleLabel = `${ownerLabel} ${label}, ${countLabel}`;
  const targetable =
    !interaction.hasFocusedChoice &&
    visible.some((entity) => interaction.candidateIds.includes(entity.id));
  return (
    <div className="ga-zone-counter" data-zone={name}>
      <Tooltip
        label={accessibleLabel}
        withArrow
        events={{ hover: true, focus: true, touch: false }}
      >
        <button
          type="button"
          className="ga-zone-counter__button"
          aria-label={accessibleLabel}
          aria-haspopup="dialog"
          data-targetable={targetable || undefined}
          onClick={() => {
            interaction.previewEntity(undefined);
            setOpen(true);
          }}
        >
          <Icon size={17} aria-hidden="true" />
          <span>{count}</span>
        </button>
      </Tooltip>
      <Modal
        // Keep inspection anchors inside the board's delegated card controller,
        // even when the counter itself is portaled into a mobile viewport rail.
        portalProps={
          inspectionPortalTarget
            ? {
                target:
                  inspectionPortalTarget.closest<HTMLElement>("[data-card-context-controller]") ??
                  inspectionPortalTarget,
              }
            : undefined
        }
        styles={{ inner: { left: 0 } }}
        opened={open}
        onClose={() => setOpen(false)}
        title={
          name === "memory"
            ? `${ownerLabel} Memory · ${countLabel}`
            : `${inspectionLabel} · ${unorderedReveals ? visible.length + " revealed" : countLabel}`
        }
        size="lg"
        centered
      >
        {unorderedReveals && name !== "memory" ? (
          <p>
            Only revealed cards are shown. Their order here does not indicate{" "}
            {deck ? "deck" : "pile"} order.
          </p>
        ) : null}
        {name === "memory" ? (
          <GrandArchiveSeatZone
            name="memory"
            label="Memory"
            seat={seat}
            zones={zones}
            entitiesById={entitiesById}
            isSelf={seat.perspective === "bottom"}
          />
        ) : (
          <Group gap="sm" align="start">
            {visible.map((entity) => (
              <GrandArchiveRoleCard
                key={entity.id}
                entity={entity}
                density="compact"
                fullImageFit="contain"
                as={entity.face === "public" ? "button" : "div"}
                targetable={interaction.candidateIds.includes(entity.id)}
                selected={interaction.selectedIds.includes(entity.id)}
                onClick={() => {
                  if (interaction.candidateIds.includes(entity.id))
                    interaction.selectEntity(entity.id);
                  else if (entity.face === "public") interaction.previewEntity(entity);
                }}
              />
            ))}
            {count > visible.length ? <p>{count - visible.length} concealed cards</p> : null}
            {count === 0 ? <p>No cards in this zone</p> : null}
          </Group>
        )}
      </Modal>
    </div>
  );
}
