/**
 * Situation tests for the combat heuristics (bot-lab lessons):
 *
 * 1. "safe-steal" — with no rival ready blocker able to respond, a Gig-area
 *    attack is strictly +EV and this prompt becomes the steal (develop plays
 *    wait for the next prompt).
 * 2. "remove-targets" — a winning fight exists: combat outranks developing,
 *    and the weakest Unit that still wins takes the fight so ≥10-power
 *    bodies keep their two-Gig steal potential.
 * 3. "gear-power" — a Gear that pushes its host across a steal breakpoint
 *    (10 power) outranks attaching elsewhere.
 * 4. "legend-gear" — a Gear with no effect beyond raw power is not attached
 *    to a face-up Legend without [GO SOLO]: that Legend can never fight or
 *    steal, so the power is dead weight.
 */
import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetail6thStreetRecruits,
  welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
  welcomeToNightCityRetailAugmentedNegotiators,
  welcomeToNightCityRetailElSombreronLaVenganzaLenta,
  welcomeToNightCityRetailJohnnySilverhandRockingRenegade,
  welcomeToNightCityRetailJackieWellesRideOrDieChoom,
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailMamanBrigitteSpiritOfDeath,
  welcomeToNightCityRetailPadreManOfTheCross,
  welcomeToNightCityRetailTraumaTeamOperatives,
  prm01RebeccaHavingAMoment,
} from "@tcg/cyberpunk-cards";
import { AIPlayer, buildDecisionContext, tacticalStrategy } from "../../src/automation/index.ts";
import { CyberpunkTestEngine, P1, P2, createMockUnit } from "../../src/testing/index.ts";
import type { DecisionContext } from "../../src/automation/types.ts";
import type { FilteredCardView } from "../../src/view/filter.ts";

function scenario(
  p1: Parameters<typeof CyberpunkTestEngine.createWithFixture>[0],
  p2: Parameters<typeof CyberpunkTestEngine.createWithFixture>[1],
): DecisionContext {
  const engine = CyberpunkTestEngine.createWithFixture(p1, p2);
  return buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
}

function fieldCard(ctx: DecisionContext, playerId: string, cardName: string): FilteredCardView {
  const field = ctx.view.players[playerId]?.zones.field;
  if (!Array.isArray(field)) throw new Error(`no field for ${cardName}`);
  const card = field.find((candidate) => candidate.cardName === cardName);
  if (!card) throw new Error(`card not on field: ${cardName}`);
  return card;
}

// Three face-up Legends without [GO SOLO]: satisfies the fixture's legend
// count and keeps Call a Legend out of the chooser's options.
const FACE_UP_NON_GO_SOLO_LEGENDS = [
  { card: welcomeToNightCityRetailPadreManOfTheCross, faceDown: false },
  { card: prm01RebeccaHavingAMoment, faceDown: false },
  { card: welcomeToNightCityRetailJohnnySilverhandRockingRenegade, faceDown: false },
];

