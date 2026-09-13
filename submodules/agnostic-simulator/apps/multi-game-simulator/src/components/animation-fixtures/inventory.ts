import type { SimulatorAudioCueId } from "@tcg/protocol";

export type AnimationFixtureGameId =
  | "cyberpunk"
  | "flesh-and-blood"
  | "gundam"
  | "one-piece"
  | "riftbound";
type FixtureStatus = "ready" | "partial" | "missing" | "disabled";

export interface AnimationFixtureGame {
  readonly id: AnimationFixtureGameId;
  readonly label: string;
  readonly summary: string;
  readonly note: string;
}

export interface GameFixtureCase {
  readonly status: FixtureStatus;
  readonly fixture: string;
  readonly cards: string;
  readonly action: string;
  readonly route: string | null;
  readonly pathKind?: "local" | "server" | "both";
  readonly caveat?: string;
}

export interface AnimationSequenceFixture {
  readonly id: string;
  readonly label: string;
  readonly stepTypes: readonly AnimationFixtureInventoryItem["stepType"][];
  readonly games: Partial<Readonly<Record<AnimationFixtureGameId, GameFixtureCase>>>;
}

export interface AudioCueFixture {
  readonly cue: SimulatorAudioCueId;
  readonly role: string;
  readonly games: Partial<Readonly<Record<AnimationFixtureGameId, GameFixtureCase>>>;
}

export interface FabMotionSurfaceFixture extends GameFixtureCase {
  readonly id: string;
  readonly surface: string;
  readonly role: string;
}

/** One primitive, enumerated by the board movement a player should observe. */
export const FAB_TRANSFER_FIXTURES: readonly FabMotionSurfaceFixture[] = [
  {
    id: "draw",
    surface: "Deck → hand",
    role: "Individual draws, including opponent card backs",
    status: "ready",
    fixture: "Snatch hit draw",
    cards: "Snatch",
    action:
      "Play Snatch without defending. Verify each drawn card travels from deck to its hand slot and stays hidden to the opponent.",
    route: "/flesh-and-blood/simulator/tests/dual-target-open",
    pathKind: "both",
  },
  {
    id: "pitch",
    surface: "Hand → pitch",
    role: "Payment uses the same transfer",
    status: "ready",
    fixture: "Attack-action payment",
    cards: "Splatter Skull · blue pitch card",
    action:
      "Play Splatter Skull and select a pitch card. Verify the selected card lands in pitch once.",
    route: "/flesh-and-blood/simulator/tests/attack-action-lethal",
    pathKind: "both",
  },
  {
    id: "play",
    surface: "Hand / arsenal → stack or chain",
    role: "The rendered destination wins",
    status: "ready",
    fixture: "Snatch play",
    cards: "Snatch",
    action:
      "Play Snatch. Verify it moves directly to the displayed combat-chain slot without visiting an invisible intermediate stack.",
    route: "/flesh-and-blood/simulator/tests/dual-target-open",
    pathKind: "both",
  },
  {
    id: "arsenal",
    surface: "Hand → arsenal",
    role: "Owner-visible card; opponent sees a back",
    status: "ready",
    fixture: "End phase",
    cards: "Disable · Cracked Bauble",
    action:
      "Pass both seats, then choose a card for arsenal. Verify one transfer and the correct face for each viewer.",
    route: "/flesh-and-blood/simulator/tests/endgame",
    pathKind: "both",
  },
  {
    id: "return",
    surface: "Pitch → deck",
    role: "Works even when returning and drawing cancel the deck-count change",
    status: "ready",
    fixture: "Pitch return and draw",
    cards: "Two pitched Disable",
    action:
      "Complete arsenal selection and confirm pitch order. Verify individual returns and draws without a phase hold.",
    route: "/flesh-and-blood/simulator/tests/endgame",
    pathKind: "both",
  },
  {
    id: "cleanup",
    surface: "Combat chain → graveyard",
    role: "One card, one landing",
    status: "ready",
    fixture: "Snatch chain cleanup",
    cards: "Snatch",
    action:
      "Resolve Snatch and close the combat chain. Verify the card travels to graveyard, no duplicate remains, and controls unlock.",
    route: "/flesh-and-blood/simulator/tests/dual-target-open",
    pathKind: "both",
  },
  {
    id: "discard",
    surface: "Hand → graveyard",
    role: "No separate effect-owned movement",
    status: "ready",
    fixture: "Discard as an activation cost",
    cards: "Cosmic Duality",
    action: "Activate Cosmic Duality from hand and verify its discard uses the standard transfer.",
    route: "/flesh-and-blood/simulator/tests/hand-play-or-activate",
    pathKind: "both",
  },
  {
    id: "banish",
    surface: "Deck → banished",
    role: "Viewer-safe reveal during transfer",
    status: "ready",
    fixture: "Boost",
    cards: "Zero to Sixty · Hadron Collider",
    action:
      "Play Zero to Sixty and accept Boost. Verify the banished card travels from deck using the same card-transfer primitive.",
    route: "/flesh-and-blood/simulator/tests/boost-fusion-lab",
    pathKind: "both",
  },
  {
    id: "soul",
    surface: "Hand → soul",
    role: "Land on the hero's soul anchor",
    status: "ready",
    fixture: "Boltyn Charge",
    cards: "Engulfing Light · Bolt of Courage",
    action:
      "Play Engulfing Light and charge Bolt of Courage. Verify the charged card travels from hand to the soul anchor and the soul count increases once.",
    route: "/flesh-and-blood/simulator/tests/boltyn-sabers-combo",
    pathKind: "both",
  },
];

