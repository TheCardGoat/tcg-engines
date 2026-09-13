import { Button, Group, Menu } from "@mantine/core";
import type { InteractionSubmission } from "@tcg/protocol";
import type {
  CardInteractionMode,
  SimulatorCardAction,
  SimulatorEntity,
  SimulatorZone,
} from "@tcg/simulator-contract";
import {
  CardContextMenuController,
  HandZone,
  SimulatorViewportRailPortal,
  useSimulatorViewportLayout,
} from "@tcg/simulator-ui";
import { CornerDownLeft, Undo2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { grandArchiveConcealedCard } from "@tcg/grand-archive-server-adapter";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import { GrandArchivePlayerTable } from "./GrandArchivePlayerTable";
import { GrandArchiveEffectsStack } from "./GrandArchiveEffectsStack";
import { GrandArchiveCombatWorkspace } from "./GrandArchiveCombatWorkspace";
import { useGrandArchiveInteractionWorkspace } from "./GrandArchiveInteractionLayer";
import { grandArchiveEntityWithPrintedDetails } from "./GrandArchiveCardPreview";

interface GrandArchiveHandsProps {
  onSubmitProtocolInteraction?: (submission: InteractionSubmission) => boolean;
  fixture: GrandArchiveHarnessFixture;
  canUndo?: boolean;
  onUndo?: () => void;
}

/** The state-version key discards drafts and previews after every authoritative move. */
export function GrandArchiveHands(props: GrandArchiveHandsProps) {
  const [combatCollapsed, setCombatCollapsed] = useState(false);
  const [mode, setMode] = useState<CardInteractionMode>("quick");
  const viewer = props.fixture.table.seats.find((seat) => seat.perspective === "bottom");
  return (
    <GrandArchiveHandsState
      key={`${viewer?.id}:${props.fixture.id}:${props.fixture.table.status.stateVersion}`}
      {...props}
      mode={mode}
      onModeChange={setMode}
      combatCollapsed={combatCollapsed}
      onCombatCollapsedChange={setCombatCollapsed}
    />
  );
}

function GrandArchiveHandsState({
  fixture,
  onSubmitProtocolInteraction,
  canUndo,
  onUndo,
  mode,
  onModeChange,
  combatCollapsed,
  onCombatCollapsedChange,
}: GrandArchiveHandsProps & {
  combatCollapsed: boolean;
  onCombatCollapsedChange: (value: boolean) => void;
  mode: CardInteractionMode;
  onModeChange: (mode: CardInteractionMode) => void;
}) {
  const layout = useSimulatorViewportLayout();
  const workspace = useGrandArchiveInteractionWorkspace();
  const view = fixture.interactionView;
  const self = fixture.table.seats.find((seat) => seat.perspective === "bottom");
  const opponent = fixture.table.seats.find((seat) => seat.perspective === "top");
  const handFor = (ownerId: string | undefined) =>
    fixture.table.zones.find((zone) => zone.role === "hand" && zone.ownerId === ownerId);
  const selfHand = handFor(self?.id);
  const opponentHand = handFor(opponent?.id);
  const materialDeck = fixture.table.zones.find((zone) => zone.id === `${self?.id}:material-deck`);
  const isMaterializing =
    fixture.waitState.kind === "materialization-choice" &&
    fixture.waitState.playerId === self?.id &&
    Boolean(materialDeck);
  const [inspectHand, setInspectHand] = useState(false);
  const entities = useMemo(
    () => fixture.entities.map(grandArchiveEntityWithPrintedDetails),
    [fixture.entities],
  );
  const actions: SimulatorCardAction[] = fixture.interactions.flatMap((interaction, order) =>
    interaction.sourceEntityId
      ? [
          {
            id: interaction.id,
            sourceEntityId: interaction.sourceEntityId,
            label: interaction.label,
            order,
            activation: interaction.input.kind === "action" ? "execute" : "begin-selection",
            availability:
              onSubmitProtocolInteraction &&
              view?.actions.some((action) => action.id === interaction.id && action.enabled)
                ? { kind: "enabled" }
                : { kind: "disabled", reason: "This board is read-only." },
          },
        ]
      : [],
  );
  const decision = workspace.active;
  const selectedIds = workspace.selectedIds;
  const candidateIds = workspace.candidateIds;
  // Bring the actual hand back when a materialization cost asks for its cards.
  const needsHand = decision && candidateIds.some((id) => selfHand?.entityIds.includes(id));
  const showingMaterial = isMaterializing && !inspectHand && !needsHand;
  const activeHand = showingMaterial ? materialDeck : selfHand;
  const pass = fixture.interactions.find(
    (interaction) =>
      (interaction.movePreview.command === "pass" ||
        interaction.movePreview.command === "skip-materialization") &&
      interaction.input.kind === "action" &&
      view?.actions.some((action) => action.id === interaction.id && action.enabled),
  );
  const boardActions = fixture.interactions.filter(
    (interaction) =>
      fixture.waitState.kind !== "pregame-action" &&
      interaction.movePreview.command !== "pass" &&
      interaction.movePreview.command !== "skip-materialization" &&
      interaction.movePreview.command !== "concede" &&
      !(
        isMaterializing &&
        interaction.sourceEntityId &&
        materialDeck?.entityIds.includes(interaction.sourceEntityId)
      ) &&
      (!interaction.sourceEntityId || !selfHand?.entityIds.includes(interaction.sourceEntityId)) &&
      view?.actions.some((action) => action.id === interaction.id && action.enabled),
  );
  const canPass = Boolean(pass && onSubmitProtocolInteraction && !decision);
  const submitPass = () => {
    if (canPass && pass) workspace.beginAction(pass.id);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.defaultPrevented || !(event.target instanceof HTMLElement)) return;
      if (
        event.target.closest(
          'button, input, textarea, select, [contenteditable="true"], [role="dialog"], [role="menu"]',
        )
      )
        return;
      if (decision || document.querySelector('[role="dialog"], [role="alertdialog"]')) return;
      if (event.code === "Space" && !event.ctrlKey && !event.metaKey && !event.altKey && canPass) {
        event.preventDefault();
        submitPass();
      }
      if (
        event.key.toLowerCase() === "z" &&
        (event.ctrlKey || event.metaKey) &&
        !event.shiftKey &&
        canUndo
      ) {
        event.preventDefault();
        onUndo?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const activate = (action: SimulatorCardAction) => {
    if (!onSubmitProtocolInteraction || action.availability.kind !== "enabled") return;
    workspace.beginAction(action.id);
  };
  const toggle = workspace.selectEntity;
  const stackZone = fixture.table.zones.find((zone) => zone.id === "effects-stack");

  const handControls = (
    <div
      className={`ga-hand-controls${layout === "mobile" ? " ga-mobile-hand-controls" : ""}`}
      role="group"
      aria-label="Hand actions"
    >
      <button
        type="button"
        disabled={!canUndo || !onUndo || Boolean(decision)}
        onClick={onUndo}
        title="Undo (Ctrl/⌘ Z)"
        aria-label="Undo"
      >
        <Undo2 size={16} aria-hidden="true" />
        <span className="ga-undo-label">Undo</span>
      </button>
      <button
        type="button"
        className="ga-hand-pass"
        disabled={!canPass}
        onClick={submitPass}
        aria-label={isMaterializing ? "Skip materialization" : undefined}
        title={isMaterializing ? "Skip materialization (Space)" : "Pass Opportunity (Space)"}
      >
        <CornerDownLeft size={18} aria-hidden="true" />
        Pass<kbd>Space</kbd>
      </button>
    </div>
  );

  return (
    <CardContextMenuController
      className="ga-hand-controller"
      entities={entities}
      actionsForEntity={(id) => actions.filter((action) => action.sourceEntityId === id)}
      mode={mode}
      onModeChange={onModeChange}
      stateVersion={fixture.table.status.stateVersion}
      promptActive={Boolean(decision)}
      autoActivateSingleEnabledAction
      onAction={activate}
    >
      <div className="ga-hand-board" data-materializing={isMaterializing || undefined}>
        {opponentHand && (
          <GrandArchiveHand
            zone={opponentHand}
            entities={entities}
            side="top"
            decision={decision}
            candidateIds={candidateIds}
            selectedIds={selectedIds}
            selectedOrder={workspace.selectedOrder}
            onSelect={toggle}
            onPreview={workspace.previewEntity}
          />
        )}
        {opponent ? (
          <GrandArchivePlayerTable
            zones={fixture.table.zones}
            entities={entities}
            seat={opponent}
            side="top"
            turnPlayerId={fixture.turnPlayerId}
            waitState={fixture.waitState}
          />
        ) : null}
        <GrandArchiveCombatWorkspace
          collapsed={combatCollapsed}
          onCollapsedChange={onCombatCollapsedChange}
          view={fixture.combatView}
          seats={fixture.table.seats}
          entities={entities}
          candidateIds={candidateIds}
          selectedIds={selectedIds}
          selectedOrder={workspace.selectedOrder}
          onSelect={toggle}
          onPreview={workspace.previewEntity}
        />
        <GrandArchiveEffectsStack
          viewerId={self?.id}
          zone={stackZone}
          entities={entities}
          candidateIds={candidateIds}
          selectedIds={selectedIds}
          selectedOrder={workspace.selectedOrder}
          onSelect={toggle}
          onPreview={workspace.previewEntity}
        />
        {self ? (
          <GrandArchivePlayerTable
            zones={fixture.table.zones}
            entities={entities}
            seat={self}
            side="bottom"
            turnPlayerId={fixture.turnPlayerId}
            waitState={fixture.waitState}
          />
        ) : null}
        <div className="ga-player-hand-section">
          <div className="ga-player-hand-main">
            {isMaterializing && materialDeck ? (
              <Group className="ga-material-hand-header" justify="space-between" gap="xs">
                <strong>{showingMaterial ? "Choose a card to materialize" : "Your hand"}</strong>
                <Group gap="xs" role="group" aria-label="Cards to inspect">
                  <Button
                    size="compact-sm"
                    variant={showingMaterial ? "light" : "subtle"}
                    color={showingMaterial ? "yellow" : "gray"}
                    aria-pressed={showingMaterial}
                    disabled={needsHand}
                    onClick={() => {
                      setInspectHand(false);
                      workspace.previewEntity(undefined);
                    }}
                  >
                    Material deck · {materialDeck.count ?? materialDeck.entityIds.length}
                  </Button>
                  <Button
                    size="compact-sm"
                    variant={showingMaterial ? "subtle" : "light"}
                    color={showingMaterial ? "gray" : "yellow"}
                    aria-pressed={!showingMaterial}
                    onClick={() => {
                      setInspectHand(true);
                      workspace.previewEntity(undefined);
                    }}
                  >
                    Hand · {selfHand?.count ?? selfHand?.entityIds.length ?? 0}
                  </Button>
                </Group>
              </Group>
            ) : null}
            {boardActions.length > 0 ? (
              <Group gap="xs" justify="center" role="group" aria-label="Game actions">
                {boardActions
                  .filter((action) => !action.sourceEntityId)
                  .map((action) => (
                    <Button
                      key={action.id}
                      size="compact-sm"
                      disabled={!onSubmitProtocolInteraction || decision}
                      onClick={() => workspace.beginAction(action.id)}
                    >
                      {action.label}
                    </Button>
                  ))}
                {boardActions.some((action) => action.sourceEntityId) ? (
                  <Menu position="top" withinPortal>
                    <Menu.Target>
                      <Button
                        size="compact-sm"
                        variant="default"
                        disabled={!onSubmitProtocolInteraction || decision}
                      >
                        {isMaterializing ? "Board actions" : "Board and material actions"}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown mah="50vh" style={{ overflowY: "auto" }}>
                      {boardActions
                        .filter((action) => action.sourceEntityId)
                        .map((action) => (
                          <Menu.Item
                            key={action.id}
                            onClick={() => workspace.beginAction(action.id)}
                          >
                            {action.label}
                          </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                  </Menu>
                ) : null}
              </Group>
            ) : null}
            {activeHand && (
              <GrandArchiveHand
                key={activeHand.id}
                zone={activeHand}
                material={showingMaterial}
                entities={entities}
                side="bottom"
                actions={actions}
                decision={decision}
                candidateIds={candidateIds}
                selectedIds={selectedIds}
                selectedOrder={workspace.selectedOrder}
                onSelect={toggle}
                onPreview={workspace.previewEntity}
              />
            )}
          </div>
          {layout === "mobile" ? (
            <SimulatorViewportRailPortal position="bottom">
              {handControls}
            </SimulatorViewportRailPortal>
          ) : (
            handControls
          )}
        </div>
      </div>
    </CardContextMenuController>
  );
}

function GrandArchiveHand({
  zone,
  entities,
  side,
  actions = [],
  decision,
  candidateIds = [],
  selectedIds = [],
  selectedOrder = new Map(),
  onSelect,
  onPreview,
  material = false,
}: {
  zone: SimulatorZone;
  entities: SimulatorEntity[];
  side: "top" | "bottom";
  actions?: SimulatorCardAction[];
  decision?: boolean;
  candidateIds?: readonly string[];
  selectedIds?: readonly string[];
  selectedOrder?: ReadonlyMap<string, number>;
  onSelect?: (id: string) => void;
  onPreview?: (entity: SimulatorEntity | undefined) => void;
  material?: boolean;
}) {
  const handRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const hand = handRef.current;
    if (!hand) return;
    const scrollHand = (event: WheelEvent) => {
      // Leave horizontal trackpad gestures, Shift-wheel and pinch zoom native.
      if (event.defaultPrevented || event.ctrlKey || event.shiftKey || event.deltaX !== 0) return;
      // Short viewports can clip either hand region. Let native vertical scrolling
      // reveal that content before translating the wheel into horizontal movement.
      const verticalRegions = [hand, hand.closest<HTMLElement>(".ga-player-hand-section")];
      if (
        verticalRegions.some((region) => {
          if (!region || !["auto", "scroll"].includes(getComputedStyle(region).overflowY)) {
            return false;
          }
          return event.deltaY < 0
            ? region.scrollTop > 0
            : event.deltaY > 0 && region.scrollTop + region.clientHeight < region.scrollHeight;
        })
      ) {
        return;
      }
      const delta =
        event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? hand.clientWidth : 1);
      const next = Math.max(
        0,
        Math.min(hand.scrollWidth - hand.clientWidth, hand.scrollLeft + delta),
      );
      if (next === hand.scrollLeft) return;
      event.preventDefault();
      hand.scrollLeft = next;
    };
    hand.addEventListener("wheel", scrollHand, { passive: false });
    return () => hand.removeEventListener("wheel", scrollHand);
  }, []);
  const visible = entities.filter((entity) => zone.entityIds.includes(entity.id));
  const count = zone.count ?? zone.entityIds.length;
  const hiddenCount = Math.max(0, count - visible.length);
  const cards: SimulatorEntity[] = [
    ...visible,
    ...Array.from({ length: hiddenCount }, (_, index) =>
      grandArchiveConcealedCard(`${zone.id}:concealed:${index}`, zone.ownerId ?? "hidden"),
    ),
  ];
  return (
    <section
      ref={handRef}
      className="ga-hand"
      data-side={side}
      data-material={material || undefined}
      aria-label={`${material ? "Your material deck" : side === "bottom" ? "Your hand" : "Opponent hand"}, ${count} cards`}
      onPointerOver={(event) => {
        if (event.pointerType === "touch") return;
        const id =
          event.target instanceof Element
            ? event.target.closest<HTMLElement>("[data-sim-entity-id]")?.dataset.simEntityId
            : undefined;
        onPreview?.(visible.find((entity) => entity.id === id));
      }}
      onPointerLeave={() => onPreview?.(undefined)}
      onFocusCapture={(event) =>
        onPreview?.(
          visible.find(
            (entity) =>
              entity.id ===
              event.target.closest<HTMLElement>("[data-sim-entity-id]")?.dataset.simEntityId,
          ),
        )
      }
      onBlurCapture={() => onPreview?.(undefined)}
    >
      {cards.length > 0 && (
        <HandZone
          entities={cards}
          zone={zone}
          fanStyle="shallow"
          density="compact"
          selectionOrder={selectedOrder}
          interactionStateFor={(entity) => {
            if (selectedIds.includes(entity.id)) return { kind: "selected", actionCount: 1 };
            if (candidateIds.includes(entity.id)) return { kind: "targetable" };
            const count = actions.filter(
              (action) =>
                action.sourceEntityId === entity.id && action.availability.kind === "enabled",
            ).length;
            return count && !decision
              ? { kind: "actionable", actionCount: count }
              : { kind: "idle" };
          }}
          onSelect={decision ? (entity) => onSelect?.(entity.id) : undefined}
        />
      )}
      {count === 0 && (
        <span className="ga-empty-hand">
          {material ? "No cards in your material deck" : "No cards in hand"}
        </span>
      )}
    </section>
  );
}
