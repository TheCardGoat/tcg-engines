import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  getGrandArchiveCard,
  spiritOfFortuitousFire,
  portSmuggler,
  spiritOfWind,
  spiritOfFire,
  raiSpellcrafter,
  raiArchmage,
  impassionedTutor,
  woodlandSquirrels,
} from "@tcg/grand-archive-cards";
import { createGrandArchiveCatalogSmokeFixture } from "@tcg/grand-archive-engine/automation";
import { grandArchiveDecisionId, grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import {
  GrandArchiveMatchRuntime,
  listGrandArchiveLegalCommands,
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
  type GrandArchiveMatchState,
} from "@tcg/grand-archive-engine/simulator";
import {
  projectGrandArchiveSimulator,
  GrandArchiveServerEngine,
} from "@tcg/grand-archive-server-adapter";
import { grandArchiveHarnessFixture, type GrandArchiveHarnessFixture } from "./fixtureProjection";
import { createGrandArchivePracticeEngineFromSetup } from "./practice-setup";
import { grandArchivePracticeDecks } from "@tcg/grand-archive-server-adapter/practice";

export type GrandArchiveFixtureGroupId = "turn-flow" | "combat" | "decision" | "terminal";

export interface GrandArchiveVisualFixture extends GrandArchiveHarnessFixture {
  readonly group: GrandArchiveFixtureGroupId;
  readonly tags: readonly string[];
}

export const GRAND_ARCHIVE_FIXTURE_GROUPS: readonly {
  readonly id: GrandArchiveFixtureGroupId;
  readonly label: string;
  readonly description: string;
}[] = [
  {
    id: "combat",
    label: "Combat",
    description: "Attacker, defender, target, and combat-step presentation.",
  },
  {
    id: "turn-flow",
    label: "Turn flow",
    description: "Authoritative pregame, materialization, opportunity, and resolution states.",
  },
  {
    id: "decision",
    label: "Player decisions",
    description: "Viewer-scoped choices with legal engine candidates.",
  },
  {
    id: "terminal",
    label: "Terminal state",
    description: "Completed matches with no fabricated gameplay actions.",
  },
];

const { program, initialState } = createGrandArchiveCatalogSmokeFixture(20260826);
const p1 = grandArchivePlayerId("p1");
const p2 = grandArchivePlayerId("p2");
const pregame = projectGrandArchiveSimulator(program, initialState, p1);
const progression = new GrandArchiveMatchRuntime(program, initialState);
progression.execute(
  { move: "complete-pregame-actions" },
  { playerId: p1, expectedStateVersion: progression.state.stateVersion },
);
progression.execute(
  { move: "complete-pregame-actions" },
  { playerId: p2, expectedStateVersion: progression.state.stateVersion },
);
const opportunitySnapshot = progression.state;
const opportunity = projectGrandArchiveSimulator(program, opportunitySnapshot, p1);
const stackRuntime = new GrandArchiveMatchRuntime(program, opportunitySnapshot);
const stackWait = stackRuntime.waitState();
const stackActor = stackWait.kind === "opportunity" ? stackWait.playerId : p1;
const stackActivation = listGrandArchiveLegalCommands(program, stackRuntime.state, stackActor).find(
  (entry) => entry.command.move === "activate-card" || entry.command.move === "activate-ability",
);
if (stackActivation) {
  stackRuntime.execute(stackActivation.command, {
    playerId: stackActor,
    expectedStateVersion: stackRuntime.state.stateVersion,
  });
}
const effectsStack = projectGrandArchiveSimulator(program, stackRuntime.state, stackActor);
for (let pass = 0; pass < 8; pass += 1) {
  const wait = progression.waitState();
  if (wait.kind !== "opportunity") break;
  progression.execute(
    { move: "pass" },
    { playerId: wait.playerId, expectedStateVersion: progression.state.stateVersion },
  );
}
const materialization = projectGrandArchiveSimulator(program, progression.state, p1);
// Safety bound for automatic pregame/opportunity advancement; not a turn-count requirement.
const MAX_MATERIAL_HAND_SETUP_STEPS = 32;

// A full starter material deck makes the temporary-hand flow inspectable.
export function createMaterialHandFixtureServer() {
  const starter = grandArchivePracticeDecks.find((deck) => deck.id === "lorraine-pnp-1-4");
  if (!starter) throw new Error("Material hand fixture requires the Lorraine starter deck");
  const materialHandServer = createGrandArchivePracticeEngineFromSetup({
    deck: starter.deck,
    randomSeed: 20260826,
  });
  for (let step = 0; step < MAX_MATERIAL_HAND_SETUP_STEPS; step += 1) {
    const wait = materialHandServer.runtime.waitState();
    if (wait.kind === "materialization-choice") return materialHandServer;
    if (wait.kind !== "pregame-action" && wait.kind !== "opportunity") {
      throw new Error(`Unexpected material hand setup state: ${wait.kind}`);
    }
    materialHandServer.runtime.execute(
      { move: wait.kind === "pregame-action" ? "complete-pregame-actions" : "pass" },
      {
        playerId: wait.playerId,
        expectedStateVersion: materialHandServer.runtime.state.stateVersion,
      },
    );
  }
  throw new Error("Material hand fixture did not reach materialization");
}
/** Real server submissions make target selection and the resulting combat inspectable. */
export function createAttackTargetingFixtureServer(fullArtOpponent = false) {
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      id: "p1",
      name: "You",
      champion: spiritOfWind,
      zones: { field: [portSmuggler, woodlandSquirrels] },
    },
    playerTwo: {
      id: "p2",
      name: "Opponent",
      champion: fullArtOpponent ? spiritOfFortuitousFire : spiritOfWind,
      zones: { field: [portSmuggler, woodlandSquirrels] },
    },
  });
  return new GrandArchiveServerEngine(
    game.program,
    new GrandArchiveMatchRuntime(game.program, game.state),
  );
}
const terminal = new GrandArchiveMatchRuntime(program, initialState);
terminal.execute(
  { move: "concede" },
  { playerId: p1, expectedStateVersion: terminal.state.stateVersion },
);
const gameOver = projectGrandArchiveSimulator(program, terminal.state, p2);
const decisionCandidate = progression.state.zones[p1].hand[0];
if (!decisionCandidate) throw new Error("Grand Archive decision fixture needs a hand card.");
const decisionBase: GrandArchiveMatchState = {
  ...progression.state,
  opportunity: null,
  objects: {
    ...progression.state.objects,
    [decisionCandidate]: {
      ...progression.state.objects[decisionCandidate]!,
      zone: "memory",
    },
  },
  zones: {
    ...progression.state.zones,
    [p1]: {
      ...progression.state.zones[p1],
      hand: progression.state.zones[p1].hand.filter((id) => id !== decisionCandidate),
      memory: [...progression.state.zones[p1].memory, decisionCandidate],
    },
  },
};
const decisionState = restoreGrandArchiveMatchSnapshot(
  program,
  serializeGrandArchiveMatchSnapshot({
    ...decisionBase,
    decision: {
      id: grandArchiveDecisionId("visual-fixture-recollection"),
      kind: "choose-recollection",
      playerId: p1,
      amount: 1,
      candidateIds: [decisionCandidate],
      stateVersion: progression.state.stateVersion,
    },
  }),
);
const decision = projectGrandArchiveSimulator(program, decisionState, p1);
const decisionObserver = projectGrandArchiveSimulator(program, decisionState, p2);
const resolvingState = restoreGrandArchiveMatchSnapshot(
  program,
  serializeGrandArchiveMatchSnapshot({ ...opportunitySnapshot, opportunity: null }),
);
const resolving = projectGrandArchiveSimulator(program, resolvingState, p1);
const attackerId = opportunitySnapshot.zones[p1].field[0];
const targetId = opportunitySnapshot.zones[p2].field[0];
if (!attackerId || !targetId) throw new Error("Grand Archive combat fixture needs both Champions");
const combatState = restoreGrandArchiveMatchSnapshot(
  program,
  serializeGrandArchiveMatchSnapshot({
    ...opportunitySnapshot,
    opportunity: null,
    combat: {
      attackerId,
      attackingPlayerId: p1,
      defendingPlayerIds: [p2],
      targetIds: [targetId],
      retaliatorIds: [],
      retaliationOrderConfirmed: false,
      weaponIds: [],
      intentIds: [],
      step: "declaration",
    },
  }),
);
const combat = projectGrandArchiveSimulator(program, combatState, p1);

