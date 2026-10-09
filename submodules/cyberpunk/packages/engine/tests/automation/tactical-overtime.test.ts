import { describe, expect, it } from "vite-plus/test";
import { AIPlayer, buildDecisionContext, tacticalStrategy } from "../../src/automation/index.ts";
import { CyberpunkTestEngine, P1, P2, createMockUnit } from "../../src/testing/index.ts";
import type { GigFixtureEntry, PlayerFixture } from "../../src/testing/test-fixtures.ts";

const dice = ["d4", "d6", "d8", "d10", "d12", "d20"] as const;
type Stage = "first-empty-turn" | "final-empty-turn" | "overtime";

function game(stage: Stage, ownGigs: number, own: PlayerFixture, rival: PlayerFixture) {
  const selfCount = Math.min(6, ownGigs);
  const stolen = Math.max(0, ownGigs - 6);
  const gigs = (
    types: readonly (typeof dice)[number][],
    source: "self" | "rival",
  ): GigFixtureEntry[] => types.map((dieType) => ({ dieType, faceValue: 1, source }));
  const engine = CyberpunkTestEngine.createWithFixture(
    {
      legendArea: [],
      hand: [],
      eddies: 0,
      ...own,
      gigArea: [...gigs(dice.slice(0, selfCount), "self"), ...gigs(dice.slice(0, stolen), "rival")],
    },
    {
      legendArea: [],
      hand: [],
      eddies: 0,
      ...rival,
      gigArea: [...gigs(dice.slice(stolen), "self"), ...gigs(dice.slice(selfCount), "rival")],
    },
    { activePlayerId: P1, combatProgression: "automatic", overtime: stage === "overtime" },
  );
  // Deliberately independent of the usual turn 13/14 numbering (CR 1.11.1).
  engine.judgeSetTurnMetadata({
    turnNumber: 21,
    turnBeganWithEmptyFixer: true,
    previousTurnBeganWithEmptyFixer: stage !== "first-empty-turn",
  });
  expect(engine.getGigCount(P1)).toBe(ownGigs);
  expect(engine.getGigCount(P2)).toBe(12 - ownGigs);
  return engine;
}

function choose(engine: CyberpunkTestEngine, player = P1) {
  return tacticalStrategy.decideAction(
    buildDecisionContext(engine.getLocalEngine(), player, () => 0.5),
  );
}

function playCurrentTurn(engine: CyberpunkTestEngine) {
  const bots = [P1, P2].map(
    (player) => new AIPlayer(engine.getLocalEngine(), player, tacticalStrategy),
  );
  for (let step = 0; step < 60; step++) {
    if (engine.isGameOver() || engine.getActivePlayerId() !== P1) return;
    const bot = bots.find(({ playerId }) => {
      const status = engine.getPrompt(playerId).status;
      return status === "action" || status === "choice";
    });
    if (!bot) throw new Error("No player can progress the public turn");
    const result = bot.step();
    expect(result.kind, JSON.stringify(result)).toBe("acted");
  }
  throw new Error("Bot did not finish the turn within 60 decisions");
}