export interface AnimationFixtureInventoryItem {
  readonly stepType:
    | "entityTransfer"
    | "emphasize"
    | "entityStateChange"
    | "effect"
    | "combat"
    | "valueDelta"
    | "phaseChange"
    | "randomization"
    | "comparison"
    | "gameResult"
    | "hold";
  readonly frameworkRole: string;
  readonly games: Readonly<Record<AnimationFixtureGameId, GameFixtureCase>>;
}

export const ANIMATION_FIXTURE_GAMES: readonly AnimationFixtureGame[] = [
  {
    id: "cyberpunk",
    label: "Cyberpunk 2077",
    summary: "9 ready · 1 partial",
    note: "The local adapter adds multi-stage choreography; the server adapter remains semantic and viewer-safe. Each row identifies the path it proves.",
  },
  {
    id: "flesh-and-blood",
    label: "Flesh and Blood",
    summary: "1 transfer · 10 disabled",
    note: "FAB moves cards from the previous board to the next board. Separate effects, combat overlays, and phase holds are disabled. Card faces follow viewer visibility during a transfer.",
  },
  {
    id: "gundam",
    label: "Gundam Card Game",
    summary: "7 ready · 1 partial",
    note: "Real VS AI fixtures cover the local packet mapper. The authoritative adapter maps the same canonical semantic step types.",
  },
  {
    id: "one-piece",
    label: "One Piece Card Game",
    summary: "3 of 10 step types",
    note: "Only the interactive practice route exercises the real transition provider; static visual fixtures are intentionally excluded.",
  },
  {
    id: "riftbound",
    label: "Riftbound",
    summary: "5 of 10 step types",
    note: "Riftbound maps explicit manual-tabletop actions and loads real cards from its official runtime catalog. Remote sync and replay navigation still snap.",
  },
] as const;

const riftboundMissing: GameFixtureCase = {
  status: "missing",
  fixture: "No semantic animation fixture",
  cards: "Runtime catalog only",
  action:
    "Add an engine-owned semantic event before creating a fixture. Do not infer movement from state diffs.",
  route: null,
};