describe("tactical combat heuristics — safe steal", () => {
  it("takes the free Gig steal instead of developing when no blocker can respond", () => {
    const ctx = scenario(
      {
        hand: [welcomeToNightCityRetailAugmentedNegotiators],
        field: [{ card: welcomeToNightCityRetail6thStreetRecruits, spent: false, hasLag: false }],
        eddies: 8,
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
    );

    const decision = tacticalStrategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("attackRival");
  });
});

describe("tactical combat heuristics — numerical pressure", () => {
  const small = createMockUnit({ id: "pressure-small", power: 2 });
  const large = createMockUnit({ id: "pressure-large", power: 7 });
  const blocker = createMockUnit({ id: "pressure-blocker", power: 5, keywords: ["blocker"] });

  it("holds a weak attack at board parity", () => {
    const ctx = scenario(
      { field: [{ card: small, spent: false, hasLag: false }] },
      { field: [{ card: blocker, spent: false }], gigArea: [{ dieType: "d6", faceValue: 2 }] },
    );

    expect(tacticalStrategy.decideAction(ctx)).toMatchObject({
      kind: "command",
      move: "passPhase",
    });
  });

  it("holds a weak attack when the rival has more ready Units", () => {
    const secondBlocker = createMockUnit({
      id: "pressure-second-blocker",
      power: 3,
      keywords: ["blocker"],
    });
    const ctx = scenario(
      { field: [{ card: small, spent: false, hasLag: false }] },
      {
        field: [
          { card: blocker, spent: false },
          { card: secondBlocker, spent: false },
        ],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
    );

    expect(tacticalStrategy.decideAction(ctx)).toMatchObject({
      kind: "command",
      move: "passPhase",
    });
  });

  it("leads with a small attacker when two ready Units pressure one blocker", () => {
    const ctx = scenario(
      {
        field: [
          { card: small, spent: false, hasLag: false },
          { card: large, spent: false, hasLag: false },
        ],
      },
      { field: [{ card: blocker, spent: false }], gigArea: [{ dieType: "d6", faceValue: 2 }] },
    );

    const field = ctx.view.players[P1 as string]?.zones.field;
    const smallId = Array.isArray(field)
      ? field.find((card) => card.effectivePower === 2)?.instanceId
      : undefined;
    expect(smallId).toBeDefined();
    expect(tacticalStrategy.decideAction(ctx)).toMatchObject({
      kind: "command",
      move: "attackRival",
      args: { attackerId: smallId },
    });
  });

  it("does not count a spent spare Unit as attacking pressure", () => {
    const ctx = scenario(
      {
        field: [
          { card: small, spent: false, hasLag: false },
          { card: large, spent: true, hasLag: false },
        ],
      },
      { field: [{ card: blocker, spent: false }], gigArea: [{ dieType: "d6", faceValue: 2 }] },
    );

    expect(tacticalStrategy.decideAction(ctx)).toMatchObject({
      kind: "command",
      move: "passPhase",
    });
  });

  it("does not count a lagging spare Unit as attacking pressure", () => {
    const ctx = scenario(
      {
        field: [
          { card: small, spent: false, hasLag: false },
          { card: large, spent: false, hasLag: true },
        ],
      },
      { field: [{ card: blocker, spent: false }], gigArea: [{ dieType: "d6", faceValue: 2 }] },
    );

    expect(tacticalStrategy.decideAction(ctx)).toMatchObject({
      kind: "command",
      move: "passPhase",
    });
  });

  it("attacks again with the spare Unit after the rival spends its blocker", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: small, spent: false, hasLag: false },
          { card: large, spent: false, hasLag: false },
        ],
      },
      { field: [{ card: blocker, spent: false }], gigArea: [{ dieType: "d6", faceValue: 2 }] },
    );
    const bot = new AIPlayer(engine.getLocalEngine(), P1, tacticalStrategy);

    const first = bot.step();
    expect(first).toMatchObject({ kind: "acted", decision: { move: "attackRival" } });
    if (first.kind !== "acted") return;
    expect(first.decision.args?.attackerId).toBe(engine.findCardId(small, "field", P1));

    engine.resolveAttack({ as: P1 });
    engine.useBlocker(blocker, { as: P2 });
    engine.resolveFullFight({ as: P1 });

    const second = bot.step();
    expect(second).toMatchObject({
      kind: "acted",
      decision: {
        move: "attackRival",
        args: { attackerId: engine.findCardId(large, "field", P1) },
      },
    });
  });
});

describe("tactical combat heuristics — removal fights", () => {
  it("sends the weakest Unit that still wins, preserving the ≥10-power body", () => {
    const ctx = scenario(
      {
        field: [
          { card: welcomeToNightCityRetailTraumaTeamOperatives, spent: false, hasLag: false },
          {
            card: welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetail6thStreetRecruits, spent: true, hasLag: false }],
      },
    );

    const decision = tacticalStrategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("attackUnit");
    expect(decision.args?.attackerId).toBe(fieldCard(ctx, P1, "Trauma Team Operatives").instanceId);
    expect(decision.args?.defenderId).toBe(fieldCard(ctx, "p2", "6th Street Recruits").instanceId);
  });

  it("prefers removing a killable target over developing this prompt", () => {
    const ctx = scenario(
      {
        hand: [welcomeToNightCityRetailAugmentedNegotiators],
        field: [
          { card: welcomeToNightCityRetailTraumaTeamOperatives, spent: false, hasLag: false },
        ],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetail6thStreetRecruits, spent: true, hasLag: false }],
      },
    );

    const decision = tacticalStrategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("attackUnit");
  });
});