// Deterministic inspection state: arbitrary cards may inhabit lineage, loaded, and intent.
const inspectionIds = opportunitySnapshot.zones[p1]["main-deck"].slice(0, 4);
if (inspectionIds.length !== 4) throw new Error("Zone inspection fixture needs four cards.");
const inspectionObjects = { ...opportunitySnapshot.objects };
const inspectionZones = { ...opportunitySnapshot.zones[p1] };
for (const [index, zone] of (["inner-lineage", "loaded", "intent"] as const).entries()) {
  const id = inspectionIds[index]!;
  inspectionObjects[id] = {
    ...inspectionObjects[id]!,
    zone,
    hostId: attackerId,
    facing: "face-up",
  };
  inspectionZones[zone] = [...inspectionZones[zone], id];
}
inspectionZones["main-deck"] = inspectionZones["main-deck"].filter(
  (id) => !inspectionIds.slice(0, 3).includes(id),
);
const revealedId = inspectionIds[3]!;
inspectionObjects[revealedId] = { ...inspectionObjects[revealedId]!, facing: "face-up" };
const inspectionState = restoreGrandArchiveMatchSnapshot(
  program,
  serializeGrandArchiveMatchSnapshot({
    ...opportunitySnapshot,
    objects: inspectionObjects,
    zones: { ...opportunitySnapshot.zones, [p1]: inspectionZones },
    combat: { ...combatState.combat!, intentIds: [inspectionIds[2]!] },
  }),
);
const zoneInspection = projectGrandArchiveSimulator(program, inspectionState, p1);

