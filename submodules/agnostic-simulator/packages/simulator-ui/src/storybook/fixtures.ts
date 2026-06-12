import type {
  BoardBlock,
  HarnessFixture,
  SimulatorEntity,
  SimulatorEventLogEntry,
  SimulatorInteraction,
  SimulatorSeat,
  SimulatorTargetingIntent,
  SimulatorTable,
  SimulatorZone,
} from "@tcg/simulator-contract";

export const seats: SimulatorSeat[] = [
  {
    id: "player-1",
    label: "Player",
    role: "human",
    perspective: "bottom",
    counters: [
      { label: "VP", value: "8" },
      { label: "Cards", value: "5" },
    ],
    timerMs: 142000,
    timerState: "running",
    connectionStatus: "online",
  },
  {
    id: "player-2",
    label: "Opponent",
    role: "agent",
    perspective: "top",
    counters: [
      { label: "VP", value: "6" },
      { label: "Cards", value: "4" },
    ],
    timerMs: 0,
    timerState: "expired",
    connectionStatus: "thinking",
  },
];

export const entities: SimulatorEntity[] = [
  {
    id: "runner",
    title: "Signal Runner",
    subtitle: "Fast unit",
    kind: "unit",
    ownerId: "player-1",
    face: "public",
    states: ["ready", "active"],
    stats: [
      { label: "PWR", value: "4" },
      { label: "HP", value: "3" },
    ],
    traits: ["Scout", "Hacker"],
    frameStyle: { color: "#4ad9ff" },
    overlayBadges: [
      { label: "+2", color: "#16a34a", position: "tr" },
      { label: "A", color: "#eab308", position: "bl" },
    ],
  },
  {
    id: "guard",
    title: "Gate Guard",
    subtitle: "Defensive unit",
    kind: "unit",
    ownerId: "player-2",
    face: "public",
    states: ["rested"],
    stats: [
      { label: "PWR", value: "2" },
      { label: "HP", value: "5" },
    ],
    traits: ["Sentinel"],
    frameStyle: { color: "#ff3d8a" },
  },
  {
    id: "resource-a",
    title: "Charge Cell",
    subtitle: "Resource",
    kind: "resource",
    ownerId: "player-1",
    face: "public",
    states: ["ready"],
    stats: [{ label: "GEN", value: "1" }],
    traits: ["Energy"],
    frameStyle: { color: "#f5e642" },
  },
  {
    id: "hidden-card",
    title: "Unknown Gambit",
    subtitle: "Private hand card",
    kind: "card",
    ownerId: "player-2",
    face: "hidden",
    states: ["hidden"],
    stats: [],
    traits: [],
  },
  {
    id: "leader",
    title: "Command Node",
    subtitle: "Leader",
    kind: "leader",
    ownerId: "player-1",
    face: "public",
    states: ["active"],
    stats: [{ label: "LVL", value: "3" }],
    traits: ["Core"],
    frameStyle: { color: "#a78bfa" },
  },
];

export const zones: SimulatorZone[] = [
  {
    id: "player-field",
    label: "Player Field",
    role: "battlefield",
    ownerId: "player-1",
    visibility: "public",
    entityIds: ["runner", "leader"],
    hint: "Ready units can be selected.",
    layoutHint: "grid",
    allowedDropRoles: ["battlefield"],
  },
  {
    id: "opponent-field",
    label: "Opponent Field",
    role: "battlefield",
    ownerId: "player-2",
    visibility: "public",
    entityIds: ["guard"],
    hint: "Opponent board state.",
    layoutHint: "row",
  },
  {
    id: "player-hand",
    label: "Player Hand",
    role: "hand",
    ownerId: "player-1",
    visibility: "owner",
    entityIds: ["runner", "resource-a", "hidden-card"],
    count: 5,
    hint: "Only the owner sees these cards.",
    layoutHint: "fan",
  },
  {
    id: "opponent-deck",
    label: "Opponent Deck",
    role: "deck",
    ownerId: "player-2",
    visibility: "secret",
    entityIds: [],
    count: 32,
    hint: "Secret stack.",
    layoutHint: "stack",
  },
  {
    id: "discard",
    label: "Discard",
    role: "discard",
    visibility: "public",
    entityIds: ["resource-a"],
    count: 1,
    hint: "Shared discard.",
    layoutHint: "row",
  },
];