describe("tactical card heuristics — Maman Brigitte", () => {
  it("pays two Programs to bottom-deck a high-power unequipped rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailMamanBrigitteSpiritOfDeath,
          welcomeToNightCityRetailCorporateSurveillance,
          welcomeToNightCityRetailFloorIt,
        ],
        eddies: 5,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesRideOrDieChoom,
            spent: false,
            hasLag: false,
          },
        ],
      },
    );
    const firstProgram = engine.getCard(welcomeToNightCityRetailCorporateSurveillance, "hand", P1);
    const secondProgram = engine.getCard(welcomeToNightCityRetailFloorIt, "hand", P1);
    const rivalUnit = engine.getCard(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom,
      "field",
      P2,
    );

    engine.playCard(welcomeToNightCityRetailMamanBrigitteSpiritOfDeath, { as: P1 });

    const discardContext = buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
    const discardDecision = tacticalStrategy.decideAction(discardContext);
    expect(discardDecision).toMatchObject({
      kind: "command",
      move: "resolveDiscardFromHand",
      args: { cardIds: [firstProgram.instanceId, secondProgram.instanceId] },
    });

    if (discardDecision.kind !== "command") return;
    expect(
      engine.executeMove(discardDecision.move, { args: discardDecision.args }, P1),
    ).toMatchObject({ success: true });

    const targetContext = buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
    const targetDecision = tacticalStrategy.decideAction(targetContext);
    expect(targetDecision).toMatchObject({
      kind: "command",
      move: "resolveEffectTarget",
      args: { targetIds: [rivalUnit.instanceId] },
    });
    if (targetDecision.kind !== "command") return;
    expect(
      engine.executeMove(targetDecision.move, { args: targetDecision.args }, P1),
    ).toMatchObject({ success: true });
    expect(engine.getCardsInZone("field", P2).map((card) => card.instanceId)).not.toContain(
      rivalUnit.instanceId,
    );
    expect(engine.getCardsInZone("deck", P2).at(-1)?.instanceId).toBe(rivalUnit.instanceId);
  });

  it("does not offer an unpaid discard when fewer than two Programs are eligible", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailMamanBrigitteSpiritOfDeath,
          welcomeToNightCityRetailCorporateSurveillance,
        ],
        eddies: 5,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesRideOrDieChoom,
            spent: false,
            hasLag: false,
          },
        ],
      },
    );
    engine.playCard(welcomeToNightCityRetailMamanBrigitteSpiritOfDeath, { as: P1 });

    engine.expectNoPendingChoice();
    const ctx = buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
    expect(tacticalStrategy.decideAction(ctx)).toMatchObject({
      kind: "command",
      move: "passPhase",
    });
  });
});

describe("tactical combat heuristics — gear power planning", () => {
  it("crosses the 10-power steal breakpoint instead of padding a small body", () => {
    const ctx = scenario(
      {
        hand: [welcomeToNightCityRetailMantisBlades],
        legendArea: FACE_UP_NON_GO_SOLO_LEGENDS,
        field: [
          {
            card: welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
            spent: false,
            hasLag: false,
          },
          { card: welcomeToNightCityRetailElSombreronLaVenganzaLenta, spent: false, hasLag: false },
        ],
        eddies: 2,
      },
      {
        field: [
          { card: welcomeToNightCityRetailAugmentedNegotiators, spent: false, hasLag: false },
        ],
      },
    );

    const decision = tacticalStrategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("playCard");
    expect(decision.args?.attachToId).toBe(fieldCard(ctx, P1, "Alt Cunningham").instanceId);
  });
});

describe("tactical combat heuristics — legend gear hold", () => {
  it("does not attach a plain-power Gear to a face-up Legend without [GO SOLO]", () => {
    const ctx = scenario(
      {
        hand: [welcomeToNightCityRetailMantisBlades],
        legendArea: FACE_UP_NON_GO_SOLO_LEGENDS,
        eddies: 5,
      },
      {},
    );

    const decision = tacticalStrategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).not.toBe("playCard");
  });

  it("still equips the Unit when a real host is on the field", () => {
    const ctx = scenario(
      {
        hand: [welcomeToNightCityRetailMantisBlades],
        field: [{ card: welcomeToNightCityRetail6thStreetRecruits, spent: false, hasLag: false }],
        legendArea: FACE_UP_NON_GO_SOLO_LEGENDS,
        eddies: 2,
      },
      {},
    );

    const decision = tacticalStrategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("playCard");
    expect(decision.args?.attachToId).toBe(fieldCard(ctx, P1, "6th Street Recruits").instanceId);
  });
});