export const ANIMATION_STEP_INVENTORY: readonly AnimationFixtureInventoryItem[] = [
  {
    stepType: "entityTransfer",
    frameworkRole: "Move, draw, play, reveal, attach, enter, or exit",
    games: {
      cyberpunk: {
        status: "ready",
        fixture: "Field Operator play and draw",
        cards: "Field Operator",
        action:
          "Play Field Operator. Verify the real card moves hand → field, Eddies float, and its even-Street-Cred draw enters the hand.",
        route: "/cyberpunk/simulator/tests/unitFieldOperatorRetail?ai=off&auto-advance-attack=off",
        pathKind: "local",
        caveat:
          "This single real command also covers card landing, resource timing, and a count-only deck draw.",
      },
      "flesh-and-blood": {
        status: "ready",
        fixture: "Snatch play, draw, and cleanup",
        cards: "Snatch · Rhinar · Bravo",
        action:
          "Play Snatch and close the chain after its hit. Verify one consistent transfer per displayed card move, an individual deck-to-hand draw, and cleanup to graveyard. No separate effect choreography.",
        route: "/flesh-and-blood/simulator/tests/dual-target-open",
        pathKind: "both",
      },
      gundam: {
        status: "ready",
        fixture: "Deploy unit demo",
        cards: "GM ST01-005 · Guncannon ST01-003 · Guntank ST01-004",
        action:
          "Deploy any unit from hand. Verify the same Gundam card renderer travels into the battle area and the hand reflows.",
        route: "/gundam/simulator/vs-ai?fixture=deploy-unit-demo",
        pathKind: "both",
      },
      "one-piece": {
        status: "ready",
        fixture: "ST-01 mirror practice",
        cards: "Roronoa Zoro ST01-013 · Gum-Gum Jet Pistol ST01-015",
        action:
          "Complete setup, then draw or play a card. Verify the engine result drives deck/hand/play/trash movement.",
        route: "/one-piece/simulator/play/practice",
        pathKind: "both",
      },
      riftbound: {
        status: "ready",
        fixture: "Official-catalog manual tabletop",
        cards: "Real Riftbound runtime catalog cards",
        action:
          "Draw a card or drag a card between registered zones. Verify the real card renderer moves and the source collection reflows.",
        route: "/riftbound/simulator/tests",
        pathKind: "local",
      },
    },
  },
  {
    stepType: "emphasize",
    frameworkRole: "Pulse or spotlight any registered entity, zone, player, or anchor",
    games: {
      cyberpunk: {
        status: "partial",
        fixture: "Authoritative card landing",
        cards: "Played Units",
        action:
          "The server adapter emits emphasize after a played Unit lands; local choreography represents the same event as an effect emphasis.",
        route: null,
        pathKind: "server",
      },
      "flesh-and-blood": {
        status: "disabled",
        fixture: "Instant state update",
        cards: "Current board state",
        action:
          "Intentionally disabled for FAB. The board and history show the updated state without an additional animation or playback hold.",
        route: null,
      },
      gundam: {
        status: "partial",
        fixture: "Unreachable server cardFlip mapping",
        cards: "No engine-produced cardFlip exists",
        action:
          "The server mapper understands cardFlip, but the engine does not produce it. State changes now use entityStateChange.",
        route: null,
        pathKind: "server",
      },
      "one-piece": {
        status: "missing",
        fixture: "No native event mapping",
        cards: "No honest real-card example",
        action: "The One Piece practice adapter never emits emphasize.",
        route: null,
      },
      riftbound: riftboundMissing,
    },
  },
  {
    stepType: "entityStateChange",
    frameworkRole: "Rotate, flip, or crossfade one real entity without changing zones",
    games: {
      cyberpunk: {
        status: "ready",
        fixture: "Corpo Security blocker reproduction",
        cards: "Swordwise Huscle · Corpo Security",
        action:
          "Attack with Swordwise Huscle or block with Corpo Security. Verify the same real card rotates from ready to spent.",
        route: "/cyberpunk/simulator/tests/unitCorpoSecurity?ai=off&auto-advance-attack=off",
        pathKind: "both",
      },
      "flesh-and-blood": {
        status: "disabled",
        fixture: "Instant state update",
        cards: "Current board state",
        action:
          "Intentionally disabled for FAB. The board and history show the updated state without an additional animation or playback hold.",
        route: null,
      },
      gundam: {
        status: "ready",
        fixture: "Command rest demo",
        cards: "Intercept Orders GD01-099 · target Unit",
        action:
          "Resolve Intercept Orders. Verify the target's real Gundam visual animates from ready to rested.",
        route: "/gundam/simulator/vs-ai?fixture=command-rest-demo",
        pathKind: "both",
      },
      "one-piece": {
        status: "missing",
        fixture: "No state-change mapping",
        cards: "Rested characters",
        action: "The One Piece adapter does not yet emit entityStateChange.",
        route: null,
      },
      riftbound: {
        status: "ready",
        fixture: "Official-catalog ready, rest, and flip",
        cards: "Real Riftbound runtime catalog card",
        action:
          "Use Ready / rest or Flip card. Verify the provider animates the real registered card without moving its zone.",
        route: "/riftbound/simulator/tests",
        pathKind: "local",
      },
    },
  },
  {
    stepType: "effect",
    frameworkRole: "Connect a semantic source to one or more targets",
    games: {
      cyberpunk: {
        status: "ready",
        fixture: "Live with the Aftermath",
        cards: "Live with the Aftermath · Mox Inciters · Corpo Security",
        action:
          "Play the Program, choose Mox Inciters, switch to P2, then choose Corpo Security. Verify the staged source, target effects, two exits, and source cleanup.",
        route:
          "/cyberpunk/simulator/tests/progLiveWithTheAftermathRetail?ai=off&auto-advance-attack=off",
        pathKind: "local",
      },
      "flesh-and-blood": {
        status: "disabled",
        fixture: "Instant state update",
        cards: "Current board state",
        action:
          "Intentionally disabled for FAB. The board and history show the updated state without an additional animation or playback hold.",
        route: null,
      },
      gundam: {
        status: "ready",
        fixture: "Command rest demo",
        cards: "Intercept Orders GD01-099",
        action:
          "Play the command and choose its targets. Verify command focus, target effect, and cleanup all use real card nodes.",
        route: "/gundam/simulator/vs-ai?fixture=command-rest-demo",
        pathKind: "local",
      },
      "one-piece": {
        status: "ready",
        fixture: "ST-01 mirror practice",
        cards: "Jinbe ST01-005 · DON!! attachment",
        action:
          "Attack with Jinbe or attach DON!! to a character. Verify the engine-provided effect targets the real board entity.",
        route: "/one-piece/simulator/play/practice",
        pathKind: "both",
      },
      riftbound: riftboundMissing,
    },
  },
  {
    stepType: "combat",
    frameworkRole: "Declare, block, redirect, or resolve combat",
    games: {
      cyberpunk: {
        status: "ready",
        fixture: "Corpo Security blocker reproduction",
        cards: "Swordwise Huscle · Corpo Security",
        action:
          "Attack with Swordwise Huscle, advance into React, take P2 control, and block with Corpo Security. Verify the blocker stays the real visual throughout redirect and exit.",
        route: "/cyberpunk/simulator/tests/unitCorpoSecurity?ai=off&auto-advance-attack=off",
        pathKind: "local",
      },
      "flesh-and-blood": {
        status: "disabled",
        fixture: "Instant state update",
        cards: "Current board state",
        action:
          "Intentionally disabled for FAB. The board and history show the updated state without an additional animation or playback hold.",
        route: null,
      },
      gundam: {
        status: "ready",
        fixture: "Base combat demo",
        cards: "Gundam ST01-001 · White Base ST01-015",
        action:
          "Declare a direct attack into the opposing base. Verify declaration and resolved damage target the real card/base nodes.",
        route: "/gundam/simulator/vs-ai?fixture=base-combat-demo",
        pathKind: "local",
      },
      "one-piece": {
        status: "ready",
        fixture: "ST-01 mirror practice",
        cards: "Jinbe ST01-005 · Monkey.D.Luffy ST01-001",
        action:
          "Reach the main phase and attack with a character or leader. Verify attacker and target remain the actual One Piece visuals.",
        route: "/one-piece/simulator/play/practice",
        pathKind: "both",
      },
      riftbound: riftboundMissing,
    },
  },
  {
    stepType: "valueDelta",
    frameworkRole: "Float gain, spend, or steal feedback at a registered anchor",
    games: {
      cyberpunk: {
        status: "ready",
        fixture: "Zetatech Faceplate trigger",
        cards: "Swordwise Huscle · Zetatech Faceplate",
        action:
          "Attack with the equipped Swordwise Huscle, select the friendly d8, and choose 4. Verify the Gear effect, Gig +1 resource float, and draw.",
        route: "/cyberpunk/simulator/tests/gearZetatechFaceplate?ai=off&auto-advance-attack=off",
        pathKind: "local",
      },
      "flesh-and-blood": {
        status: "disabled",
        fixture: "Instant state update",
        cards: "Current board state",
        action:
          "Intentionally disabled for FAB. The board and history show the updated state without an additional animation or playback hold.",
        route: null,
      },
      gundam: {
        status: "ready",
        fixture: "Resource Area judge fixture",
        cards: "Resource R-001",
        action:
          "Press Add Resource repeatedly. Verify each real Resource travels from the concealed Resource Deck into the public Resource Area, the row reflows, and the +1 RES callout clears.",
        route: "/gundam/simulator/vs-ai?fixture=resource-area-animation-demo",
        pathKind: "local",
        caveat:
          "The fixture uses a test-only judge action through the real zone API and native Gundam animation packet.",
      },
      "one-piece": {
        status: "missing",
        fixture: "DON!! is mapped as effect",
        cards: "Roronoa Zoro ST01-013",
        action: "DON!! attachment is an effect today; the adapter does not emit valueDelta.",
        route: null,
      },
      riftbound: {
        status: "ready",
        fixture: "Official-catalog counter delta",
        cards: "Real Riftbound runtime catalog card",
        action:
          "Use Add might. Verify the neutral value delta is anchored to the real card and clears before controls unblock.",
        route: "/riftbound/simulator/tests",
        pathKind: "local",
      },
    },
  },
  {
    stepType: "phaseChange",
    frameworkRole: "Announce a phase or turn boundary",
    games: {
      cyberpunk: {
        status: "ready",
        fixture: "Opening main-phase lifecycle",
        cards: "Board-level event · real retail fixture deck",
        action:
          "Advance/pass the phase. Verify the phase overlay remains visible while the next legal action is already available.",
        route: "/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off",
        pathKind: "both",
      },
      "flesh-and-blood": {
        status: "disabled",
        fixture: "Instant state update",
        cards: "Current board state",
        action:
          "Intentionally disabled for FAB. The board and history show the updated state without an additional animation or playback hold.",
        route: null,
      },
      gundam: {
        status: "ready",
        fixture: "Multi-turn demo",
        cards: "Board-level event · real starter cards",
        action:
          "End the turn and advance phases. Verify the overlay remains visible without delaying the strategy bot or next player.",
        route: "/gundam/simulator/vs-ai?fixture=multi-turn-demo",
        pathKind: "local",
      },
      "one-piece": {
        status: "missing",
        fixture: "No phase animation mapping",
        cards: "Board-level event",
        action:
          "The practice engine advances phases, but its animation adapter does not emit phaseChange.",
        route: null,
      },
      riftbound: riftboundMissing,
    },
  },
  {
    stepType: "randomization",
    frameworkRole: "Show a shuffle, die roll, coin flip, or random selection at a registered node",
    games: {
      cyberpunk: {
        status: "ready",
        fixture: "Start-of-turn Gig roll",
        cards: "Real retail fixture deck · real Gig die",
        action:
          "Advance into the next start phase. Verify the real Gig die reports its roll before moving from the fixer area.",
        route: "/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off",
        pathKind: "both",
      },
      "flesh-and-blood": {
        status: "disabled",
        fixture: "Instant state update",
        cards: "Current board state",
        action:
          "Intentionally disabled for FAB. The board and history show the updated state without an additional animation or playback hold.",
        route: null,
      },
      gundam: {
        status: "missing",
        fixture: "No randomization mapping",
        cards: "No honest real-card example",
        action: "The Gundam adapters do not currently emit randomization.",
        route: null,
      },
      "one-piece": {
        status: "missing",
        fixture: "No randomization mapping",
        cards: "No honest real-card example",
        action: "The One Piece adapter does not currently emit randomization.",
        route: null,
      },
      riftbound: {
        status: "ready",
        fixture: "Official-catalog deck shuffle",
        cards: "Real Riftbound runtime catalog deck",
        action:
          "Use Shuffle deck. Verify the registered deck shows the shuffle animation and command gating clears.",
        route: "/riftbound/simulator/tests",
        pathKind: "local",
      },
    },
  },
  {
    stepType: "gameResult",
    frameworkRole: "Present a viewer-relative victory, defeat, or draw for a terminal update",
    games: {
      cyberpunk: {
        status: "ready",
        fixture: "Fixture concession",
        cards: "Real retail fixture deck",
        action:
          "Concede from the game menu and confirm. Verify the result overlay is viewer-relative and settles before the end-game UI.",
        route: "/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off",
        pathKind: "both",
      },
      "flesh-and-blood": {
        status: "disabled",
        fixture: "Instant state update",
        cards: "Current board state",
        action:
          "Intentionally disabled for FAB. The board and history show the updated state without an additional animation or playback hold.",
        route: null,
      },
      gundam: {
        status: "missing",
        fixture: "No result mapping",
        cards: "Board-level event",
        action: "The Gundam adapters do not currently emit gameResult.",
        route: null,
      },
      "one-piece": {
        status: "missing",
        fixture: "No result mapping",
        cards: "Board-level event",
        action: "The One Piece adapter does not currently emit gameResult.",
        route: null,
      },
      riftbound: {
        status: "ready",
        fixture: "Official-catalog fixture victory",
        cards: "Real Riftbound runtime catalog tabletop",
        action: "Use Win game. Verify the local viewer sees VICTORY and the result overlay clears.",
        route: "/riftbound/simulator/tests",
        pathKind: "local",
      },
    },
  },
  {
    stepType: "comparison",
    frameworkRole: "Compare two revealed values while preserving both real card identities",
    games: {
      cyberpunk: {
        status: "missing",
        fixture: "No comparison event mapping",
        cards: "No engine-owned comparison event",
        action: "The Cyberpunk adapters do not emit the shared comparison step.",
        route: null,
      },
      "flesh-and-blood": {
        status: "disabled",
        fixture: "Instant state update",
        cards: "Current board state",
        action:
          "Intentionally disabled for FAB. The board and history show the updated state without an additional animation or playback hold.",
        route: null,
      },
      gundam: {
        status: "missing",
        fixture: "No comparison event mapping",
        cards: "No engine-owned comparison event",
        action: "The Gundam adapters do not emit the shared comparison step.",
        route: null,
      },
      "one-piece": {
        status: "missing",
        fixture: "No comparison event mapping",
        cards: "No honest real-card example",
        action: "The One Piece adapter does not emit comparison.",
        route: null,
      },
      riftbound: riftboundMissing,
    },
  },
  {
    stepType: "hold",
    frameworkRole: "Reserve deterministic timeline time without a spatial visual",
    games: {
      cyberpunk: {
        status: "ready",
        fixture: "Legend reveal choreography",
        cards: "Viktor Vektor — Sit Down and Relax",
        action:
          "Reveal the Legend. Verify transfer → hold → return stays command-blocked and clears without replacing the card visual.",
        route:
          "/cyberpunk/simulator/tests/legendViktorVektorSitDownAndRelax?ai=off&auto-advance-attack=off",
        pathKind: "both",
      },
      "flesh-and-blood": {
        status: "disabled",
        fixture: "Instant state update",
        cards: "Current board state",
        action:
          "Intentionally disabled for FAB. The board and history show the updated state without an additional animation or playback hold.",
        route: null,
      },
      gundam: {
        status: "ready",
        fixture: "Targetless command auto-resolution",
        cards: "A Show of Resolve GD01-100",
        action:
          "Play the targetless command. Verify its real command-focus card remains visible for the hold and cleans up afterward.",
        route: "/gundam/simulator/vs-ai?fixture=command-auto-resolve-demo",
        pathKind: "both",
      },
      "one-piece": {
        status: "partial",
        fixture: "Server generic fallback only",
        cards: "No local real-card fixture",
        action:
          "The server can fall back to hold, but the interactive practice adapter has no honest local event that emits it.",
        route: null,
        pathKind: "server",
      },
      riftbound: riftboundMissing,
    },
  },
] as const;