export const table: SimulatorTable = {
  status: { activeSeatId: "player-1", phase: "Main Phase", turn: 4, stateVersion: 17 },
  seats,
  zones,
};

export const entityMap = new Map(entities.map((entity) => [entity.id, entity]));

export const interactions: SimulatorInteraction[] = [
  interaction("action-pass", "Pass priority", "End the current action window.", "action"),
  interaction(
    "single-target",
    "Choose attacker",
    "Select one ready unit to attack with.",
    "single-target",
    ["runner", "leader"],
  ),
  interaction(
    "multi-target",
    "Choose targets",
    "Select up to two enemy targets.",
    "multi-target",
    ["guard", "leader"],
    { min: 1, max: 2 },
  ),
  interaction("option", "Choose mode", "Pick one mode for the effect.", "option", [], {
    options: [
      { id: "draw", label: "Draw a card" },
      { id: "buff", label: "Ready a unit" },
    ],
  }),
  interaction("payment", "Pay cost", "Commit resources to pay the cost.", "payment", [
    "resource-a",
    "runner",
  ]),
  interaction("ordering", "Order stack", "Choose resolution order.", "ordering", [
    "runner",
    "guard",
    "leader",
  ]),
  interaction("drag-drop", "Move card", "Drag the card into a legal zone.", "drag-drop-target", [
    "runner",
  ]),
];

export const eventLog: SimulatorEventLogEntry[] = [
  {
    id: "log-1",
    turn: 3,
    phase: "Draw",
    seatId: "player-1",
    timestamp: "2026-06-07T10:00:00Z",
    message: "Player drew a card.",
    tags: ["move", "system"],
    entityIds: ["hidden-card"],
  },
  {
    id: "log-2",
    turn: 4,
    phase: "Main",
    seatId: "player-1",
    timestamp: "2026-06-07T10:01:00Z",
    message: "Signal Runner attacked Gate Guard.",
    tags: ["combat"],
    entityIds: ["runner", "guard"],
  },
  {
    id: "log-3",
    turn: 4,
    phase: "Main",
    seatId: "player-2",
    timestamp: "2026-06-07T10:02:00Z",
    message: "Gate Guard triggered a defensive ability.",
    tags: ["ability"],
    entityIds: ["guard"],
  },
];

export const targetingIntents: SimulatorTargetingIntent[] = [
  {
    id: "target-1",
    sourceEntityId: "runner",
    targetEntityIds: ["guard"],
    targetZoneIds: [],
    preview: { damage: 3 },
  },
  {
    id: "target-2",
    sourceEntityId: "leader",
    targetEntityIds: [],
    targetZoneIds: ["discard"],
    preview: { banish: true, damage: 1 },
  },
];

export const boardBlocks: BoardBlock[] = [
  { id: "seat-player", kind: "seat", label: "Player", size: "normal", seatId: "player-1" },
  { id: "zone-field", kind: "zone", label: "Player Field", size: "wide", zoneId: "player-field" },
  {
    id: "stack-deck",
    kind: "stack",
    label: "Opponent Deck",
    size: "compact",
    zoneId: "opponent-deck",
  },
  { id: "counter-score", kind: "counter", label: "Momentum", size: "compact", value: "3" },
  {
    id: "tokens",
    kind: "token-row",
    label: "Statuses",
    size: "normal",
    tokens: [
      { label: "Ready", value: "2", state: "ready" },
      { label: "Rested", value: "1", state: "rested" },
      { label: "Hidden", value: "?", state: "hidden" },
    ],
  },
  {
    id: "spotlight",
    kind: "spotlight",
    label: "Spotlight",
    size: "wide",
    entityIds: ["runner"],
    note: "Selected unit details.",
  },
];