describe("tactical overtime objectives", () => {
  it("presses the replay's tied score after the smaller attackers are spent", () => {
    const ten = createMockUnit({ id: "ot-replay-ten", power: 10 });
    const three = createMockUnit({ id: "ot-replay-three", power: 3 });
    const six = createMockUnit({ id: "ot-replay-six", power: 6 });
    const eleven = createMockUnit({ id: "ot-replay-eleven", power: 11 });
    const shield = createMockUnit({ id: "ot-replay-shield", power: 2, keywords: ["blocker"] });
    // Public combat reconstruction, not the full replay's hands or card effects.
    const engine = game(
      "final-empty-turn",
      6,
      {
        field: [
          { card: ten, spent: false, hasLag: false },
          { card: three, spent: true },
          { card: six, spent: true },
        ],
      },
      {
        field: [
          { card: shield, spent: false, hasLag: true },
          { card: ten, spent: true },
          { card: eleven, spent: true },
        ],
      },
    );
    expect(choose(engine)).toMatchObject({ move: "attackRival" });
    engine.attackRival(ten);
    engine.useBlocker(shield, { as: P2 });
    expect(engine.getGigCount(P1)).toBe(6);
    expect(engine.getGigCount(P2)).toBe(6);
    expect(engine.getCard(shield, "trash", P2).zone).toBe("trash");
    expect(engine.getCard(ten, "field", P1).meta.spent).toBe(true);
  });

  it("passes to win at seven on the turn whose end starts overtime", () => {
    const shield = createMockUnit({ id: "ot-pass-shield", power: 10, keywords: ["blocker"] });
    const threat = createMockUnit({ id: "ot-pass-threat", power: 30 });
    const engine = game(
      "final-empty-turn",
      7,
      { field: [{ card: shield, spent: false, hasLag: false }] },
      { field: [{ card: threat, spent: true }] },
    );
    expect(choose(engine)).toMatchObject({ move: "passPhase" });
    playCurrentTurn(engine);
    expect(engine.getWinnerId()).toBe(P1);
    expect(engine.getWinReason()).toBe("overtime_majority");
  });

  it("takes the winning pass even when the board has more attacks than the search budget", () => {
    const own = createMockUnit({ id: "ot-many-own", power: 10 });
    const rival = createMockUnit({ id: "ot-many-rival", power: 1 });
    const engine = game(
      "final-empty-turn",
      7,
      { field: Array.from({ length: 8 }, () => ({ card: own, spent: false, hasLag: false })) },
      { field: Array.from({ length: 6 }, () => ({ card: rival, spent: true })) },
    );
    expect(choose(engine)).toMatchObject({ move: "passPhase" });
  });

  it("finds the winning steal before a crowded board consumes the search budget", () => {
    const own = createMockUnit({ id: "ot-many-steal-own", power: 10 });
    const rival = createMockUnit({ id: "ot-many-steal-rival", power: 1 });
    const engine = game(
      "final-empty-turn",
      5,
      { field: Array.from({ length: 8 }, () => ({ card: own, spent: false, hasLag: false })) },
      { field: Array.from({ length: 6 }, () => ({ card: rival, spent: true })) },
    );
    expect(choose(engine)).toMatchObject({ move: "attackRival" });
    playCurrentTurn(engine);
    expect(engine.getWinnerId()).toBe(P1);
  });

  it("spends its last BLOCKER to steal two and win before stronger rival Units ready", () => {
    const shield = createMockUnit({ id: "ot-all-in-shield", power: 10, keywords: ["blocker"] });
    const threat = createMockUnit({ id: "ot-all-in-threat", power: 30 });
    const engine = game(
      "final-empty-turn",
      5,
      { field: [{ card: shield, spent: false, hasLag: false }] },
      { field: [{ card: threat, spent: true }] },
    );
    expect(choose(engine)).toMatchObject({ move: "attackRival" });
    playCurrentTurn(engine);
    expect(engine.getWinnerId()).toBe(P1);
    expect(engine.getGigCount(P1)).toBe(7);
  });

  it("sacrifices a Unit into a stronger BLOCKER to open the two winning steals", () => {
    const small = createMockUnit({ id: "ot-sacrifice-small", power: 1 });
    const large = createMockUnit({ id: "ot-sacrifice-large", power: 10 });
    const wall = createMockUnit({ id: "ot-sacrifice-wall", power: 20, keywords: ["blocker"] });
    const engine = game(
      "final-empty-turn",
      5,
      { field: [small, small, large].map((card) => ({ card, spent: false, hasLag: false })) },
      { field: [{ card: wall, spent: false }] },
    );
    playCurrentTurn(engine);
    expect(engine.getWinnerId()).toBe(P1);
    expect(engine.getCardsInZone("trash", P1).length).toBeGreaterThan(0);
  });

  it("goes all-in through two stronger BLOCKERs even without a ready-Unit advantage", () => {
    const small = createMockUnit({ id: "ot-parity-small", power: 1 });
    const large = createMockUnit({ id: "ot-parity-large", power: 10 });
    const wall = createMockUnit({ id: "ot-parity-wall", power: 20, keywords: ["blocker"] });
    const spare = createMockUnit({ id: "ot-parity-spare", power: 30 });
    const engine = game(
      "final-empty-turn",
      5,
      {
        field: [small, small, large, large].map((card) => ({ card, spent: false, hasLag: false })),
      },
      { field: [wall, wall, spare, spare].map((card) => ({ card, spent: false })) },
    );
    playCurrentTurn(engine);
    expect(engine.getWinnerId()).toBe(P1);
    expect(engine.getCardsInZone("trash", P1)).toHaveLength(2);
  });

  it("keeps its BLOCKER when the first empty-Fixer turn must survive a rival reply", () => {
    const shield = createMockUnit({ id: "ot-hold-shield", power: 2, keywords: ["blocker"] });
    const ten = createMockUnit({ id: "ot-hold-ten", power: 10 });
    const twenty = createMockUnit({ id: "ot-hold-twenty", power: 20 });
    const engine = game(
      "first-empty-turn",
      8,
      { field: [{ card: shield, spent: false, hasLag: false }] },
      {
        field: [
          { card: ten, spent: true },
          { card: twenty, spent: true },
        ],
      },
    );
    expect(choose(engine)).toMatchObject({ move: "passPhase" });
    playCurrentTurn(engine);
    expect(engine.getCard(shield, "field", P1).meta.spent).toBe(false);
    expect(engine.isGameOver()).toBe(false);
  });

  it("removes a next-turn attacker when it protects the same score as a one-Gig steal", () => {
    const own = createMockUnit({ id: "ot-remove-own", power: 9 });
    const threat = createMockUnit({ id: "ot-remove-threat", power: 8 });
    const engine = game(
      "first-empty-turn",
      8,
      { field: [{ card: own, spent: false, hasLag: false }] },
      {
        field: [
          { card: threat, spent: true },
          { card: threat, spent: true },
        ],
      },
    );
    expect(choose(engine)).toMatchObject({ move: "attackUnit" });
  });

  it("takes two Gigs when the bigger score buffer beats removing a one-Gig attacker", () => {
    const own = createMockUnit({ id: "ot-two-gigs-own", power: 10 });
    const threat = createMockUnit({ id: "ot-two-gigs-threat", power: 8 });
    const engine = game(
      "first-empty-turn",
      8,
      { field: [{ card: own, spent: false, hasLag: false }] },
      {
        field: [
          { card: threat, spent: true },
          { card: threat, spent: true },
        ],
      },
    );
    expect(choose(engine)).toMatchObject({ move: "attackRival" });
  });

  it("wins in active overtime before a possible removal fight", () => {
    const own = createMockUnit({ id: "ot-immediate-own", power: 10 });
    const threat = createMockUnit({ id: "ot-immediate-threat", power: 9 });
    const engine = game(
      "overtime",
      6,
      { field: [{ card: own, spent: false, hasLag: false }] },
      { field: [{ card: threat, spent: true }] },
    );
    expect(choose(engine)).toMatchObject({ move: "attackRival" });
    playCurrentTurn(engine);
    expect(engine.getWinnerId()).toBe(P1);
  });

  it.each(["final-empty-turn", "overtime"] as const)(
    "sacrifices a defending BLOCKER to deny the winning steal in %s",
    (stage) => {
      const attacker = createMockUnit({ id: `ot-deny-${stage}`, power: 10 });
      const shield = createMockUnit({
        id: `ot-deny-shield-${stage}`,
        power: 1,
        keywords: ["blocker"],
      });
      const engine = game(
        stage,
        stage === "overtime" ? 6 : 5,
        { field: [{ card: attacker, spent: false, hasLag: false }] },
        { field: [{ card: shield, spent: false, hasLag: true }] },
      );
      engine.attackRival(attacker);
      expect(choose(engine, P2)).toMatchObject({ move: "useBlocker" });
      const bot = new AIPlayer(engine.getLocalEngine(), P2, tacticalStrategy);
      expect(bot.step().kind).toBe("acted");
      expect(engine.getGigCount(P1)).toBe(stage === "overtime" ? 6 : 5);
      expect(engine.getCard(shield, "trash", P2).zone).toBe("trash");
      engine.passPhase();
      if (stage === "final-empty-turn") expect(engine.getWinnerId()).toBe(P2);
      else expect(engine.isGameOver()).toBe(false);
    },
  );

  it("reserves a BLOCKER for a two-Gig attack when blocking one Gig loses the lead", () => {
    const small = createMockUnit({ id: "ot-reserve-small", power: 1 });
    const large = createMockUnit({ id: "ot-reserve-large", power: 10 });
    const shield = createMockUnit({ id: "ot-reserve-shield", power: 2, keywords: ["blocker"] });
    const engine = game(
      "final-empty-turn",
      3,
      { field: [small, large, large].map((card) => ({ card, spent: false, hasLag: false })) },
      { field: [{ card: shield, spent: false }] },
    );
    engine.attackRival(small);
    expect(choose(engine, P2)).toMatchObject({ move: "resolveAttack", args: { pass: true } });
  });
});
