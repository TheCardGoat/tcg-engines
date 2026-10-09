import {
  GrandArchiveBoard as GrandArchiveScene,
  grandArchiveSlotStyle,
  type GrandArchiveComposition,
  type GrandArchiveTheme,
  grandArchiveFieldOverflow,
  type GrandArchiveBoardCard,
  type GrandArchiveBoardProjection,
  type GrandArchiveBoardZone,
  type GrandArchiveCardScreenPosition,
  type GrandArchiveBoardMetrics,
} from "./board-renderer";
import { GrandArchiveZoneInspector } from "./GrandArchiveZoneInspector";
import { GrandArchiveRoleCard } from "./GrandArchiveRoleCard";
import { getGrandArchiveCard } from "@tcg/grand-archive-cards";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { GrandArchiveCounters, isGrandArchiveCounter } from "./GrandArchiveCounters";
import { GrandArchiveCombatFlow } from "./GrandArchiveCombatFlow";
import { Button, NativeSelect } from "@mantine/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { grandArchiveConcealedCard } from "@tcg/grand-archive-server-adapter";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import {
  GrandArchivePromptHost,
  useGrandArchiveInteractionWorkspace,
} from "./GrandArchiveInteractionLayer";
import { GrandArchiveBoardControls } from "./GrandArchiveBoardControls";
import { grandArchivePhysicalCards } from "./grand-archive-physical-cards";
import { useGrandArchiveFeedback } from "./useGrandArchiveFeedback";

import { cambriaThemes } from "./assets/themes/cambria/themes";
import "./grand-archive-theme.css";

function boardZone(zoneId: string | undefined): GrandArchiveBoardZone | undefined {
  const zone = zoneId?.split(":").at(-1);
  if (zone === "banishment") return "banished";
  return zone === "field" ||
    zone === "hand" ||
    zone === "memory" ||
    zone === "material-deck" ||
    zone === "main-deck" ||
    zone === "graveyard" ||
    zone === "effects-stack" ||
    zone === "intent"
    ? zone
    : undefined;
}

/** Only viewer-authorized faces enter WebGL; concealed piles use anonymous count slots. */
export function grandArchiveBoardProjection(
  fixture: GrandArchiveHarnessFixture,
): GrandArchiveBoardProjection {
  const self = fixture.table.seats.find((seat) => seat.perspective === "bottom")?.id;
  const zoneByEntityId = new Map(
    fixture.table.zones.flatMap((zone) => zone.entityIds.map((id) => [id, zone] as const)),
  );
  const physical = grandArchivePhysicalCards({
    entities: fixture.entities,
    zones: fixture.table.zones,
  });
  const displayParents = new Map(
    physical.stacks.flatMap((stack) =>
      stack.layerIds.slice(0, -1).map((id, index) => [id, stack.layerIds[index + 1]!] as const),
    ),
  );
  const cards: GrandArchiveBoardCard[] = physical.cards.flatMap((card) => {
    const entity = card.entity;
    if (card.kind === "authoritative" && !zoneByEntityId.has(entity.id)) return [];
    const projectedZone = zoneByEntityId.get(entity.id);
    const hostId =
      typeof entity.dataAttributes?.["data-host-id"] === "string"
        ? entity.dataAttributes["data-host-id"]
        : undefined;
    const zone =
      boardZone(projectedZone?.id) ??
      boardZone(hostId ? zoneByEntityId.get(hostId)?.id : undefined);
    if (!zone) return [];
    // Viewer-visible does not mean physically public: the adapter labels an
    // authorized hand as visible even though its cards naturally face down.
    // These are the engine's private zones supported by this scene; Pantheon
    // is inspection-only and never mapped into the board.
    const privateSurface =
      zone === "hand" || zone === "memory" || zone === "main-deck" || zone === "material-deck";
    const faceDown =
      entity.face !== "public" ||
      (zone === "memory"
        ? entity.dataAttributes?.["data-facing"] !== "face-up"
        : !privateSurface && entity.dataAttributes?.["data-facing"] === "face-down");
    return [
      {
        id: entity.id,
        ...(typeof entity.dataAttributes?.["data-incarnation"] === "number"
          ? { incarnation: entity.dataAttributes["data-incarnation"] }
          : {}),
        owner:
          (projectedZone?.ownerId ??
            (hostId ? zoneByEntityId.get(hostId)?.ownerId : undefined) ??
            entity.ownerId) === self
            ? "self"
            : "opponent",
        zone,
        faceDown,
        ...(!faceDown && entity.imageAspectRatio ? { aspectRatio: entity.imageAspectRatio } : {}),
        ...(!faceDown
          ? { label: entity.title, ...(entity.imageUrl ? { faceUrl: entity.imageUrl } : {}) }
          : {}),
        ...(entity.kind === "leader" ? { role: "champion" as const } : {}),
        rested: entity.states.includes("rested"),
        ...(displayParents.has(entity.id)
          ? { attachedTo: displayParents.get(entity.id)! }
          : hostId
            ? { attachedTo: hostId }
            : {}),
      },
    ];
  });
  for (const projected of fixture.table.zones) {
    const zone = boardZone(projected.id);
    if (!zone) continue;
    const hidden = Math.max(
      0,
      (projected.count ?? projected.entityIds.length) - projected.entityIds.length,
    );
    const count =
      zone === "main-deck" || zone === "material-deck" ? Math.min(3, hidden) : Math.min(20, hidden);
    for (let index = 0; index < count; index++)
      cards.push({
        id: `${projected.id}:concealed:${index}`,
        owner: projected.ownerId === self ? "self" : "opponent",
        zone,
        faceDown: true,
      });
  }
  return { cards };
}