/**
 * FAB-owned Motion surfaces that sit outside animationPlan. Keeping them in
 * this catalog prevents a protocol-only audit from overstating UI coverage.
 */
export const FAB_MOTION_SURFACE_FIXTURES: readonly FabMotionSurfaceFixture[] = [
  {
    id: "priority-owner",
    surface: "Priority ownership signal",
    role: "Moves the board-edge marker when rules priority changes seats",
    status: "ready",
    fixture: "Scabskin priority handoff",
    cards: "Scabskin Leathers · Rhinar · Bravo",
    action:
      "Activate Scabskin, pass priority, take control of the opposing seat, then pass again. Verify the edge marker exits one board and enters the other before the die result resolves.",
    route: "/flesh-and-blood/simulator/tests/opening",
    pathKind: "both",
  },
  {
    id: "priority-countdown",
    surface: "Priority countdown",
    role: "Animates the visible auto-pass countdown without hiding the pass control",
    status: "missing",
    fixture: "No deterministic countdown preset",
    cards: "Board-level priority state",
    action:
      "Add a fixture preset that enables a short local countdown and holds at an interruptible priority window.",
    route: null,
  },
  {
    id: "active-effects",
    surface: "Active effects rail",
    role: "Introduces and removes effect cards without stealing focus from play",
    status: "ready",
    fixture: "Active effects lab",
    cards: "Authored cards with current continuous effects",
    action:
      "Open the fixture and verify effect entries settle into the center rail at their natural card aspect ratio.",
    route: "/flesh-and-blood/simulator/tests/active-effects-lab",
    pathKind: "both",
  },
  {
    id: "hero-signals",
    surface: "Hero signal pips",
    role: "Pulses newly active this-turn hero state at the affected hero edge",
    status: "ready",
    fixture: "Boltyn bottom-edge signals",
    cards: "Boltyn",
    action:
      "Open the fixture and verify each signal pip scales in independently while its popover remains keyboard accessible.",
    route: "/flesh-and-blood/simulator/tests/hero-signal-boltyn-bottom",
    pathKind: "both",
  },
  {
    id: "combat-workspace",
    surface: "Combat workspace",
    role: "Recomposes the stack and combat bridge as an attack advances",
    status: "ready",
    fixture: "Active effects combat lab",
    cards: "Crippling Crush · real defending cards",
    action:
      "Open the in-combat fixture and verify the combat workspace, chain link, and active-effects rail remain readable together.",
    route: "/flesh-and-blood/simulator/tests/active-effects-combat-lab",
    pathKind: "both",
  },
  {
    id: "postgame-summary",
    surface: "Post-game summary",
    role: "Keeps every post-game layout state directly inspectable",
    status: "ready",
    fixture: "Attack action lethal → post-game summary",
    cards: "Authored Rhinar and Tuffnut tournament decks",
    action:
      "Open the fixture directly, switch game and match tabs, and use outcome, scope, tab, and premium query parameters to inspect responsive extremes.",
    route: "/flesh-and-blood/simulator/tests/attack-action-lethal",
    pathKind: "local",
  },
  {
    id: "practice-view-transition",
    surface: "Practice setup transition",
    role: "Transitions setup → sideboard → match without remounting the whole shell",
    status: "partial",
    fixture: "Interactive practice flow only",
    cards: "Registered deck and authored equipment",
    action:
      "Complete practice setup and sideboarding. A dedicated deterministic transition fixture is still missing.",
    route: "/flesh-and-blood/simulator/play/practice",
    pathKind: "local",
  },
  {
    id: "bot-thinking",
    surface: "Bot thinking indicator",
    role: "Keeps the simulator responsive while the local bot chooses a move",
    status: "missing",
    fixture: "No deterministic thinking-state fixture",
    cards: "Board-level bot state",
    action: "Add a bounded fixture that holds the bot in thinking state long enough for visual QA.",
    route: null,
  },
] as const;

