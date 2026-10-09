import type {
  SimulatorEntity,
  SimulatorEventLogEntry,
  SimulatorTable,
} from "@tcg/simulator-contract";

export interface GrandArchiveFeedbackSnapshot {
  readonly table: SimulatorTable;
  readonly entities: readonly SimulatorEntity[];
  readonly eventLog: readonly SimulatorEventLogEntry[];
}
type CueBase = { readonly id: string; readonly label: string };
export type GrandArchiveFeedbackCue = CueBase &
  (
    | {
        readonly kind: "entity-move";
        readonly entityId: string;
        readonly incarnation: number;
        readonly fromZoneId?: string;
        readonly toZoneId?: string;
      }
    | { readonly kind: "entity-change"; readonly entityId: string; readonly incarnation: number }
    | { readonly kind: "zone-change"; readonly zoneId: string }
    | { readonly kind: "announcement"; readonly sourceKey?: string }
  );
export interface GrandArchiveFeedbackState {
  readonly snapshot: GrandArchiveFeedbackSnapshot;
  readonly resetKey: string | number;
  readonly seenLogIds: ReadonlySet<string>;
  readonly cues: readonly GrandArchiveFeedbackCue[];
}
function incarnation(entity: SimulatorEntity): number {
  const value = entity.dataAttributes?.["data-incarnation"];
  return typeof value === "number" ? value : 0;
}
function zones(snapshot: GrandArchiveFeedbackSnapshot): Map<string, string> {
  return new Map(
    snapshot.table.zones.flatMap((zone) => zone.entityIds.map((id) => [id, zone.id] as const)),
  );
}
/** Presentation only: never decides legality, resolves rules, or correlates hidden cards. */
export function reconcileGrandArchiveFeedback(
  previous: GrandArchiveFeedbackState | undefined,
  snapshot: GrandArchiveFeedbackSnapshot,
  resetKey: string | number = 0,
): GrandArchiveFeedbackState {
  const seenLogIds = new Set(snapshot.eventLog.map((entry) => entry.id));
  const version = snapshot.table.status.stateVersion;
  const oldVersion = previous?.snapshot.table.status.stateVersion;
  if (
    !previous ||
    previous.resetKey !== resetKey ||
    (version !== undefined && oldVersion !== undefined && version < oldVersion)
  ) {
    return { snapshot, resetKey, seenLogIds, cues: [] };
  }
  const cues: GrandArchiveFeedbackCue[] = [];
  // Keep server order, including multiple committed messages from one transition.
  for (const entry of snapshot.eventLog) {
    if (!previous.seenLogIds.has(entry.id)) {
      cues.push({
        id: `log:${entry.id}`,
        kind: "announcement",
        label: entry.message,
        ...(entry.sourceKey ? { sourceKey: entry.sourceKey } : {}),
      });
    }
  }
  // Retain IDs while they belong to the active log; normal full logs retain history.
  // A baseline reset is mandatory when a transport replaces its event history.
  const before = new Map(previous.snapshot.entities.map((entity) => [entity.id, entity]));
  const fromZones = zones(previous.snapshot);
  const toZones = zones(snapshot);
  for (const entity of snapshot.entities) {
    if (entity.face !== "public") continue;
    const old = before.get(entity.id);
    const fromZoneId = old?.face === "public" ? fromZones.get(entity.id) : undefined;
    const toZoneId = toZones.get(entity.id);
    const id = `state:${version}:${entity.id}:${incarnation(entity)}`;
    if (
      !old ||
      old.face !== "public" ||
      fromZoneId !== toZoneId ||
      incarnation(old) !== incarnation(entity)
    ) {
      cues.push({
        id,
        kind: "entity-move",
        entityId: entity.id,
        incarnation: incarnation(entity),
        ...(fromZoneId ? { fromZoneId } : {}),
        ...(toZoneId ? { toZoneId } : {}),
        label: `${entity.title} ${toZoneId ? "entered " + (snapshot.table.zones.find((zone) => zone.id === toZoneId)?.label ?? "a zone") : "is visible"}`,
      });
    } else if (
      old.title !== entity.title ||
      old.imageUrl !== entity.imageUrl ||
      old.dataAttributes?.["data-facing"] !== entity.dataAttributes?.["data-facing"] ||
      JSON.stringify(old.states) !== JSON.stringify(entity.states) ||
      JSON.stringify(old.stats) !== JSON.stringify(entity.stats)
    ) {
      const changedStates = [
        ...entity.states.filter((state) => !old.states.includes(state)),
        ...old.states
          .filter((state) => !entity.states.includes(state))
          .map((state) => `no longer ${state}`),
      ];
      const values = [
        ...changedStates,
        ...(old.dataAttributes?.["data-facing"] !== entity.dataAttributes?.["data-facing"] &&
        typeof entity.dataAttributes?.["data-facing"] === "string"
          ? [entity.dataAttributes["data-facing"]]
          : []),
        ...entity.stats.map((stat) => `${stat.label} ${stat.value}`),
      ].join(", ");
      cues.push({
        id,
        kind: "entity-change",
        entityId: entity.id,
        incarnation: incarnation(entity),
        label: `${entity.title}: ${values || entity.states.join(", ") || "changed"}`,
      });
    }
  }
  for (const seat of snapshot.table.seats) {
    const old = previous.snapshot.table.seats.find((candidate) => candidate.id === seat.id);
    if (!old) continue;
    for (const label of new Set(
      [...old.counters, ...seat.counters].map((counter) => counter.label),
    )) {
      const before = old.counters.find((counter) => counter.label === label)?.value;
      const after = seat.counters.find((counter) => counter.label === label)?.value;
      if (before === after) continue;
      cues.push({
        id: `player:${version}:${seat.id}:${label}`,
        kind: "announcement",
        label: `${seat.label} · ${label}: ${before ?? "none"} → ${after ?? "none"}`,
      });
    }
  }
  for (const zone of snapshot.table.zones) {
    const old = previous.snapshot.table.zones.find((candidate) => candidate.id === zone.id);
    if (old && old.count !== zone.count)
      cues.push({
        id: `zone:${version}:${zone.id}:${zone.count}`,
        kind: "zone-change",
        zoneId: zone.id,
        label: `${zone.label}: ${old.count} → ${zone.count}`,
      });
  }
  if (
    snapshot.table.status.phase !== previous.snapshot.table.status.phase ||
    snapshot.table.status.activeSeatId !== previous.snapshot.table.status.activeSeatId ||
    snapshot.table.status.turn !== previous.snapshot.table.status.turn
  ) {
    const actor = snapshot.table.seats.find(
      (seat) => seat.id === snapshot.table.status.activeSeatId,
    )?.label;
    cues.push({
      id: `activity:${version}`,
      kind: "announcement",
      label: `Turn ${snapshot.table.status.turn} · ${snapshot.table.status.phase}${actor ? ` · ${actor}` : ""}`,
    });
  }
  return { snapshot, resetKey, seenLogIds, cues };
}