// Use real legal moves so the damage showcase follows production combat timing.
const damageShowcase = GrandArchiveTestEngine.startFixture({
  playerOne: { id: "p1", name: "You", champion: spiritOfWind, zones: { field: [portSmuggler] } },
  playerTwo: {
    id: "p2",
    name: "Opponent",
    champion: spiritOfWind,
    zones: { field: [portSmuggler] },
  },
});
const showcaseDefender = damageShowcase.player("p2").card(portSmuggler, { zone: "field" });
damageShowcase.player("p1").declareAttack(portSmuggler, showcaseDefender);
function passShowcaseOpportunity() {
  const holder = damageShowcase.state.opportunity?.holderId;
  if (!holder) throw new Error("Combat showcase requires an Opportunity holder");
  damageShowcase.player(holder).pass();
}
while (!damageShowcase.state.decision) passShowcaseOpportunity();
const retaliationChoice = projectGrandArchiveSimulator(
  damageShowcase.program,
  damageShowcase.state,
  p2,
);
const showcaseDecision = damageShowcase.state.decision;
if (showcaseDecision.kind !== "choose-retaliators")
  throw new Error("Expected retaliation showcase decision");
damageShowcase.player(showcaseDecision.playerId).execute({
  move: "answer-decision",
  decisionId: showcaseDecision.id,
  stateVersion: showcaseDecision.stateVersion,
  answer: [showcaseDefender.objectId],
});
const damageForecast = projectGrandArchiveSimulator(
  damageShowcase.program,
  damageShowcase.state,
  p1,
);
while (damageShowcase.state.combat) passShowcaseOpportunity();
const combatResult = projectGrandArchiveSimulator(damageShowcase.program, damageShowcase.state, p1);