/**
 * Real engine actions that intentionally compose more than one protocol step.
 * Keep these separate from ANIMATION_STEP_INVENTORY so the capability matrix
 * remains an honest one-per-step-type inventory.
 */
export const ANIMATION_SEQUENCE_FIXTURES: readonly AnimationSequenceFixture[] = [
  {
    id: "fab-snatch-combat",
    label: "Play through hit and draw",
    stepTypes: ["entityTransfer"],
    games: {
      "flesh-and-blood": {
        status: "ready",
        fixture: "Snatch full combat lifecycle",
        cards: "Snatch · Rhinar · Bravo",
        action:
          "Play Snatch and resolve the chain without defending. Verify movement to the displayed combat chain, an individual draw into hand, and movement to graveyard on cleanup. Damage and triggers update without extra choreography.",
        route: "/flesh-and-blood/simulator/tests/dual-target-open",
        pathKind: "both",
      },
    },
  },
  {
    id: "fab-multiple-card-defense",
    label: "Fan multiple defenders",
    stepTypes: ["entityTransfer"],
    games: {
      "flesh-and-blood": {
        status: "ready",
        fixture: "Choose defenders against Snatch",
        cards: "Snatch · Enlightened Strike · Helm of Isen’s Peak",
        action:
          "Select defending cards, then confirm. Verify selections remain in their original zones, then each confirmed defender moves to the chain once.",
        route: "/flesh-and-blood/simulator/tests/defend-open",
        pathKind: "both",
      },
    },
  },
  {
    id: "fab-pitch-stack-return",
    label: "Return the pitch stack",
    stepTypes: ["entityTransfer"],
    games: {
      "flesh-and-blood": {
        status: "ready",
        fixture: "Endgame end phase",
        cards: "Two pitched Disable · Bravo",
        action:
          "End the turn, choose an arsenal card or none, and confirm pitch order. Verify each pitched card moves to deck and each drawn card enters hand without a phase banner.",
        route: "/flesh-and-blood/simulator/tests/endgame",
        pathKind: "both",
      },
    },
  },
  {
    id: "fab-life-feedback",
    label: "Gain, lose, and deal damage",
    stepTypes: ["effect", "valueDelta"],
    games: {
      "flesh-and-blood": {
        status: "ready",
        fixture: "Poison, Sigil, and Flash Bolt",
        cards: "Poison the Well · Sigil of Solace · Flash Bolt",
        action:
          "Resolve the three instants in sequence. Verify the life symbol, sign, tone, target line, and cue distinguish gain, replacement life loss, and damage.",
        route: "/flesh-and-blood/simulator/tests/poison-sigil-damage",
        pathKind: "both",
      },
    },
  },
  {
    id: "gundam-mulligan-redraw",
    label: "Setup sequence",
    stepTypes: ["entityTransfer"],
    games: {
      gundam: {
        status: "ready",
        fixture: "Mulligan redraw",
        cards: "Five-card opening Hand · five-card replacement Hand",
        action:
          "Choose Redraw Hand. Verify the changed opening cards return to the Deck Area first, then five replacements travel into Hand and reveal to their owner.",
        route: "/gundam/simulator/vs-ai?fixture=mulligan-animation-demo",
        pathKind: "local",
        caveat:
          "Runs the real alterHand move. Player Two remains pending so the fixture settles before post-mulligan setup begins.",
      },
    },
  },
] as const;

