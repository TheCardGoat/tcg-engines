import type { GrandArchiveViewerState } from "@tcg/grand-archive-engine/simulator";

export interface GrandArchiveStackPresentation {
  readonly count: number;
  /** First to resolve first; independent from physical bottom-to-top zone order. */
  readonly items: readonly GrandArchiveStackEffectPresentation[];
  readonly currentItemId: string | null;
  readonly nextItemId: string | null;
  readonly opportunityHolderId: string | null;
}

export interface GrandArchiveStackEffectPresentation {
  readonly id: string;
  readonly controllerId: string;
  readonly kind: GrandArchiveViewerState["stack"][number]["kind"];
  readonly name: string;
  /** Null means no authored executable text exists; never substitutes unrelated card text. */
  readonly effectText: string | null;
  readonly sourceEntityId: string | null;
  readonly state: "queued" | "awaiting-opportunity" | "resolving" | "waiting-for-decision";
  readonly negated: boolean;
  readonly selectedModeIds: readonly string[];
  readonly targets: readonly {
    readonly binding: string;
    readonly required: boolean;
    readonly references: readonly (
      | {
          readonly kind: "card" | "player" | "effect";
          readonly entityId: string;
          readonly name: string;
        }
      | { readonly kind: "concealed" }
    )[];
  }[];
  readonly currentStep: NonNullable<GrandArchiveViewerState["stackResolution"]>["decision"];
}

/** Only viewer-authorized identities are named. No engine objects or interaction drafts enter here. */
export function projectGrandArchiveStackPresentation(
  viewer: GrandArchiveViewerState,
): GrandArchiveStackPresentation {
  const visibleObjects = viewer.players.flatMap((player) =>
    Object.values(player.zones).flatMap((zone) =>
      zone.visibility === "visible" ? zone.objects : zone.revealedObjects,
    ),
  );
  const objects = new Map(visibleObjects.map((object) => [String(object.id), object]));
  const players = new Map(viewer.players.map((player) => [String(player.id), player]));
  const stack = new Map(viewer.stack.map((item) => [String(item.id), item]));
  const currentItemId =
    viewer.stackResolution && stack.has(viewer.stackResolution.stackItemId)
      ? viewer.stackResolution.stackItemId
      : null;
  const ordered = [...viewer.stack].reverse();
  const nextItemId = ordered.find((item) => item.id !== currentItemId)?.id ?? null;
  return {
    count: viewer.stack.length,
    currentItemId,
    nextItemId,
    opportunityHolderId: viewer.opportunityHolderId,
    items: ordered.map((item): GrandArchiveStackEffectPresentation => {
      const current = item.id === currentItemId;
      const sourceId = "cardId" in item ? item.cardId : item.sourceId;
      return {
        id: item.id,
        controllerId: item.controllerId,
        kind: item.kind,
        name:
          item.presentation?.name ?? item.masterySource?.name ?? item.gameSource?.name ?? "Effect",
        effectText: item.presentation?.effectText ?? null,
        sourceEntityId: sourceId && objects.has(sourceId) ? sourceId : null,
        state: current
          ? viewer.stackResolution?.decision
            ? "waiting-for-decision"
            : "resolving"
          : item.id === nextItemId && viewer.opportunityHolderId && !currentItemId
            ? "awaiting-opportunity"
            : "queued",
        negated: item.negated,
        selectedModeIds: item.selectedModeIds,
        targets: item.targets.map((target) => ({
          binding: target.binding,
          required: target.required,
          references: target.targetIds.map((id) => {
            const object = objects.get(id);
            if (object) return { kind: "card" as const, entityId: object.id, name: object.name };
            const player = players.get(id);
            if (player) return { kind: "player" as const, entityId: player.id, name: player.name };
            const effect = stack.get(id);
            if (effect)
              return {
                kind: "effect" as const,
                entityId: effect.id,
                name: effect.presentation?.name ?? "Effect",
              };
            return { kind: "concealed" as const };
          }),
        })),
        currentStep: current ? (viewer.stackResolution?.decision ?? null) : null,
      };
    }),
  };
}