// A deterministic presentation fixture; amounts are arranged, not a played transcript.
const counterObjects = { ...damageShowcase.state.objects };
const counterChampion = damageShowcase.player("p1").card(spiritOfWind, { zone: "field" }).objectId;
const counterAlly = damageShowcase.player("p1").card(portSmuggler, { zone: "field" }).objectId;
counterObjects[counterChampion] = {
  ...counterObjects[counterChampion]!,
  damage: 7,
  counters: { enlighten: 3, level: 1, "named:charge": 12 },
};
counterObjects[counterAlly] = {
  ...counterObjects[counterAlly]!,
  damage: 1,
  counters: { buff: 2, bulwark: 1, static: 2, preparation: 0 },
};
const counterIdentity = projectGrandArchiveSimulator(
  damageShowcase.program,
  {
    ...damageShowcase.state,
    objects: counterObjects,
  },
  p1,
);

const WAIT_FIXTURES = [
  [
    "champion-lineage",
    "Champion lineage",
    "Spirit and successive champion levels share one stack, with elemental hand actions available.",
    "turn-flow",
    ["lineage", "champion", "level-up"],
  ],
  [
    "counter-identity",
    "Counters and marked damage",
    "Champion and ally damage, buff, protection, named counters and overflow inspection.",
    "combat",
    ["counters", "damage", "buff", "bulwark", "inspection"],
  ],
  [
    "combat-retaliation",
    "Choose retaliation",
    "An eligible defender chooses whether to retaliate.",
    "combat",
    ["retaliation", "decision"],
  ],
  [
    "combat-damage",
    "Two-way damage forecast",
    "Committed retaliation with a before-damage Opportunity window.",
    "combat",
    ["damage", "forecast", "retaliation"],
  ],
  [
    "combat-result",
    "Resolved combat",
    "Actual damage in both directions after combat cleanup.",
    "combat",
    ["damage", "result"],
  ],
  [
    "effects-stack",
    "Effects Stack",
    "The top stack item stays visible while players receive Opportunity to respond or pass.",
    "turn-flow",
    ["effects stack", "opportunity", "resolution"],
  ],
  [
    "combat-declaration",
    "Combat declaration",
    "The attacking Champion and declared target are identified at the authoritative combat step.",
    "combat",
    ["combat", "attacker", "target", "declaration"],
  ],
  [
    "pregame-action",
    "Pregame action",
    "Player one may perform pregame special actions.",
    "turn-flow",
    ["pregame", "special action"],
  ],
  [
    "materialization-choice",
    "Materialization choice",
    "The turn player must materialize, Preserve, or skip.",
    "turn-flow",
    ["materialization", "preserve"],
  ],
  [
    "materialization-hand",
    "Material deck in hand",
    "Try one materialization choice, then use Reset materialization to try another.",
    "turn-flow",
    ["materialization", "hand", "starter"],
  ],
  [
    "attack-targeting",
    "Choose an attack target",
    "Select Port Smuggler, inspect legal targets, and declare an attack. Reset to try another target.",
    "combat",
    ["attack", "targeting", "interactive"],
  ],
  [
    "opportunity",
    "Opportunity",
    "The current holder may take a legal action or pass.",
    "turn-flow",
    ["opportunity", "pass", "action"],
  ],
  [
    "art-only",
    "Framed and full-art field cards",
    "Framed crops beside an unchanged full-art printing, with exact full-card inspection.",
    "combat",
    ["art", "printing", "preview"],
  ],
  [
    "decision",
    "Decision",
    "Only the deciding viewer receives answer controls.",
    "decision",
    ["recollection", "choice", "memory"],
  ],
  [
    "decision-observer",
    "Observed decision",
    "An observer sees who is deciding without receiving private candidates or controls.",
    "decision",
    ["decision", "observer", "privacy"],
  ],
  [
    "resolving",
    "Resolving",
    "Automatic engine work is in progress; no controls are fabricated.",
    "turn-flow",
    ["effects stack", "automatic"],
  ],
  [
    "zone-inspection",
    "Zone inspection",
    "Inspect lineage, loaded cards, intent, and an authorized deck reveal.",
    "combat",
    ["zones", "lineage", "loaded", "intent", "reveal"],
  ],
  [
    "game-over",
    "Game over",
    "The winner projection is terminal and accepts no gameplay commands.",
    "terminal",
    ["winner", "concede"],
  ],
] as const;

