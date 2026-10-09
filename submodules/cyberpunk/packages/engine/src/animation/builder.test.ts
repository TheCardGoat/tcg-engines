import { describe, expect, it } from "vite-plus/test";
import { buildAnimationScript } from "./builder.ts";
import { ANIMATION_DURATIONS_MS } from "./durations.ts";
import { asCardInstanceId, asPlayerId } from "../types/branded.ts";
import type { GameEvent, DefeatedCardSnapshot } from "../types/game-events.ts";
import type {
  ActionEmphasisStep,
  CardAttachStep,
  CardEnterStep,
  CardExitStep,
  EffectTargetStep,
  CardMoveStep,
  CardRevealStep,
  GigMoveStep,
  LegendRevealStep,
  PhaseChangeStep,
  ResourceFloatStep,
} from "./types.ts";

const cid = (s: string) => asCardInstanceId(s);
const pid = (s: string) => asPlayerId(s);
const defeatedSnapshot = (controllerId: string): DefeatedCardSnapshot => ({
  controllerId: pid(controllerId),
  zone: "field",
  cardTypes: ["unit"],
  color: "red",
  classifications: [],
  keywords: [],
  spent: false,
  faceDown: false,
  hasLag: false,
  cost: 0,
  effectivePower: 0,
  attachedGearIds: [],
  attachedToId: null,
});
const dieId = (s: string): import("../types/branded.ts").GigDieId =>
  s as unknown as import("../types/branded.ts").GigDieId;

