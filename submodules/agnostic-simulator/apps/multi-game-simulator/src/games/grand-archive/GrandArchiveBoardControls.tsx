import { Button, Group, Modal, Stack, Text, Tooltip } from "@mantine/core";
import { RotateCcw } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { CardFace } from "@tcg/simulator-ui";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import {
  grandArchiveEntityWithPrintedDetails,
  useGrandArchiveCardPreview,
} from "./GrandArchiveCardPreview";
import { grandArchiveActionLabel } from "./GrandArchiveCardActions";
import { useGrandArchiveInteractionWorkspace } from "./GrandArchiveInteractionLayer";
import { GrandArchiveRoleCard } from "./GrandArchiveRoleCard";
import { grandArchivePhysicalCards } from "./grand-archive-physical-cards";
import "./grand-archive-board-controls.css";

/** DOM access to the same authoritative choices used by the spatial board. */
export function GrandArchiveBoardControls({
  fixture,
  canAct,
  canUndo,
  onUndo,
  inspectedEntityId,
  onInspectClose,
  onInspectEntity,
  showStatus = true,
}: {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly canAct: boolean;
  readonly canUndo?: boolean;
  readonly onUndo?: () => void;
  readonly inspectedEntityId?: string;
  readonly onInspectClose?: () => void;
  readonly onInspectEntity?: (id: string) => void;
  readonly showStatus?: boolean;
}) {
  const workspace = useGrandArchiveInteractionWorkspace();
  const physical = useMemo(
    () => grandArchivePhysicalCards({ entities: fixture.entities, zones: fixture.table.zones }),
    [fixture.entities, fixture.table.zones],
  );
  const physicalById = new Map(physical.cards.map((card) => [card.entity.id, card]));
  const preview = useGrandArchiveCardPreview();
  const hidePreview = useRef(preview.hide);
  hidePreview.current = preview.hide;
  const inspectClose = useRef(onInspectClose);
  inspectClose.current = onInspectClose;
  const closeInspection = () => {
    inspectClose.current?.();
  };
  const inspectionId = inspectedEntityId;
  const inspectionEntity = inspectionId
    ? (physicalById.get(inspectionId)?.entity ??
      fixture.entities.find((entity) => entity.id === inspectionId))
    : undefined;
  const inspected = inspectionEntity?.face === "public" ? inspectionEntity : undefined;
  const lineage = inspected
    ? (physical.stacks
        .find((stack) => stack.hostId === inspected.id)
        ?.layerIds.flatMap((id) => {
          const entity = physicalById.get(id)?.entity;
          return entity && id !== inspected.id ? [entity] : [];
        }) ?? [])
    : [];
  const actions = fixture.interactions.filter((interaction) =>
    fixture.interactionView?.actions.some(
      (action) => action.id === interaction.id && action.enabled,
    ),
  );
  const primary = actions.find(
    (action) =>
      action.movePreview.command === "pass" ||
      action.movePreview.command === "skip-materialization",
  );
  const primaryLabel =
    primary?.movePreview.command === "skip-materialization"
      ? "Skip materialization"
      : "Pass Opportunity";
  const canPass = canAct && !workspace.active && Boolean(primary);
  const waitingPlayerId = "playerId" in fixture.waitState ? fixture.waitState.playerId : undefined;
  const waitingPlayer = fixture.table.seats.find((seat) => seat.id === waitingPlayerId);
  const self = fixture.table.seats.find((seat) => seat.perspective === "bottom");
  const status =
    fixture.waitState.kind === "game-over"
      ? "Match complete"
      : fixture.waitState.kind === "resolving"
        ? "Resolving effects"
        : waitingPlayer?.id === self?.id
          ? "Your choice"
          : waitingPlayer
            ? `${waitingPlayer.label} choosing`
            : fixture.table.status.phase;

  useLayoutEffect(() => {
    hidePreview.current();
    inspectClose.current?.();
  }, [fixture.id, fixture.table.status.stateVersion, self?.id]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        inspected ||
        document.querySelector(
          '[role="dialog"]:not([data-ga-overlay="card-preview"]), [role="alertdialog"], [role="menu"]',
        )
      )
        return;
      if (
        event.target instanceof Element &&
        event.target.closest('button, input, textarea, select, a, [contenteditable="true"]')
      )
        return;
      if (
        event.code === "Space" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !event.shiftKey &&
        canPass &&
        primary
      ) {
        event.preventDefault();
        workspace.beginAction(primary.id);
      }
      if (
        (event.ctrlKey || event.metaKey) &&
        !event.shiftKey &&
        !event.altKey &&
        event.key.toLowerCase() === "z" &&
        canUndo &&
        onUndo &&
        !workspace.active
      ) {
        event.preventDefault();
        onUndo();
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [inspected, canPass, primary, workspace, canUndo, onUndo]);

  const undoReason = workspace.active
    ? "Finish or cancel the current action before undoing."
    : !canUndo
      ? "No undoable move available."
      : undefined;

  const begin = (id: string, sourceId?: string) => {
    closeInspection();
    workspace.beginAction(id, sourceId);
  };
  const entityActions = (entity: SimulatorEntity) =>
    entity.face === "public" && physicalById.get(entity.id)?.kind !== "inspection-only"
      ? actions.filter((interaction) => {
          if (interaction.sourceEntityId === entity.id) return true;
          const action = fixture.interactionView?.actions.find(
            (entry) => entry.id === interaction.id,
          );
          return (
            action?.intent === "attack" &&
            action.inputs.some(
              (input) =>
                input.id === "attacker" &&
                input.kind === "entity-selection" &&
                input.candidates.some(
                  (candidate) =>
                    candidate.enabled !== false && candidate.entity.instanceId === entity.id,
                ),
            )
          );
        })
      : [];
  const entityActionLabel = (
    action: GrandArchiveHarnessFixture["interactions"][number],
    entity: SimulatorEntity,
  ) =>
    fixture.interactionView?.actions.find((entry) => entry.id === action.id)?.intent === "attack"
      ? `${grandArchiveActionLabel("attack")} with ${entity.title}`
      : action.label;

  return (
    <div className="ga-board-controls">
      {showStatus ? (
        <div className="ga-board-controls__status" role="status">
          {canAct ? status : "Inspect cards and counters"}
        </div>
      ) : null}
      <Group className="ga-board-controls__buttons" justify="center" gap="xs" wrap="wrap">
        {onUndo ? (
          <Tooltip
            label={undoReason ?? "Undo (Ctrl/⌘ Z)"}
            withArrow
            events={{ hover: true, focus: true, touch: true }}
          >
            <span
              className="ga-table-control ga-table-control--undo ga-undo-slot"
              role={undoReason ? "group" : undefined}
              aria-label={undoReason ? "Undo unavailable" : undefined}
              tabIndex={undoReason ? 0 : undefined}
            >
              <Button
                size="compact-sm"
                mih={44}
                variant="subtle"
                disabled={!canUndo || workspace.active}
                className="ga-undo-button"
                aria-label={undoReason ? `Undo unavailable. ${undoReason}` : "Undo"}
                title={undoReason ?? "Undo (Ctrl/⌘ Z)"}
                onClick={onUndo}
              >
                <RotateCcw size={18} aria-hidden="true" />
                <span className="ga-control-label">Undo</span>
              </Button>
            </span>
          </Tooltip>
        ) : null}
        {primary ? (
          <Button
            size="compact-sm"
            mih={44}
            disabled={!canPass}
            className="ga-table-control ga-table-control--turn"
            title={`${primaryLabel} (Space)`}
            onClick={() => begin(primary.id)}
          >
            {primaryLabel}
          </Button>
        ) : null}
      </Group>
      <Modal
        closeButtonProps={{ "aria-label": "Close card inspection" }}
        opened={Boolean(inspected)}
        onClose={closeInspection}
        title={inspected?.title ?? "Card inspection"}
        size="sm"
        centered
      >
        {inspected ? (
          <Stack gap="sm">
            {!workspace.active ? (
              <Group gap="xs" aria-label="Inspected card actions">
                {entityActions(inspected).map((action) => (
                  <Button
                    key={action.id}
                    size="compact-sm"
                    mih={44}
                    disabled={!canAct}
                    onClick={() => begin(action.id, inspected.id)}
                  >
                    {entityActionLabel(action, inspected)}
                  </Button>
                ))}
              </Group>
            ) : null}
            {lineage.length ? (
              <div
                role="group"
                aria-label={`${inspected.title} lineage`}
                className="ga-sandbox-pile-cards"
              >
                {lineage.map((entity) =>
                  entity.face === "public" ? (
                    <GrandArchiveRoleCard
                      key={entity.id}
                      entity={entity}
                      density="compact"
                      onClick={() => onInspectEntity?.(entity.id)}
                      onHoverEnter={() => preview.show(entity)}
                      onHoverLeave={() => preview.hide()}
                    />
                  ) : (
                    <GrandArchiveRoleCard
                      key={entity.id}
                      entity={entity}
                      as="div"
                      density="compact"
                    />
                  ),
                )}
              </div>
            ) : null}
            <div className="ga-board-controls__inspection">
              <CardFace
                crossOrigin="anonymous"
                as="div"
                entity={grandArchiveEntityWithPrintedDetails({
                  ...inspected,
                  ...(typeof inspected.dataAttributes?.["data-ga-printed-image-url"] === "string"
                    ? {
                        imageUrl: inspected.dataAttributes["data-ga-printed-image-url"],
                        imageAspectRatio:
                          typeof inspected.dataAttributes["data-ga-printed-image-aspect-ratio"] ===
                          "number"
                            ? inspected.dataAttributes["data-ga-printed-image-aspect-ratio"]
                            : inspected.imageAspectRatio,
                      }
                    : {}),
                  decorations: [],
                })}
                density="full"
                fill
                fullImageFit="contain"
              />
            </div>
            <Text size="sm">
              {grandArchiveEntityWithPrintedDetails(inspected)
                .details?.rules.map((rule) => rule.text ?? rule.label ?? "")
                .join("\n")}
            </Text>
          </Stack>
        ) : null}
      </Modal>
    </div>
  );
}
