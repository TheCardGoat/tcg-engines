import { describe, expect, it } from "vite-plus/test";
import { buildAnimationScript } from "./builder.ts";
import { ANIMATION_DURATIONS_MS } from "./durations.ts";
import { asCardInstanceId, asPlayerId } from "../types/branded.ts";
import type { GameEvent } from "../types/game-events.ts";
import type {
  CardAttachStep,
  CardEnterStep,
  CardExitStep,
  CardLandStep,
  CardMoveStep,
  CombatRedirectStep,
  CombatStep,
  EffectTargetStep,
  GigMoveStep,
  LegendRevealStep,
  PhaseChangeStep,
  ResourceFloatStep,
} from "./types.ts";

const cid = (s: string) => asCardInstanceId(s);
const pid = (s: string) => asPlayerId(s);
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
    expect(step.durationMs).toBe(ANIMATION_DURATIONS_MS.cardMove);
    expect(script.totalDurationMs).toBe(ANIMATION_DURATIONS_MS.cardMove);
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
    expect(float.startMs).toBe(ANIMATION_DURATIONS_MS.cardMove);
    expect(float.delta).toBe(-3);
    expect(script.totalDurationMs).toBe(
      ANIMATION_DURATIONS_MS.cardMove + ANIMATION_DURATIONS_MS.resourceFloat,
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
    expect(script.steps[1].startMs).toBe(ANIMATION_DURATIONS_MS.cardMove);
    expect(script.totalDurationMs).toBe(ANIMATION_DURATIONS_MS.cardMove * 2);
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

  it("ignores events that have no current mapping", () => {
    const events: GameEvent[] = [
      { type: "turnStarted", playerId: pid("p1"), turnNumber: 1 },
      { type: "turnEnded", playerId: pid("p1"), turnNumber: 1 },
      { type: "gameEnded", winnerId: pid("p1"), reason: "concede" },
      { type: "deckShuffled", playerId: pid("p1") },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toEqual([]);
    expect(script.totalDurationMs).toBe(0);
  });

  it("emits a cardLand after a unit's cardMove to field", () => {
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
    expect(script.steps).toHaveLength(2);
    const move = script.steps[0] as CardMoveStep;
    const land = script.steps[1] as CardLandStep;
    expect(move.kind).toBe("cardMove");
    expect(land.kind).toBe("cardLand");
    expect(land.cardId).toBe("u1");
    expect(land.startMs).toBe(ANIMATION_DURATIONS_MS.cardMove);
    expect(land.durationMs).toBe(ANIMATION_DURATIONS_MS.cardLand);
  });

  it("does not emit cardLand for a played card that lands in trash (program)", () => {
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
    const target = script.steps[1] as EffectTargetStep;
    const defeated = script.steps[2] as CardExitStep;
    expect(playMove.cardId).toBe("prog");
    expect(playMove.fromZone).toBe("hand");
    expect(playMove.toZone).toBe("trash");
    expect(target.sourceCardId).toBe("prog");
    expect(target.startMs).toBe(ANIMATION_DURATIONS_MS.cardMove);
    expect(defeated.cardId).toBe("target");
    expect(defeated.fromZone).toBe("field");
    expect(defeated.toZone).toBe("trash");
    expect(defeated.startMs).toBe(
      ANIMATION_DURATIONS_MS.cardMove + ANIMATION_DURATIONS_MS.effectTarget,
    );
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
    expect(attach.durationMs).toBe(ANIMATION_DURATIONS_MS.cardAttach);
  });

  it("emits an effectTarget step for effectTargeted with mixed targets", () => {
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
    const target = script.steps[0] as EffectTargetStep;
    expect(target.sourceCardId).toBe("prog");
    expect(target.targets).toHaveLength(2);
    expect(target.startMs).toBe(0);
    const move = script.steps[1] as CardMoveStep;
    expect(move.startMs).toBe(ANIMATION_DURATIONS_MS.effectTarget);
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
    expect(reveal.durationMs).toBe(ANIMATION_DURATIONS_MS.legendReveal);
    expect(script.totalDurationMs).toBe(ANIMATION_DURATIONS_MS.legendReveal);
  });

  it("emits staggered cardEnter steps for cardsDrawn", () => {
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
    const stagger = ANIMATION_DURATIONS_MS.drawStaggerMs;
    const each = ANIMATION_DURATIONS_MS.cardEnter;
    script.steps.forEach((step, idx) => {
      const enter = step as CardEnterStep;
      expect(enter.kind).toBe("cardEnter");
      expect(enter.toZone).toBe("hand");
      expect(enter.startMs).toBe(idx * stagger);
      expect(enter.durationMs).toBe(each);
    });
    expect(script.totalDurationMs).toBe((3 - 1) * stagger + each);
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

  it("emits a resourceFloat step for gigValueChanged with previous and new values", () => {
    const events: GameEvent[] = [
      {
        type: "gigValueChanged",
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

  it("emits combat steps for attackDeclared and attackResolved with the right reason", () => {
    const events: GameEvent[] = [
      {
        type: "attackDeclared",
        attackerId: cid("atk"),
        defenderId: cid("def"),
        attackKind: "fight",
        playerId: pid("p1"),
      },
      {
        type: "attackResolved",
        attackerId: cid("atk"),
        defenderId: cid("def"),
        attackKind: "fight",
        result: "attackerWins",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);
    expect(script.steps).toHaveLength(2);
    const declared = script.steps[0] as CombatStep;
    const resolved = script.steps[1] as CombatStep;
    expect(declared.kind).toBe("combat");
    expect(declared.reason).toBe("attackDeclared");
    expect(declared.startMs).toBe(0);
    expect(declared.durationMs).toBe(ANIMATION_DURATIONS_MS.combatDeclare);
    expect(resolved.reason).toBe("attackResolved");
    expect(resolved.startMs).toBe(ANIMATION_DURATIONS_MS.combatDeclare);
    expect(resolved.durationMs).toBe(ANIMATION_DURATIONS_MS.combatResolve);
  });

  it("emits a combatRedirect step for blockerActivated", () => {
    const events: GameEvent[] = [
      {
        type: "blockerActivated",
        attackerId: cid("atk"),
        blockerId: cid("blocker"),
        originalTarget: null,
        playerId: pid("p2"),
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps).toHaveLength(1);
    const redirect = script.steps[0] as CombatRedirectStep;
    expect(redirect.kind).toBe("combatRedirect");
    expect(redirect.reason).toBe("blockerActivated");
    expect(redirect.attackerId).toBe("atk");
    expect(redirect.blockerId).toBe("blocker");
    expect(redirect.originalTargetId).toBeNull();
    expect(redirect.playerId).toBe("p2");
    expect(redirect.durationMs).toBe(ANIMATION_DURATIONS_MS.combatDeclare);
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
        defeatedBy: cid("atk"),
        playerId: pid("p2"),
      },
      {
        type: "attackResolved",
        attackerId: cid("atk"),
        defenderId: cid("def"),
        attackKind: "fight",
        result: "attackerWins",
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps.map((step) => step.kind)).toEqual(["combat", "cardExit"]);
    const impact = script.steps[0] as CombatStep;
    const defeated = script.steps[1] as CardExitStep;
    expect(impact.reason).toBe("attackResolved");
    expect(impact.startMs).toBe(0);
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
        attackKind: "direct",
        result: "gigsStolen",
        gigsStolen: 1,
        playerId: pid("p1"),
      },
    ];

    const script = buildAnimationScript(events);

    expect(script.steps.map((step) => step.kind)).toEqual(["combat", "gigMove"]);
    const impact = script.steps[0] as CombatStep;
    const stolen = script.steps[1] as GigMoveStep;
    expect(impact.reason).toBe("attackResolved");
    expect(impact.gigsStolen).toBe(1);
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
});