export const fixture: HarnessFixture = {
  id: "storybook-fixture",
  gameSlug: "cyberpunk",
  name: "Storybook Simulator Fixture",
  summary: "Reusable agnostic simulator fixture for UI states.",
  adapterGoal: "Render every shared simulator-ui primitive with deterministic data.",
  table,
  boardLayout: {
    title: "Three Lane Table",
    summary: "Opponent, shared stack, and player lanes.",
    appearance: { variant: "lanes", density: "normal", labelPlacement: "top" },
    buildingBlocks: [
      { name: "Board", responsibility: "Places normalized zones and seats." },
      { name: "InteractionPanel", responsibility: "Drafts engine-safe moves." },
    ],
    sections: [
      {
        id: "opponent",
        label: "Opponent",
        role: "opponent",
        layout: { columns: 12, flow: "grid", labelPlacement: "top" },
        blocks: [
          { id: "op-seat", kind: "seat", label: "Opponent", size: "normal", seatId: "player-2" },
          {
            id: "op-field",
            kind: "zone",
            label: "Opponent Field",
            size: "wide",
            zoneId: "opponent-field",
          },
          {
            id: "op-deck",
            kind: "stack",
            label: "Opponent Deck",
            size: "compact",
            zoneId: "opponent-deck",
          },
        ],
      },
      {
        id: "shared",
        label: "Shared",
        role: "shared",
        layout: { columns: 12, flow: "row", labelPlacement: "rail" },
        blocks: [
          {
            id: "discard-block",
            kind: "zone",
            label: "Discard",
            size: "normal",
            zoneId: "discard",
          },
          { id: "momentum", kind: "counter", label: "Momentum", size: "compact", value: "3" },
          boardBlocks[4]!,
        ],
      },
      {
        id: "player",
        label: "Player",
        role: "player",
        layout: { columns: 12, flow: "grid", labelPlacement: "top" },
        blocks: [
          { id: "player-seat", kind: "seat", label: "Player", size: "normal", seatId: "player-1" },
          {
            id: "player-field-block",
            kind: "zone",
            label: "Player Field",
            size: "wide",
            zoneId: "player-field",
          },
          {
            id: "player-hand-block",
            kind: "zone",
            label: "Player Hand",
            size: "full",
            zoneId: "player-hand",
          },
        ],
      },
    ],
  },
  entities,
  interactions,
  guideSteps: [
    { title: "Inspect", body: "Open the card inspector." },
    { title: "Select", body: "Choose a target and preview the move." },
  ],
  agentChecks: ["Active prompt is visible", "Hidden cards stay redacted"],
  coreComponents: [
    { name: "CardFace", responsibility: "Renders public and hidden entity faces." },
    { name: "BoardBlock", responsibility: "Maps layout blocks to zones, seats, and counters." },
    { name: "SimulatorAnimationLayer", responsibility: "Coordinates primitive motion events." },
  ],
  eventLog,
  targetingIntents,
};

function interaction(
  id: string,
  label: string,
  prompt: string,
  kind: SimulatorInteraction["input"]["kind"],
  candidateEntityIds: string[] = [],
  overrides: Partial<SimulatorInteraction["input"]> = {},
): SimulatorInteraction {
  return {
    id,
    label,
    prompt,
    sourceEntityId: "runner",
    input: {
      kind,
      min: overrides.min,
      max: overrides.max,
      candidateEntityIds,
      targetZoneIds: ["player-field", "discard"],
      options: overrides.options ?? [],
    },
    movePreview: { engine: "storybook", command: id, payload: "{}" },
  };
}