function fabAudioFixture(
  cue: SimulatorAudioCueId,
  role: string,
  fixture: GameFixtureCase,
): AudioCueFixture {
  return {
    cue,
    role,
    games: {
      "flesh-and-blood":
        cue === "card.draw" || cue === "card.move"
          ? fixture
          : {
              status: "disabled",
              fixture: "Available for audition",
              cards: "Shared sound library",
              action:
                "This cue can be auditioned here but is not scheduled by FAB's transfer-only playback.",
              route: null,
            },
    },
  };
}

/**
 * Sound-recipe and FAB runtime coverage. Every cue in the shared protocol is
 * listed, including cues that FAB can translate but does not yet reach from a
 * deterministic public fixture and cues that FAB intentionally does not emit.
 */
export const AUDIO_CUE_FIXTURES: readonly AudioCueFixture[] = [
  fabAudioFixture("card.draw", "Card enters a hand", {
    status: "ready",
    fixture: "Snatch hit draw",
    cards: "Snatch",
    action: "Resolve an undefended Snatch hit and hear the drawn card enter hand.",
    route: "/flesh-and-blood/simulator/tests/dual-target-open",
    pathKind: "both",
  }),
  fabAudioFixture("card.move", "General zone transfer", {
    status: "ready",
    fixture: "Declare a block",
    cards: "Enlightened Strike",
    action: "Block Snatch and hear the hand card travel to the combat chain.",
    route: "/flesh-and-blood/simulator/tests/defend-open",
    pathKind: "both",
  }),
  fabAudioFixture("card.play", "Card announced onto the stack", {
    status: "ready",
    fixture: "Play Snatch",
    cards: "Snatch",
    action: "Play Snatch from hand and hear the card layer enter the stack.",
    route: "/flesh-and-blood/simulator/tests/dual-target-open",
    pathKind: "both",
  }),
  fabAudioFixture("card.discard", "Card discarded to graveyard", {
    status: "ready",
    fixture: "Activate from hand",
    cards: "Cosmic Duality",
    action: "Choose Activate and hear Cosmic Duality discard as the instant cost.",
    route: "/flesh-and-blood/simulator/tests/hand-play-or-activate",
    pathKind: "both",
  }),
  fabAudioFixture("card.destroy", "Permanent destroyed", {
    status: "missing",
    fixture: "Authored destruction fixture required",
    cards: "No compliant authored-card fixture",
    action:
      "Add a legal authored-card fixture that destroys a permanent. The synthetic Trigger Lab Aura does not count as browser proof.",
    route: null,
  }),
  fabAudioFixture("card.reveal", "Hidden card becomes public", {
    status: "ready",
    fixture: "Fusion reveal",
    cards: "Entwine Ice · Blizzard",
    action: "Fuse Entwine Ice by revealing Blizzard and hear the authored card become public.",
    route: "/flesh-and-blood/simulator/tests/boost-fusion-lab",
    pathKind: "both",
  }),
  fabAudioFixture("deck.shuffle", "Randomize a deck", {
    status: "missing",
    fixture: "Authored shuffle fixture required",
    cards: "No compliant authored-card fixture",
    action:
      "Add a legal authored-card fixture that shuffles a deck. Shuffle Lab Hood is synthetic and does not count.",
    route: null,
  }),
  fabAudioFixture("resource.gain", "Pitch generates resources", {
    status: "ready",
    fixture: "Pitch for lethal attack",
    cards: "Splatter Skull · blue pitch card",
    action: "Pitch the blue card while playing Splatter Skull and hear resources increase.",
    route: "/flesh-and-blood/simulator/tests/attack-action-lethal",
    pathKind: "both",
  }),
  fabAudioFixture("resource.spend", "Pay a resource cost", {
    status: "ready",
    fixture: "Pay for lethal attack",
    cards: "Splatter Skull",
    action: "Complete the pitched play and hear the resource payment resolve.",
    route: "/flesh-and-blood/simulator/tests/attack-action-lethal",
    pathKind: "both",
  }),
  fabAudioFixture("resource.steal", "Transfer resources between players", {
    status: "missing",
    fixture: "Not emitted by FAB",
    cards: "No FAB committed event",
    action: "The shared recipe exists, but the FAB adapter has no resource-steal semantic event.",
    route: null,
  }),
  fabAudioFixture("life.gain", "Hero gains life", {
    status: "ready",
    fixture: "Sigil of Solace",
    cards: "Sigil of Solace",
    action: "Resolve Sigil without replacement and hear the positive life delta.",
    route: "/flesh-and-blood/simulator/tests/poison-sigil-damage",
    pathKind: "both",
  }),
  fabAudioFixture("life.loss", "Hero loses life without damage", {
    status: "ready",
    fixture: "Poison replaces life gain",
    cards: "Poison the Well · Sigil of Solace",
    action: "Resolve Poison, then Sigil, and hear the replaced gain become life loss.",
    route: "/flesh-and-blood/simulator/tests/poison-sigil-damage",
    pathKind: "both",
  }),
  fabAudioFixture("combat.start", "Attack target declared", {
    status: "ready",
    fixture: "Snatch attack",
    cards: "Snatch",
    action: "Resolve the Snatch card layer and hear the attack declaration.",
    route: "/flesh-and-blood/simulator/tests/dual-target-open",
    pathKind: "both",
  }),
  fabAudioFixture("combat.hit", "Damage connects", {
    status: "ready",
    fixture: "Snatch hit",
    cards: "Snatch",
    action: "Leave Snatch undefended and hear the damage event at the life anchor.",
    route: "/flesh-and-blood/simulator/tests/dual-target-open",
    pathKind: "both",
  }),
  fabAudioFixture("combat.block", "Defense declaration completes", {
    status: "ready",
    fixture: "Block Snatch",
    cards: "Enlightened Strike",
    action: "Declare the block and hear the blocked combat state.",
    route: "/flesh-and-blood/simulator/tests/defend-open",
    pathKind: "both",
  }),
  fabAudioFixture("damage.prevent", "Damage prevention applies", {
    status: "ready",
    fixture: "Holo Shield Ward",
    cards: "Holo Shield (Red) · Zero to Sixty (Red)",
    action: "Resolve the attack into Ward 1 and hear the authored Aura prevent damage.",
    route: "/flesh-and-blood/simulator/tests/phantasm-ward-lab",
    pathKind: "both",
  }),
  fabAudioFixture("effect.trigger", "Ability or effect fires", {
    status: "ready",
    fixture: "Snatch hit trigger",
    cards: "Snatch",
    action: "Resolve the authored attack's hit trigger and hear its draw layer fire.",
    route: "/flesh-and-blood/simulator/tests/dual-target-open",
    pathKind: "both",
  }),
  fabAudioFixture("phase.change", "Phase boundary", {
    status: "ready",
    fixture: "End the turn",
    cards: "Board-level event",
    action: "End the action phase and hear the phase boundary before cleanup.",
    route: "/flesh-and-blood/simulator/tests/endgame",
    pathKind: "both",
  }),
  fabAudioFixture("turn.change", "Next player takes the turn", {
    status: "ready",
    fixture: "Advance turn",
    cards: "Board-level event",
    action: "Finish the end phase and hear the next-turn announcement.",
    route: "/flesh-and-blood/simulator/tests/endgame",
    pathKind: "both",
  }),
  fabAudioFixture("random.die", "Die result", {
    status: "ready",
    fixture: "Scabskin Leathers",
    cards: "Scabskin Leathers",
    action:
      "Activate Scabskin, pass priority, take over the opponent seat, then pass again and hear the d6 result.",
    route: "/flesh-and-blood/simulator/tests/opening",
    pathKind: "both",
  }),
  fabAudioFixture("random.coin", "Coin result", {
    status: "partial",
    fixture: "Adapter mapping only",
    cards: "No deterministic coin-flip fixture",
    action:
      "A two-sided FAB roll maps to this cue, but the current fixture catalog has no public case.",
    route: null,
    pathKind: "server",
  }),
  fabAudioFixture("game.win", "Viewer wins", {
    status: "ready",
    fixture: "Attack-action lethal",
    cards: "Splatter Skull",
    action: "Resolve lethal as the attacking viewer and hear the victory cue.",
    route: "/flesh-and-blood/simulator/tests/attack-action-lethal",
    pathKind: "both",
  }),
  fabAudioFixture("game.loss", "Viewer loses", {
    status: "ready",
    fixture: "Viewer-relative lethal result",
    cards: "Splatter Skull",
    action: "The same terminal event maps to defeat for the losing viewer.",
    route: "/flesh-and-blood/simulator/tests/attack-action-lethal",
    pathKind: "both",
  }),
] as const;