export function GrandArchiveBoard({
  fixture,
  canAct,
  canUndo,
  onUndo,
  feedbackResetKey = 0,
  theme: suppliedTheme,
}: {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly canAct: boolean;
  readonly canUndo?: boolean;
  readonly onUndo?: () => void;
  readonly feedbackResetKey?: string | number;
  readonly theme?: GrandArchiveTheme;
}) {
  const [selectedTheme, setSelectedTheme] = useState<GrandArchiveTheme>(cambriaThemes[0]!);
  const theme = suppliedTheme ?? selectedTheme;
  const workspace = useGrandArchiveInteractionWorkspace();
  const boardAssets = useMemo(
    () => ({ cardBackUrl: grandArchiveConcealedCard("back", "viewer").backImageUrl!, theme }),
    [theme],
  );
  const viewerId = fixture.table.seats.find((seat) => seat.perspective === "bottom")?.id;
  const canvasHost = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<ReadonlyMap<string, GrandArchiveCardScreenPosition>>(
    new Map(),
  );
  const recordMetrics = useCallback((metrics: GrandArchiveBoardMetrics) => {
    if (canvasHost.current) {
      canvasHost.current.dataset.renderMetrics = JSON.stringify(metrics);
    }
  }, []);
  const projection = useMemo(() => grandArchiveBoardProjection(fixture), [fixture]);
  const physical = useMemo(
    () => grandArchivePhysicalCards({ entities: fixture.entities, zones: fixture.table.zones }),
    [fixture],
  );
  const physicalEntities = physical.cards.map((card) => card.entity);
  const displayId = (id: string) => physical.displayEntityIds.get(id) ?? id;
  const candidatesByDisplayId = new Map(workspace.candidateIds.map((id) => [displayId(id), id]));
  const selectedDisplayIds = workspace.selectedIds.map(displayId);
  const overflow = grandArchiveFieldOverflow(projection.cards);
  const [composition, setComposition] = useState<GrandArchiveComposition>();
  const anchorStyles: Record<`--ga-${string}`, string> = {
    "--ga-theme-text": theme.palette.text,
    "--ga-theme-accent": theme.palette.accent,
    "--ga-theme-font": theme.fontFamily,
  };
  if (composition) {
    for (const key of ["action", "undo", "status"] as const) {
      const rect = grandArchiveSlotStyle(composition.slots[key], composition);
      for (const [dimension, value] of Object.entries(rect))
        anchorStyles[`--ga-${key}-${dimension}`] = value;
    }
  }
  const [inspectedCardId, setInspectedCardId] = useState<string>();
  const [hoveredHandCard, setHoveredHandCard] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [assetStatus, setAssetStatus] = useState<{ loading: number; failed: readonly string[] }>({
    loading: 0,
    failed: [],
  });
  const [assetRetryKey, setAssetRetryKey] = useState(0);
  const feedbackSnapshot = useMemo(
    () => ({ table: fixture.table, entities: fixture.entities, eventLog: fixture.eventLog ?? [] }),
    [fixture],
  );
  const feedback = useGrandArchiveFeedback(feedbackSnapshot, `${fixture.id}:${feedbackResetKey}`);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    setInspectedCardId(undefined);
  }, [fixture.table.status.stateVersion, feedbackResetKey, viewerId]);
  const attackSource =
    workspace.attackSourceId ??
    (fixture.combatView?.active ? fixture.combatView.combat.attackerId : undefined);
  const attackTargets = workspace.attackSourceId
    ? workspace.attackTargetIds
    : fixture.combatView?.active
      ? fixture.combatView.combat.targetIds
      : [];
  const pickCard = (id: string) => {
    const entity = physicalEntities.find((entry) => entry.id === id);
    if (!entity) return;
    const candidate = candidatesByDisplayId.get(entity.id);
    if (canAct && candidate) workspace.selectEntity(candidate);
    else if (
      canAct &&
      !workspace.active &&
      entity.ownerId === viewerId &&
      fixture.table.zones.some(
        (zone) => zone.id === `${viewerId}:field` && zone.entityIds.includes(entity.id),
      )
    ) {
      const attack = fixture.interactionView?.actions.find(
        (action) =>
          action.enabled &&
          action.intent === "attack" &&
          action.inputs.some(
            (input) =>
              input.id === "attacker" &&
              input.kind === "entity-selection" &&
              input.candidates.some(
                (entry) =>
                  entry.enabled !== false && displayId(entry.entity.instanceId) === entity.id,
              ),
          ),
      );
      if (attack) {
        const attacker = attack.inputs.find((input) => input.id === "attacker");
        const nativeId =
          attacker && "candidates" in attacker
            ? attacker.candidates.find((entry) => displayId(entry.entity.instanceId) === entity.id)
                ?.entity.instanceId
            : undefined;
        workspace.beginAction(attack.id, nativeId);
      } else setInspectedCardId(entity.id);
    } else if (entity.face === "public") {
      setInspectedCardId(entity.id);
      workspace.previewEntity(undefined);
    }
  };
  const renderControl = (entity: SimulatorEntity) => {
    const position = positions.get(entity.id);
    const card = projection.cards.find((entry) => entry.id === entity.id);
    const concealed = card?.faceDown ?? entity.face !== "public";
    const counters = concealed ? [] : (entity.decorations ?? []).filter(isGrandArchiveCounter);
    return (
      <div
        key={entity.id}
        className="ga-scene-card-control"
        data-entity-id={entity.id}
        data-unpositioned={!position || undefined}
        style={
          position
            ? {
                left: `${position.left}%`,
                top: `${position.top}%`,
                width: `${position.width}%`,
                height: `${position.height}%`,
              }
            : undefined
        }
      >
        <button
          type="button"
          className="ga-scene-card-control__pick"
          aria-label={
            concealed
              ? `Concealed ${card?.zone ?? "card"} card`
              : `${entity.title}, ${entity.kind}, ${entity.ownerId}`
          }
          data-sim-entity-id={entity.id}
          aria-pressed={selectedDisplayIds.includes(entity.id)}
          data-candidate={candidatesByDisplayId.has(entity.id) || undefined}
          onClick={() => pickCard(entity.id)}
          onBlur={() => workspace.previewEntity(undefined)}
        />
        {counters.length ? (
          <GrandArchiveCounters
            title={entity.title}
            counters={counters}
            temporaryDamage={entity.dataAttributes?.["data-damage-lifetime"] === "end-phase"}
            onUnmountFocus={() => canvasHost.current?.focus()}
          />
        ) : null}
        {physical.stacks.some(
          (stack) => stack.hostId === entity.id && stack.layerIds.length > 1,
        ) ? (
          <button
            className="ga-scene-lineage"
            aria-label={`Inspect ${entity.title} lineage`}
            onClick={() => setInspectedCardId(entity.id)}
          >
            Lineage
          </button>
        ) : null}
      </div>
    );
  };
  return (
    <section
      className="ga-three-board ga-themed-board"
      data-theme={theme.id}
      data-composition={composition?.mode}
      style={anchorStyles}
      aria-label="Grand Archive board"
      data-hand-hovered={hoveredHandCard || undefined}
    >
      {!suppliedTheme ? (
        <NativeSelect
          className="ga-theme-picker"
          aria-label="Board theme"
          value={theme.id}
          data={cambriaThemes.map((item) => ({
            value: item.id,
            label: item.id[0]!.toUpperCase() + item.id.slice(1),
          }))}
          onChange={(event) => {
            const next = cambriaThemes.find((item) => item.id === event.currentTarget.value);
            if (next) setSelectedTheme(next);
          }}
        />
      ) : null}
      <div
        ref={canvasHost}
        tabIndex={-1}
        className="ga-three-board__canvas"
        data-testid="grand-archive-three-board"
      >
        {typeof WebGLRenderingContext !== "undefined" ? (
          <GrandArchiveScene
            assets={boardAssets}
            assetRetryKey={assetRetryKey}
            reducedMotion={reducedMotion}
            onAssetStatus={setAssetStatus}
            onLayout={setPositions}
            onComposition={setComposition}
            onMetrics={recordMetrics}
            projection={{
              ...projection,
              candidateCardIds: [...candidatesByDisplayId.keys()],
              selectedCardId: selectedDisplayIds.at(-1),
              feedbackKey: feedback.cues.map((cue) => cue.id).join("|"),
              feedbackCardIds: feedback.cues.flatMap((cue) =>
                "entityId" in cue ? [cue.entityId] : [],
              ),
              resetKey: JSON.stringify([
                fixture.id,
                feedbackResetKey,
                viewerId,
                feedback.generation,
              ]),
              targetLinks: attackSource
                ? attackTargets.map((targetCardId) => ({
                    sourceCardId: attackSource,
                    targetCardId,
                  }))
                : [],
            }}
            events={{
              onCardPick: pickCard,
              onBackgroundPick: () => {
                if (canAct) workspace.finishSelection();
              },
              onCardHover: (id) => {
                setHoveredHandCard(
                  projection.cards.some(
                    (card) => card.id === id && card.owner === "self" && card.zone === "hand",
                  ),
                );
                workspace.previewEntity(
                  physicalEntities.find((entry) => entry.id === id && entry.face === "public"),
                );
              },
            }}
          />
        ) : (
          <p role="status">3D rendering is unavailable. Enable WebGL to view the board.</p>
        )}
      </div>
      <div className="ga-scene-card-controls">
        <div aria-label="Effects stack and intent">
          {physicalEntities
            .filter((entity) =>
              fixture.table.zones.some(
                (zone) =>
                  (zone.id === "effects-stack" || zone.id.endsWith(":intent")) &&
                  zone.entityIds.includes(entity.id),
              ),
            )
            .map(renderControl)}
        </div>
        {fixture.table.seats.map((seat) => {
          const own = seat.id === viewerId;
          const name = own ? "Your" : "Opponent";
          const zones = fixture.table.zones.filter((zone) => zone.ownerId === seat.id);
          const fieldIds = zones.find((zone) => zone.id.endsWith(":field"))?.entityIds ?? [];
          const field = physicalEntities.filter((entity) => fieldIds.includes(entity.id));
          const isAlly = (entity: SimulatorEntity) => {
            const id = entity.dataAttributes?.["data-definition-id"];
            return typeof id === "string" && getGrandArchiveCard(id)?.types.includes("ALLY");
          };
          return (
            <section key={seat.id} aria-label={`${name} arena`}>
              <section aria-label={`${name} champion`}>
                {field.filter((entity) => entity.kind === "leader").map(renderControl)}
              </section>
              <div aria-label={`${name} allies`}>
                {field
                  .filter((entity) => entity.kind !== "leader" && isAlly(entity))
                  .map(renderControl)}
              </div>
              <div aria-label={`${name} other permanents`}>
                {field
                  .filter((entity) => entity.kind !== "leader" && !isAlly(entity))
                  .map(renderControl)}
              </div>
              {["hand", "memory"].map((zoneName) => (
                <div key={zoneName} aria-label={`${name} ${zoneName}`}>
                  {physicalEntities
                    .filter((entity) =>
                      zones
                        .find((zone) => zone.id === `${seat.id}:${zoneName}`)
                        ?.entityIds.includes(entity.id),
                    )
                    .map(renderControl)}
                </div>
              ))}
              <details className="ga-scene-inventory" data-side={seat.perspective}>
                <summary>{name} zones</summary>
                <div className="ga-scene-inventory__body">
                  {zones.map((zone) => (
                    <GrandArchiveZoneInspector
                      key={zone.id}
                      name={zone.id.split(":").at(-1)!}
                      label={
                        zone.id.endsWith(":main-deck")
                          ? "Deck"
                          : zone.id.endsWith(":material-deck")
                            ? "Material"
                            : zone.label.replace(/\b\w/g, (letter) => letter.toUpperCase())
                      }
                      count={zone.count ?? zone.entityIds.length}
                      entities={zone.entityIds.flatMap((id) => {
                        const entity = physicalEntities.find((entry) => entry.id === id);
                        return entity ? [entity] : [];
                      })}
                      renderCard={(entity) => (
                        <GrandArchiveRoleCard
                          key={entity.id}
                          entity={entity}
                          density="compact"
                          onClick={() => pickCard(entity.id)}
                        />
                      )}
                    />
                  ))}
                </div>
              </details>
            </section>
          );
        })}
      </div>
      <div className="ga-portrait-captions" aria-hidden="true">
        {physicalEntities
          .filter((entity) => entity.face === "public" && positions.has(entity.id))
          .map((entity) => {
            const position = positions.get(entity.id)!;
            const selected = selectedDisplayIds.includes(entity.id);
            const target = candidatesByDisplayId.has(entity.id);
            const field = fixture.table.zones.some(
              (zone) => zone.id.endsWith(":field") && zone.entityIds.includes(entity.id),
            );
            if (!field && !selected && !target) return null;
            return (
              <div
                key={entity.id}
                className="ga-portrait-caption"
                data-champion={entity.kind === "leader" || undefined}
                data-self-champion={
                  (entity.kind === "leader" && entity.ownerId === viewerId) || undefined
                }
                data-selected={selected || undefined}
                data-target={target || undefined}
                style={{
                  left: `${position.left}%`,
                  top: `${position.top + position.height / 2}%`,
                  width: `${position.width + 1.8}%`,
                }}
              >
                <strong>
                  {selected ? "✓ " : target ? "◇ " : ""}
                  {entity.title}
                </strong>
                <span className="ga-portrait-stats">
                  {entity.stats
                    .filter(
                      (stat) =>
                        !(entity.decorations ?? []).some(
                          (decoration) =>
                            isGrandArchiveCounter(decoration) &&
                            decoration.id.endsWith(
                              `:${stat.label
                                .toLowerCase()
                                .replace(/ counters?$/, "")
                                .replaceAll(" ", "-")}`,
                            ),
                        ),
                    )
                    .map((stat) => (
                      <span key={stat.label}>
                        <small>{stat.label}</small> <b>{stat.value}</b>
                      </span>
                    ))}
                </span>
              </div>
            );
          })}
      </div>
      {fixture.table.seats.map((seat) => (
        <div key={seat.id} className="ga-portrait-identity" data-side={seat.perspective}>
          <strong>
            {seat.perspective === "bottom"
              ? "You"
              : /^p\d+$/i.test(seat.label)
                ? "Opponent"
                : seat.label}
          </strong>
          <small>
            {seat.connectionStatus === "offline"
              ? "Offline"
              : fixture.turnPlayerId === seat.id
                ? "Active turn"
                : ""}
          </small>
          <span
            className="ga-portrait-player-values"
            data-has-player-state={seat.counters.length > 2 || undefined}
          >
            {seat.counters.map((counter) => `${counter.label} ${counter.value}`).join(" · ")}
          </span>
        </div>
      ))}
      {composition
        ? fixture.table.seats.map((seat) => {
            const memory = fixture.table.zones.find(
              (zone) => zone.ownerId === seat.id && zone.id.endsWith(":memory"),
            );
            const deck = fixture.table.zones.find(
              (zone) => zone.ownerId === seat.id && zone.id.endsWith(":main-deck"),
            );
            const own = seat.perspective === "bottom";
            return (
              <div
                key={`rail-${seat.id}`}
                className="ga-theme-readouts"
                data-side={seat.perspective}
              >
                <div
                  className="ga-theme-memory"
                  style={grandArchiveSlotStyle(
                    own ? composition.slots.selfMemory : composition.slots.opponentMemory,
                    composition,
                  )}
                  aria-label={`${seat.label} memory`}
                >
                  <span>
                    <strong>{memory?.count ?? memory?.entityIds.length ?? 0}</strong>
                    <small>Memory</small>
                  </span>
                </div>
                <div
                  className="ga-theme-deck"
                  style={grandArchiveSlotStyle(
                    own ? composition.slots.selfDeck : composition.slots.opponentDeck,
                    composition,
                  )}
                  aria-label={`${seat.label} main deck`}
                >
                  <span>
                    {deck?.count ?? deck?.entityIds.length ?? 0}
                    <small>Deck</small>
                  </span>
                </div>
              </div>
            );
          })
        : null}
      <div className="ga-portrait-hud">
        <GrandArchiveCombatFlow fixture={fixture} />
        <GrandArchivePromptHost />
        <div className="ga-scene-seat-choices">
          {fixture.table.seats
            .filter((seat) => workspace.candidateIds.includes(seat.id))
            .map((seat) => (
              <Button
                key={seat.id}
                disabled={!canAct}
                onClick={() => workspace.selectEntity(seat.id)}
              >
                Select {seat.id === viewerId ? "You" : seat.label}
              </Button>
            ))}
        </div>
        {overflow.self + overflow.opponent > 0 ? (
          <small className="ga-portrait-overflow">
            Additional field cards: yours {overflow.self}, opponent {overflow.opponent}. Use Cards
            and zones.
          </small>
        ) : null}
        <GrandArchiveBoardControls
          fixture={fixture}
          canAct={canAct}
          canUndo={canUndo}
          onUndo={onUndo}
          inspectedEntityId={inspectedCardId}
          onInspectClose={() => setInspectedCardId(undefined)}
          onInspectEntity={setInspectedCardId}
        />
        <div className="ga-portrait-feedback-panel">
          <div className="ga-portrait-feedback" role="status" aria-live="polite">
            {feedback.cues.slice(-2).map((cue) => (
              <span key={cue.id}>{cue.label}</span>
            ))}
          </div>
          {feedback.history.length > 0 ? (
            <details className="ga-feedback-history">
              <summary>Action feedback · {feedback.history.length}</summary>
              <ol>
                {feedback.history.map((cue) => (
                  <li key={cue.id}>{cue.label}</li>
                ))}
              </ol>
            </details>
          ) : null}
        </div>
      </div>
      {assetStatus.loading > 0 || assetStatus.failed.length > 0 ? (
        <div className="ga-portrait-assets" role="status">
          {assetStatus.failed.length > 0 ? (
            <>
              <span>{assetStatus.failed.length} card/table image(s) unavailable</span>
              <Button size="compact-xs" onClick={() => setAssetRetryKey((key) => key + 1)}>
                Retry images
              </Button>
            </>
          ) : (
            `Loading ${assetStatus.loading} images…`
          )}
        </div>
      ) : null}
    </section>
  );
}