const lineageShowcase = GrandArchiveTestEngine.startFixture({
  playerOne: {
    id: "p1",
    name: "You",
    champion: spiritOfFire,
    lineage: [raiSpellcrafter, raiArchmage],
    zones: { hand: [impassionedTutor, woodlandSquirrels, woodlandSquirrels] },
  },
  playerTwo: { id: "p2", name: "Opponent", champion: spiritOfWind, lineage: [raiSpellcrafter] },
});

const PROJECTIONS = {
  "champion-lineage": projectGrandArchiveSimulator(
    lineageShowcase.program,
    lineageShowcase.state,
    p1,
  ),
  "counter-identity": counterIdentity,
  "combat-retaliation": retaliationChoice,
  "combat-damage": damageForecast,
  "combat-result": combatResult,
  "zone-inspection": zoneInspection,
  "pregame-action": pregame,
  "materialization-choice": materialization,

  opportunity,
  "effects-stack": effectsStack,
  decision,
  "decision-observer": decisionObserver,
  resolving,
  "combat-declaration": combat,
  "game-over": gameOver,
} as const;

// Catalog metadata stays cheap; construct and cache the projection on first state access.
export const GRAND_ARCHIVE_VISUAL_FIXTURES: readonly GrandArchiveVisualFixture[] =
  WAIT_FIXTURES.map(([id, name, summary, group, tags]) => {
    let cached: GrandArchiveHarnessFixture | undefined;
    const resolve = () => {
      if (!cached) {
        const projection =
          id === "art-only" || id === "materialization-hand" || id === "attack-targeting"
            ? (() => {
                const server =
                  id === "art-only" || id === "attack-targeting"
                    ? createAttackTargetingFixtureServer(id === "art-only")
                    : createMaterialHandFixtureServer();
                if (id === "art-only") {
                  // Pin one visible opponent champion to its real full-art edition.
                  const record = Object.values(server.art.records.records).find(
                    (card) => card.canonicalId === spiritOfFortuitousFire.canonicalId,
                  );
                  const fullArt =
                    record &&
                    Object.entries(record.printings).find(
                      ([, printing]) => printing.boardImageUrl === printing.printedImageUrl,
                    );
                  const object =
                    record &&
                    Object.values(server.runtime.state.objects).find(
                      (candidate) =>
                        candidate.ownerId === "p2" &&
                        getGrandArchiveCard(candidate.definitionId)?.canonicalId ===
                          record.canonicalId,
                    );
                  if (object && fullArt) server.art.printingIdByObjectId[object.id] = fullArt[0];
                }
                return projectGrandArchiveSimulator(
                  server.program,
                  server.runtime.state,
                  p1,
                  id === "art-only"
                    ? server.getViewerResources({ role: "player", actorId: p1 })
                    : {},
                );
              })()
            : PROJECTIONS[id];
        cached = grandArchiveHarnessFixture(id, name, summary, projection);
      }
      return cached;
    };
    return {
      id,
      name,
      summary,
      group,
      tags,
      gameSlug: "grand-archive",
      get adapterGoal() {
        return resolve().adapterGoal;
      },
      get table() {
        return resolve().table;
      },
      get boardLayout() {
        return resolve().boardLayout;
      },
      get entities() {
        return resolve().entities;
      },
      get interactions() {
        return resolve().interactions;
      },
      get eventLog() {
        return resolve().eventLog;
      },
      get guideSteps() {
        return resolve().guideSteps;
      },
      get agentChecks() {
        return resolve().agentChecks;
      },
      get coreComponents() {
        return resolve().coreComponents;
      },
      get turnPlayerId() {
        return resolve().turnPlayerId;
      },
      get combatView() {
        return resolve().combatView;
      },
      get waitState() {
        return resolve().waitState;
      },
      get interactionView() {
        return resolve().interactionView;
      },
    };
  });
