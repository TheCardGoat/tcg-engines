import type { EngineInteractionView } from "@tcg/protocol";
import type { HarnessFixture } from "@tcg/simulator-contract";
import type {
  GrandArchiveSimulatorWaitState,
  GrandArchiveViewerSimulatorProjection,
} from "@tcg/grand-archive-server-adapter";

import { grandArchiveCardPresentation } from "@tcg/grand-archive-server-adapter";

export interface GrandArchiveHarnessFixture extends HarnessFixture {
  readonly interactionView?: EngineInteractionView;
  readonly combatView: GrandArchiveViewerSimulatorProjection["combatView"];
  readonly turnPlayerId: string;
  readonly waitState: GrandArchiveSimulatorWaitState;
}

export function grandArchiveHarnessFixture(
  id: string,
  name: string,
  summary: string,
  projection: GrandArchiveViewerSimulatorProjection,
): GrandArchiveHarnessFixture {
  const zoneBlocks = projection.table.zones.map((zone) => ({
    id: `block:${zone.id}`,
    kind: zone.role === "deck" ? ("stack" as const) : ("zone" as const),
    label: zone.label,
    size: zone.role === "battlefield" ? ("wide" as const) : ("normal" as const),
    zoneId: zone.id,
    entityIds: zone.entityIds,
    note: `${zone.count ?? zone.entityIds.length} card(s)`,
  }));
  const sections = projection.table.seats.map((seat) => ({
    id: `section:${seat.id}`,
    label: seat.label,
    role: seat.perspective === "bottom" ? ("player" as const) : ("opponent" as const),
    layout: { columns: 6 as const, flow: "row" as const },
    blocks: zoneBlocks.filter((block) => block.zoneId?.startsWith(`${seat.id}:`)),
  }));
  return {
    id,
    gameSlug: "grand-archive",
    name,
    summary,
    adapterGoal: "Render only viewer projection data and authoritative legal commands.",
    table: projection.table,
    boardLayout: {
      title: `Grand Archive · ${name}`,
      summary,
      appearance: { variant: "opposed", density: "compact", fit: "viewport" },
      buildingBlocks: [
        { name: "Viewer projection", responsibility: "Omits private object identities." },
        { name: "Legal commands", responsibility: "Owns every enabled control." },
        { name: "Version guard", responsibility: "Carries state version and object incarnation." },
      ],
      sections,
    },
    entities: projection.entities.map(grandArchiveCardPresentation),
    interactions: [...projection.interactions],
    eventLog: [...projection.eventLog],
    guideSteps: [
      { title: "Inspect the wait state", body: projection.table.status.phase },
      { title: "Inspect hidden zones", body: "Counts remain visible; private identities do not." },
      { title: "Use a real control", body: "Every action maps to one current legal command." },
    ],
    agentChecks: [
      "No hidden definition ids",
      "State version shown",
      "Incarnation attached to visible objects",
    ],
    coreComponents: [],
    combatView: projection.combatView,
    turnPlayerId: projection.turnPlayerId,
    waitState: projection.waitState,
    interactionView: projection.interactionView,
  };
}