describe("buildAnimationScript", () => {
  it("returns an empty script for no events", () => {
    const script = buildAnimationScript([]);
    expect(script.steps).toEqual([]);
    expect(script.totalDurationMs).toBe(0);
  });

  it("emits a single cardMove step for a cardMoved event", () => {
    const events: GameEvent[] = [
      {
        type: "cardMoved",
        cardId: cid("c1"),
        fromZone: "hand",
        toZone: "field",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps).toHaveLength(1);
    const step = script.steps[0] as CardMoveStep;
    expect(step.kind).toBe("cardMove");
    expect(step.cardId).toBe("c1");
    expect(step.fromZone).toBe("hand");
    expect(step.toZone).toBe("field");
    expect(step.playerId).toBe("p1");
    expect(step.startMs).toBe(0);
    expect(step.durationMs).toBe(ANIMATION_DURATIONS_MS.handPlay);
    expect(script.totalDurationMs).toBe(ANIMATION_DURATIONS_MS.handPlay);
  });

  it("emits a resourceFloat step in parallel with a card move", () => {
    const events: GameEvent[] = [
      {
        type: "cardMoved",
        cardId: cid("c1"),
        fromZone: "hand",
        toZone: "field",
        playerId: pid("p1"),
      },
      {
        type: "eddiesSpent",
        playerId: pid("p1"),
        amount: 3,
        forWhat: "playCard",
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps).toHaveLength(2);
    const move = script.steps[0] as CardMoveStep;
    const float = script.steps[1] as ResourceFloatStep;

    // Move runs first; float overlaps starting at move.start + duration.
    // Cursor only advances on move; float reads cursor *after* the move (its
    // start = move's end). Total duration is max(cursor, float end).
    expect(move.startMs).toBe(0);
    expect(float.kind).toBe("resourceFloat");
    expect(float.startMs).toBe(ANIMATION_DURATIONS_MS.handPlay);
    expect(float.delta).toBe(-3);
    expect(script.totalDurationMs).toBe(
      ANIMATION_DURATIONS_MS.handPlay + ANIMATION_DURATIONS_MS.resourceFloat,
    );
  });

  it("emits a resourceFloat for eddiesGained with a positive delta", () => {
    const events: GameEvent[] = [{ type: "eddiesGained", playerId: pid("p1"), amount: 2 }];

    const script = buildAnimationScript(events);
    const step = script.steps[0] as ResourceFloatStep;
    expect(step.delta).toBe(2);
    expect(step.startMs).toBe(0);
  });

  it("emits a cardExit step for cardDefeated and suppresses the paired cardMoved", () => {
    const events: GameEvent[] = [
      {
        type: "cardDefeated",
        cardId: cid("c1"),
        snapshot: defeatedSnapshot("p1"),
        defeatedBy: null,
        playerId: pid("p1"),
      },
      {
        type: "cardMoved",
        cardId: cid("c1"),
        fromZone: "field",
        toZone: "trash",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps).toHaveLength(1);
    const exit = script.steps[0] as CardExitStep;
    expect(exit.kind).toBe("cardExit");
    expect(exit.exitReason).toBe("defeated");
    expect(exit.cardId).toBe("c1");
    expect(exit.fromZone).toBe("field");
    expect(exit.toZone).toBe("trash");
    expect(exit.startMs).toBe(0);
    expect(exit.durationMs).toBe(ANIMATION_DURATIONS_MS.cardExit);
  });

  it("emits a cardExit for cardSold and suppresses the paired move", () => {
    const events: GameEvent[] = [
      { type: "cardSold", cardId: cid("c1"), playerId: pid("p1") },
      {
        type: "cardMoved",
        cardId: cid("c1"),
        fromZone: "hand",
        toZone: "trash",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toHaveLength(1);
    const exit = script.steps[0] as CardExitStep;
    expect(exit.exitReason).toBe("sold");
    expect(exit.fromZone).toBe("hand");
    expect(exit.toZone).toBe("trash");
  });

  it("sequences multiple card moves and accumulates total duration", () => {
    const events: GameEvent[] = [
      {
        type: "cardMoved",
        cardId: cid("a"),
        fromZone: "hand",
        toZone: "field",
        playerId: pid("p1"),
      },
      {
        type: "cardMoved",
        cardId: cid("b"),
        fromZone: "hand",
        toZone: "field",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toHaveLength(2);
    expect(script.steps[0].startMs).toBe(0);
    expect(script.steps[1].startMs).toBe(ANIMATION_DURATIONS_MS.handPlay);
    expect(script.totalDurationMs).toBe(ANIMATION_DURATIONS_MS.handPlay * 2);
  });

  it("produces deterministic output for identical input", () => {
    const events: GameEvent[] = [
      {
        type: "cardMoved",
        cardId: cid("c1"),
        fromZone: "hand",
        toZone: "field",
        playerId: pid("p1"),
      },
      { type: "eddiesSpent", playerId: pid("p1"), amount: 1, forWhat: "play" },
    ];

    const a = buildAnimationScript(events);
    const b = buildAnimationScript(events);
    expect(a).toEqual(b);
  });

  it("assigns sequential step ids", () => {
    const events: GameEvent[] = [
      {
        type: "cardMoved",
        cardId: cid("a"),
        fromZone: "hand",
        toZone: "field",
        playerId: pid("p1"),
      },
      { type: "eddiesSpent", playerId: pid("p1"), amount: 1, forWhat: "play" },
    ];

    const ids = buildAnimationScript(events).steps.map((s) => s.id);
    expect(ids).toEqual(["step-0", "step-1"]);
  });

  it("plays both legend-zone shuffles together", () => {
    const events: GameEvent[] = [
      { type: "legendsShuffled", playerId: pid("p1") },
      { type: "legendsShuffled", playerId: pid("p2") },
    ];
    const script = buildAnimationScript(events);
    expect(script.steps).toMatchObject([
      {
        kind: "randomization",
        randomization: "shuffle",
        zone: "legendArea",
        playerId: pid("p1"),
        startMs: 0,
        durationMs: ANIMATION_DURATIONS_MS.randomization,
        reason: "legendsShuffled",
      },
      {
        kind: "randomization",
        randomization: "shuffle",
        zone: "legendArea",
        playerId: pid("p2"),
        startMs: 0,
        durationMs: ANIMATION_DURATIONS_MS.randomization,
      },
    ]);
    expect(script.totalDurationMs).toBe(ANIMATION_DURATIONS_MS.randomization);
  });

  it("ignores turn boundary events already represented by phase changes", () => {
    const events: GameEvent[] = [
      { type: "turnStarted", playerId: pid("p1"), turnNumber: 1 },
      { type: "turnEnded", playerId: pid("p1"), turnNumber: 1 },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toEqual([]);
    expect(script.totalDurationMs).toBe(0);
  });

  it("animates a deck shuffle after parallel spend and ready changes", () => {
    const events: GameEvent[] = [
      { type: "cardSpent", cardId: cid("unit"), playerId: pid("p1") },
      { type: "cardReadied", cardId: cid("unit"), playerId: pid("p1") },
      { type: "deckShuffled", playerId: pid("p1") },
      {
        type: "gigDieRolled",
        dieId: dieId("d8"),
        dieType: "d8",
        result: 6,
        playerId: pid("p1"),
        origin: "gainGig",
      },
      { type: "gameEnded", winnerId: pid("p1"), reason: "seven gigs" },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps.filter((step) => step.kind === "entityStateChange")).toMatchObject([
      { change: "spent", startMs: 0, durationMs: ANIMATION_DURATIONS_MS.entityStateChange },
      { change: "readied", startMs: 0, durationMs: ANIMATION_DURATIONS_MS.entityStateChange },
    ]);
    expect(script.steps.find((step) => step.reason === "deckShuffled")).toMatchObject({
      kind: "randomization",
      zone: "deck",
      startMs: 0,
      durationMs: ANIMATION_DURATIONS_MS.randomization,
    });
    expect(script.totalDurationMs).toBe(ANIMATION_DURATIONS_MS.randomization);
  });

  it("starts a move paid for by a tap immediately", () => {
    const events: GameEvent[] = [
      { type: "cardSpent", cardId: cid("legend"), playerId: pid("p1") },
      {
        type: "cardMoved",
        cardId: cid("u1"),
        fromZone: "hand",
        toZone: "field",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);
    const move = script.steps.find((step) => step.kind === "cardMove");
    expect(move?.startMs).toBe(0);
  });

  it("runs turn-start readies and the draw under the turn banner", () => {
    const events: GameEvent[] = [
      { type: "phaseChanged", from: "main", to: "start", playerId: pid("p1") },
      { type: "turnStarted", playerId: pid("p2"), turnNumber: 2 },
      { type: "cardReadied", cardId: cid("u1"), playerId: pid("p2") },
      { type: "cardReadied", cardId: cid("u2"), playerId: pid("p2") },
      { type: "cardsDrawn", cardIds: [cid("d1")], count: 1, playerId: pid("p2") },
    ];

    const script = buildAnimationScript(events);

    const readies = script.steps.filter((step) => step.kind === "entityStateChange");
    expect(readies).toMatchObject([
      { cardId: "u1", change: "readied", startMs: 0 },
      { cardId: "u2", change: "readied", startMs: 0 },
    ]);
    const draw = script.steps.find((step) => step.kind === "cardEnter");
    expect(draw?.startMs).toBe(0);
    expect(script.totalDurationMs).toBe(ANIMATION_DURATIONS_MS.phaseChange);
  });

  it("emits only the field transfer for a played unit", () => {
    const events: GameEvent[] = [
      {
        type: "cardMoved",
        cardId: cid("u1"),
        fromZone: "hand",
        toZone: "field",
        playerId: pid("p1"),
      },
      { type: "cardPlayed", cardId: cid("u1"), playerId: pid("p1"), cost: 2 },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toHaveLength(1);
    const move = script.steps[0] as CardMoveStep;
    expect(move.kind).toBe("cardMove");
    expect(move.toZone).toBe("field");
  });

  it("does not emit extra steps for a played card that lands in trash (program)", () => {
    const events: GameEvent[] = [
      {
        type: "cardMoved",
        cardId: cid("p1"),
        fromZone: "hand",
        toZone: "trash",
        playerId: pid("p1"),
      },
      { type: "cardPlayed", cardId: cid("p1"), playerId: pid("p1"), cost: 1 },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps.map((s) => s.kind)).toEqual(["cardMove"]);
  });

  it("choreographs a targeted program that defeats a card into trash", () => {
    const events: GameEvent[] = [
      {
        type: "cardMoved",
        cardId: cid("prog"),
        fromZone: "hand",
        toZone: "trash",
        playerId: pid("p1"),
      },
      { type: "cardPlayed", cardId: cid("prog"), playerId: pid("p1"), cost: 3 },
      {
        type: "effectTargeted",
        sourceCardId: cid("prog"),
        targets: [{ kind: "card", cardId: cid("target") }],
        playerId: pid("p1"),
      },
      {
        type: "cardDefeated",
        cardId: cid("target"),
        snapshot: defeatedSnapshot("p2"),
        defeatedBy: cid("prog"),
        playerId: pid("p2"),
      },
      {
        type: "cardMoved",
        cardId: cid("target"),
        fromZone: "field",
        toZone: "trash",
        playerId: pid("p2"),
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps.map((s) => s.kind)).toEqual(["cardMove", "effectTarget", "cardExit"]);
    const playMove = script.steps[0] as CardMoveStep;
    const targeting = script.steps[1] as EffectTargetStep;
    const defeated = script.steps[2] as CardExitStep;
    expect(playMove.cardId).toBe("prog");
    expect(playMove.fromZone).toBe("hand");
    expect(playMove.toZone).toBe("trash");
    expect(targeting).toMatchObject({
      sourceCardId: "prog",
      targets: [{ kind: "card", cardId: "target" }],
      label: "Defeat",
      tone: "negative",
    });
    expect(defeated.cardId).toBe("target");
    expect(defeated.fromZone).toBe("field");
    expect(defeated.toZone).toBe("trash");
    expect(defeated.startMs).toBe(
      ANIMATION_DURATIONS_MS.cardMove + ANIMATION_DURATIONS_MS.effectTargetImpactDelayMs,
    );
    expect(defeated.startMs).toBeLessThan(targeting.startMs + targeting.durationMs);
  });

  it("emits a cardAttach for cardAttached and suppresses the gear's cardMove", () => {
    const events: GameEvent[] = [
      {
        type: "cardMoved",
        cardId: cid("gear1"),
        fromZone: "hand",
        toZone: "field",
        playerId: pid("p1"),
      },
      { type: "cardAttached", gearId: cid("gear1"), hostId: cid("host1"), playerId: pid("p1") },
      { type: "cardPlayed", cardId: cid("gear1"), playerId: pid("p1"), cost: 1 },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps.map((s) => s.kind)).toEqual(["cardAttach"]);
    const attach = script.steps[0] as CardAttachStep;
    expect(attach.gearId).toBe("gear1");
    expect(attach.hostId).toBe("host1");
    expect(attach.durationMs).toBe(800);
  });

  it("starts a targeted card move at the effect impact beat", () => {
    const events: GameEvent[] = [
      {
        type: "effectTargeted",
        sourceCardId: cid("prog"),
        targets: [
          { kind: "card", cardId: cid("u1") },
          { kind: "gig", dieId: dieId("d20-1") },
        ],
        playerId: pid("p1"),
      },
      {
        type: "cardMoved",
        cardId: cid("u1"),
        fromZone: "field",
        toZone: "trash",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps.map((s) => s.kind)).toEqual(["effectTarget", "cardMove"]);
    const effect = script.steps[0] as EffectTargetStep;
    const move = script.steps[1] as CardMoveStep;
    expect(effect.targets).toHaveLength(2);
    expect(move.startMs).toBe(ANIMATION_DURATIONS_MS.effectTargetImpactDelayMs);
    expect(move.cardId).toBe("u1");
  });

  it("ignores effectTargeted when targets is empty", () => {
    const events: GameEvent[] = [
      {
        type: "effectTargeted",
        sourceCardId: cid("prog"),
        targets: [],
        playerId: pid("p1"),
      },
    ];
    expect(buildAnimationScript(events).steps).toEqual([]);
  });

  it("emits a legendReveal step for a called legend", () => {
    const events: GameEvent[] = [
      { type: "legendFlipped", cardId: cid("legend-1"), playerId: pid("p1") },
      { type: "legendCalled", cardId: cid("legend-1"), playerId: pid("p1") },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps).toHaveLength(1);
    const reveal = script.steps[0] as LegendRevealStep;
    expect(reveal.kind).toBe("legendReveal");
    expect(reveal.reason).toBe("legendCalled");
    expect(reveal.cardId).toBe("legend-1");
    expect(reveal.playerId).toBe("p1");
    expect(reveal.fromRotationDeg).toBe(0);
    expect(reveal.toRotationDeg).toBe(0);
    expect(reveal.durationMs).toBe(ANIMATION_DURATIONS_MS.legendReveal);
    expect(script.totalDurationMs).toBe(ANIMATION_DURATIONS_MS.legendReveal);
  });

  it("combines a called Legend paying for itself into one face-and-orientation change", () => {
    const events: GameEvent[] = [
      { type: "cardSpent", cardId: cid("legend-1"), playerId: pid("p1") },
      { type: "eddiesSpent", playerId: pid("p1"), amount: 1, forWhat: "callLegend" },
      { type: "legendCalled", cardId: cid("legend-1"), playerId: pid("p1") },
    ];

    const script = buildAnimationScript(events);
    const stateChanges = script.steps.filter(
      (step) => step.kind === "legendReveal" || step.kind === "entityStateChange",
    );

    expect(stateChanges).toHaveLength(1);
    expect(stateChanges[0]).toMatchObject({
      kind: "legendReveal",
      cardId: "legend-1",
      fromRotationDeg: 0,
      toRotationDeg: 90,
    });
  });

  it("emits staggered cardReveal steps for public revealed cards", () => {
    const events: GameEvent[] = [
      {
        type: "cardsRevealed",
        audience: "public",
        playerId: pid("p1"),
        ownerId: pid("p1"),
        fromZone: "deck",
        cardIds: [cid("top-1"), cid("top-2")],
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps).toHaveLength(2);
    const stagger = ANIMATION_DURATIONS_MS.drawStaggerMs;
    expect(stagger).toBe(800);
    script.steps.forEach((step, idx) => {
      const reveal = step as CardRevealStep;
      expect(reveal.kind).toBe("cardReveal");
      expect(reveal.reason).toBe("cardsRevealed");
      expect(reveal.cardId).toBe(idx === 0 ? "top-1" : "top-2");
      expect(reveal.fromZone).toBe("deck");
      expect(reveal.toZone).toBeUndefined();
      expect(reveal.ownerId).toBe("p1");
      expect(reveal.audience).toBe("public");
      expect(reveal.viewerId).toBe("p1");
      expect(reveal.startMs).toBe(idx * stagger);
      expect(reveal.durationMs).toBe(ANIMATION_DURATIONS_MS.cardReveal);
    });
    expect(script.totalDurationMs).toBe(stagger + ANIMATION_DURATIONS_MS.cardReveal);
  });

  it("carries the private viewer list onto rival-chosen reveal steps", () => {
    const events: GameEvent[] = [
      {
        type: "cardsRevealed",
        audience: "private",
        playerId: pid("p2"),
        viewers: [pid("p1"), pid("p2")],
        ownerId: pid("p1"),
        fromZone: "deck",
        cardIds: [cid("top-1")],
      },
    ];

    const script = buildAnimationScript(events);

    const reveal = script.steps[0] as CardRevealStep;
    expect(reveal.kind).toBe("cardReveal");
    expect(reveal.audience).toBe("private");
    expect(reveal.viewerId).toBe("p2");
    expect(reveal.viewerIds).toEqual(["p1", "p2"]);
  });

  it("folds revealed card destination moves into the reveal steps", () => {
    const events: GameEvent[] = [
      {
        type: "cardsRevealed",
        audience: "public",
        playerId: pid("p1"),
        ownerId: pid("p1"),
        fromZone: "deck",
        cardIds: [cid("top-1"), cid("top-2")],
      },
      {
        type: "cardMoved",
        cardId: cid("top-1"),
        fromZone: "deck",
        toZone: "hand",
        playerId: pid("p1"),
      },
      {
        type: "cardMoved",
        cardId: cid("top-2"),
        fromZone: "deck",
        toZone: "trash",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps.map((step) => step.kind)).toEqual(["cardReveal", "cardReveal"]);
    const firstReveal = script.steps[0] as CardRevealStep;
    const secondReveal = script.steps[1] as CardRevealStep;
    expect(firstReveal.cardId).toBe("top-1");
    expect(firstReveal.toZone).toBe("hand");
    expect(secondReveal.cardId).toBe("top-2");
    expect(secondReveal.toZone).toBe("trash");
  });

  it("keeps bottom placement when a revealed deck card returns to the deck", () => {
    const script = buildAnimationScript([
      {
        type: "cardsRevealed",
        audience: "public",
        playerId: pid("p1"),
        ownerId: pid("p1"),
        fromZone: "deck",
        cardIds: [cid("top-1")],
      },
      {
        type: "cardMoved",
        cardId: cid("top-1"),
        fromZone: "deck",
        toZone: "deck",
        deckPlacement: "bottom",
        playerId: pid("p1"),
      },
    ]);

    expect(script.steps).toMatchObject([
      { kind: "cardReveal", cardId: "top-1", toZone: "deck", deckPlacement: "bottom" },
    ]);
  });

  it("folds Hanako-style searched matches into reveal-to-hand steps", () => {
    const events: GameEvent[] = [
      {
        type: "cardsRevealed",
        audience: "public",
        playerId: pid("p1"),
        ownerId: pid("p1"),
        fromZone: "deck",
        cardIds: [cid("match-1"), cid("match-2")],
      },
      {
        type: "cardMoved",
        cardId: cid("match-1"),
        fromZone: "deck",
        toZone: "hand",
        playerId: pid("p1"),
      },
      {
        type: "cardMoved",
        cardId: cid("match-2"),
        fromZone: "deck",
        toZone: "hand",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps.map((step) => step.kind)).toEqual(["cardReveal", "cardReveal"]);
    expect(script.steps.map((step) => (step as CardRevealStep).toZone)).toEqual(["hand", "hand"]);
  });

  it("does not fold unrelated moves after a reveal", () => {
    const events: GameEvent[] = [
      {
        type: "cardsRevealed",
        audience: "public",
        playerId: pid("p1"),
        ownerId: pid("p1"),
        fromZone: "deck",
        cardIds: [cid("top-1")],
      },
      {
        type: "cardMoved",
        cardId: cid("other-card"),
        fromZone: "hand",
        toZone: "field",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps.map((step) => step.kind)).toEqual(["cardReveal", "cardMove"]);
    const reveal = script.steps[0] as CardRevealStep;
    const move = script.steps[1] as CardMoveStep;
    expect(reveal.toZone).toBeUndefined();
    expect(move.cardId).toBe("other-card");
  });

  it("reveals a rival Legend at its actual zone without deck movement", () => {
    const events: GameEvent[] = [
      {
        type: "cardsRevealed",
        audience: "private",
        playerId: pid("p1"),
        ownerId: pid("p2"),
        fromZone: "legendArea",
        cardIds: [cid("rival-legend")],
      },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toEqual([
      expect.objectContaining({
        kind: "cardReveal",
        cardId: cid("rival-legend"),
        fromZone: "legendArea",
        ownerId: pid("p2"),
        audience: "private",
        viewerId: pid("p1"),
      }),
    ]);
  });

  it("starts detached gear motion from its host and then draws", () => {
    const events: GameEvent[] = [
      {
        type: "cardDetached",
        gearId: cid("gear-1"),
        hostId: cid("host-1"),
        playerId: pid("p1"),
      },
      {
        type: "cardMoved",
        cardId: cid("gear-1"),
        fromZone: "field",
        toZone: "trash",
        playerId: pid("p1"),
      },
      {
        type: "cardsDrawn",
        playerId: pid("p1"),
        count: 2,
        cardIds: [cid("d1"), cid("d2")],
      },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps.map((step) => step.kind)).toEqual(["cardMove", "cardEnter", "cardEnter"]);
    const move = script.steps[0] as CardMoveStep;
    expect(move.cardId).toBe("gear-1");
    expect(move.fromHostId).toBe("host-1");
    expect(move.fromZone).toBe("field");
    expect(move.toZone).toBe("trash");
    expect(script.steps[1]?.startMs).toBeGreaterThan(move.startMs);
  });

  it("moves all cards from one draw event into hand together", () => {
    const events: GameEvent[] = [
      {
        type: "cardsDrawn",
        playerId: pid("p1"),
        count: 3,
        cardIds: [cid("d1"), cid("d2"), cid("d3")],
      },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toHaveLength(3);
    const each = ANIMATION_DURATIONS_MS.cardEnter;
    script.steps.forEach((step) => {
      const enter = step as CardEnterStep;
      expect(enter.kind).toBe("cardEnter");
      expect(enter.toZone).toBe("hand");
      expect(enter.startMs).toBe(0);
      expect(enter.durationMs).toBe(each);
    });
    expect(script.totalDurationMs).toBe(each);
  });

  it("emits no steps for cardsDrawn with empty cardIds", () => {
    const events: GameEvent[] = [
      { type: "cardsDrawn", playerId: pid("p1"), count: 0, cardIds: [] },
    ];
    expect(buildAnimationScript(events).steps).toEqual([]);
  });

  it("emits a gigMove step when a die moves from fixer to gig area", () => {
    const events: GameEvent[] = [
      {
        type: "gigDieMoved",
        dieId: dieId("d6-1"),
        from: "fixerArea",
        to: "gigArea",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toHaveLength(1);
    const step = script.steps[0] as GigMoveStep;
    expect(step.kind).toBe("gigMove");
    expect(step.reason).toBe("gigDieMoved");
    expect(step.dieId).toBe("d6-1");
    expect(step.from).toBe("fixerArea");
    expect(step.to).toBe("gigArea");
    expect(step.fromPlayerId).toBe("p1");
    expect(step.toPlayerId).toBe("p1");
    expect(step.moveKind).toBe("gain");
    expect(step.durationMs).toBe(ANIMATION_DURATIONS_MS.gigMove);
  });

  it("emits a correct gigMove step when a die returns to the fixer area", () => {
    const events: GameEvent[] = [
      {
        type: "gigDieMoved",
        dieId: dieId("d6-1"),
        from: "gigArea",
        to: "fixerArea",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toHaveLength(1);
    const step = script.steps[0] as GigMoveStep;
    expect(step.kind).toBe("gigMove");
    expect(step.from).toBe("gigArea");
    expect(step.to).toBe("fixerArea");
    expect(step.moveKind).toBe("correct");
  });

  it("emits one gigMove step for gigStolen and suppresses the paired gigDieMoved", () => {
    const events: GameEvent[] = [
      {
        type: "gigStolen",
        dieId: dieId("d4-1"),
        fromPlayerId: pid("p2"),
        toPlayerId: pid("p1"),
      },
      {
        type: "gigDieMoved",
        dieId: dieId("d4-1"),
        from: "gigArea",
        to: "gigArea",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toHaveLength(1);
    const step = script.steps[0] as GigMoveStep;
    expect(step.kind).toBe("gigMove");
    expect(step.reason).toBe("gigStolen");
    expect(step.dieId).toBe("d4-1");
    expect(step.from).toBe("gigArea");
    expect(step.to).toBe("gigArea");
    expect(step.fromPlayerId).toBe("p2");
    expect(step.toPlayerId).toBe("p1");
    expect(step.moveKind).toBe("steal");
  });

  it("moves swapped Gig dice from their original owners", () => {
    const events: GameEvent[] = [
      {
        type: "gigDieMoved",
        dieId: dieId("friendly"),
        from: "gigArea",
        to: "gigArea",
        fromPlayerId: pid("p1"),
        playerId: pid("p2"),
      },
      {
        type: "gigDieMoved",
        dieId: dieId("rival"),
        from: "gigArea",
        to: "gigArea",
        fromPlayerId: pid("p2"),
        playerId: pid("p1"),
      },
      {
        type: "gigsSwapped",
        dieIds: [dieId("friendly"), dieId("rival")],
        dieValues: [2, 3],
        dieTypes: ["d6", "d6"],
        playerId: pid("p1"),
        fromPlayerIds: [pid("p1"), pid("p2")],
      },
    ];
    const steps = buildAnimationScript(events).steps as GigMoveStep[];
    expect(steps.map(({ fromPlayerId, toPlayerId }) => [fromPlayerId, toPlayerId])).toEqual([
      [pid("p1"), pid("p2")],
      [pid("p2"), pid("p1")],
    ]);
  });

  it("uses each move's owner when the same Gig is swapped twice", () => {
    const events: GameEvent[] = [
      {
        type: "gigDieMoved",
        dieId: dieId("shared"),
        from: "gigArea",
        to: "gigArea",
        fromPlayerId: pid("p1"),
        playerId: pid("p2"),
      },
      {
        type: "gigDieMoved",
        dieId: dieId("shared"),
        from: "gigArea",
        to: "gigArea",
        fromPlayerId: pid("p2"),
        playerId: pid("p1"),
      },
    ];

    const moves = buildAnimationScript(events).steps as GigMoveStep[];
    expect(moves.map(({ fromPlayerId, toPlayerId }) => [fromPlayerId, toPlayerId])).toEqual([
      [pid("p1"), pid("p2")],
      [pid("p2"), pid("p1")],
    ]);
  });

  it("emits a resourceFloat step for gigValueChanged with previous and new values", () => {
    const events: GameEvent[] = [
      {
        type: "gigValueChanged",
        sourcePlayerId: pid("p2"),
        dieId: dieId("d10-1"),
        previousValue: 10,
        newValue: 8,
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toHaveLength(1);
    const step = script.steps[0] as ResourceFloatStep;
    expect(step.kind).toBe("resourceFloat");
    expect(step.reason).toBe("gigValueChanged");
    expect(step.resource).toBe("gig");
    expect(step.dieId).toBe("d10-1");
    expect(step.delta).toBe(-2);
    expect(step.previousValue).toBe(10);
    expect(step.newValue).toBe(8);
  });

  it("plays declare, redirect and impact beats when one command resolves a blocked fight", () => {
    const events: GameEvent[] = [
      {
        type: "attackDeclared",
        attackerId: cid("atk"),
        defenderId: cid("def"),
        rivalId: pid("p2"),
        attackKind: "fight",
        playerId: pid("p1"),
      },
      {
        type: "blockerActivated",
        attackerId: cid("atk"),
        blockerId: cid("blocker"),
        originalTarget: null,
        playerId: pid("p2"),
      },
      {
        type: "attackResolved",
        attackerId: cid("atk"),
        defenderId: cid("def"),
        rivalId: pid("p2"),
        attackKind: "fight",
        result: "attackerWins",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);

    const declareDuration = ANIMATION_DURATIONS_MS.combatDeclare;
    expect(script.steps).toMatchObject([
      {
        kind: "combat",
        reason: "attackDeclared",
        attackerId: "atk",
        defenderId: "def",
        attackKind: "fight",
        startMs: 0,
        durationMs: declareDuration,
      },
      {
        kind: "combatRedirect",
        reason: "blockerActivated",
        attackerId: "atk",
        blockerId: "blocker",
        startMs: declareDuration,
        durationMs: declareDuration,
      },
      {
        kind: "combat",
        reason: "attackResolved",
        attackerId: "atk",
        defenderId: "def",
        attackKind: "fight",
        startMs: declareDuration * 2,
        durationMs: ANIMATION_DURATIONS_MS.combatResolve,
      },
    ]);
    expect(script.totalDurationMs).toBe(declareDuration * 2 + ANIMATION_DURATIONS_MS.combatResolve);
  });

  it("shows the block before a defeated direct attacker exits to trash", () => {
    const events: GameEvent[] = [
      {
        type: "attackDeclared",
        attackerId: cid("atk"),
        defenderId: null,
        rivalId: pid("p2"),
        attackKind: "direct",
        playerId: pid("p1"),
      },
      {
        type: "blockerActivated",
        attackerId: cid("atk"),
        blockerId: cid("blocker"),
        originalTarget: null,
        playerId: pid("p2"),
      },
      {
        type: "attackResolved",
        attackerId: cid("atk"),
        defenderId: cid("blocker"),
        rivalId: pid("p2"),
        attackKind: "fight",
        result: "defenderWins",
        playerId: pid("p2"),
      },
      {
        type: "cardDefeated",
        cardId: cid("atk"),
        snapshot: defeatedSnapshot("p1"),
        defeatedBy: cid("blocker"),
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);

    const beat = ANIMATION_DURATIONS_MS.combatDeclare;
    expect(script.steps.map((step) => step.kind)).toEqual([
      "combat",
      "combatRedirect",
      "combat",
      "cardExit",
    ]);
    expect(script.steps[0]).toMatchObject({ reason: "attackDeclared", startMs: 0 });
    expect(script.steps[1]).toMatchObject({
      kind: "combatRedirect",
      attackerId: "atk",
      blockerId: "blocker",
      startMs: beat,
    });
    expect(script.steps[2]).toMatchObject({
      reason: "attackResolved",
      defenderId: "blocker",
      result: "defenderWins",
      startMs: beat * 2,
    });
    const exit = script.steps[3] as CardExitStep;
    expect(exit.cardId).toBe("atk");
    expect(exit.exitReason).toBe("defeated");
    expect(exit.startMs).toBe(beat * 2 + ANIMATION_DURATIONS_MS.combatResolve);
  });

  it("shows a declaration and blocker choice while combat awaits resolution", () => {
    const events: GameEvent[] = [
      {
        type: "attackDeclared",
        attackerId: cid("atk"),
        defenderId: null,
        rivalId: pid("p2"),
        attackKind: "direct",
        playerId: pid("p1"),
      },
      {
        type: "blockerActivated",
        attackerId: cid("atk"),
        blockerId: cid("blocker"),
        originalTarget: null,
        playerId: pid("p2"),
      },
    ];
    const script = buildAnimationScript(events);
    expect(script.steps).toMatchObject([
      { kind: "combat", reason: "attackDeclared", durationMs: 800, startMs: 0 },
      { kind: "combatRedirect", reason: "blockerActivated", durationMs: 800, startMs: 800 },
    ]);
  });

  it("orders fight impact before defeated cards move to trash", () => {
    const events: GameEvent[] = [
      {
        type: "cardMoved",
        cardId: cid("def"),
        fromZone: "field",
        toZone: "trash",
        playerId: pid("p2"),
      },
      {
        type: "cardDefeated",
        cardId: cid("def"),
        snapshot: defeatedSnapshot("p2"),
        defeatedBy: cid("atk"),
        playerId: pid("p2"),
      },
      {
        type: "attackResolved",
        attackerId: cid("atk"),
        defenderId: cid("def"),
        rivalId: pid("p2"),
        attackKind: "fight",
        result: "attackerWins",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps.map((step) => step.kind)).toEqual(["combat", "cardExit"]);
    const defeated = script.steps[1] as CardExitStep;
    expect(defeated.reason).toBe("cardDefeated");
    expect(defeated.startMs).toBe(ANIMATION_DURATIONS_MS.combatResolve);
  });

  it("orders direct impact before stolen Gig movement", () => {
    const events: GameEvent[] = [
      {
        type: "gigStolen",
        dieId: dieId("d6-1"),
        fromPlayerId: pid("p2"),
        toPlayerId: pid("p1"),
        sourceCardId: cid("atk"),
      },
      {
        type: "attackResolved",
        attackerId: cid("atk"),
        defenderId: null,
        rivalId: pid("p2"),
        attackKind: "direct",
        result: "gigsStolen",
        gigsStolen: 1,
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps.map((step) => step.kind)).toEqual(["combat", "gigMove"]);
    expect(script.steps[0]).toMatchObject({
      kind: "combat",
      attackKind: "direct",
      defenderId: null,
      rivalId: "p2",
      durationMs: ANIMATION_DURATIONS_MS.combatResolve,
    });
    const stolen = script.steps[1] as GigMoveStep;
    expect(stolen.reason).toBe("gigStolen");
    expect(stolen.startMs).toBe(ANIMATION_DURATIONS_MS.combatResolve);
  });

  it("emits a phaseChange step for phaseChanged", () => {
    const events: GameEvent[] = [
      { type: "phaseChanged", from: "start", to: "main", playerId: pid("p1") },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toHaveLength(1);
    const phase = script.steps[0] as PhaseChangeStep;
    expect(phase.kind).toBe("phaseChange");
    expect(phase.from).toBe("start");
    expect(phase.to).toBe("main");
    expect(phase.durationMs).toBe(ANIMATION_DURATIONS_MS.phaseChange);
  });

  it("emits a turn phaseChange step for main-to-start turn handoffs", () => {
    const events: GameEvent[] = [
      { type: "phaseChanged", from: "main", to: "start", playerId: pid("p1") },
      { type: "turnStarted", playerId: pid("p2"), turnNumber: 2 },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps).toHaveLength(1);
    const phase = script.steps[0] as PhaseChangeStep;
    expect(phase.kind).toBe("phaseChange");
    expect(phase.from).toBe("main");
    expect(phase.to).toBe("start");
    expect(phase.variant).toBe("turn");
    expect(phase.turnPlayerId).toBe(pid("p2"));
    expect(phase.turnNumber).toBe(2);
  });

  it("emits a negative labeled emphasis for a granted cantAttack rule without blocking the cursor", () => {
    const events: GameEvent[] = [
      {
        type: "cardMoved",
        cardId: cid("c1"),
        fromZone: "hand",
        toZone: "field",
        playerId: pid("p1"),
      },
      { type: "ruleGranted", cardId: cid("c1"), rule: "cantAttack" },
      {
        type: "cardMoved",
        cardId: cid("c2"),
        fromZone: "hand",
        toZone: "field",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);

    const emphasis = script.steps.find(
      (step) => step.kind === "actionEmphasis",
    ) as ActionEmphasisStep;
    expect(emphasis.reason).toBe("ruleGranted:cantAttack");
    expect(emphasis.target).toEqual({ kind: "card", cardId: cid("c1") });
    expect(emphasis.tone).toBe("negative");
    expect(emphasis.label).toBe("CAN'T ATTACK");
    // The debuff beat runs in parallel: the following move is not pushed past it.
    const followingMove = script.steps.at(-1) as CardMoveStep;
    expect(followingMove.cardId).toBe(cid("c2"));
    expect(followingMove.startMs).toBe(ANIMATION_DURATIONS_MS.handPlay);
  });

  it("ignores rule grants other than cantAttack", () => {
    const events: GameEvent[] = [{ type: "ruleGranted", cardId: cid("c1"), rule: "mustAttack" }];

    const script = buildAnimationScript(events);

    expect(script.steps).toHaveLength(0);
  });
});
