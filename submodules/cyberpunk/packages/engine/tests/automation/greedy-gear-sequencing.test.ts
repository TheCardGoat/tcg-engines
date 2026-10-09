import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailYorinobuArasakaSteelDragon,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { AIPlayer, buildDecisionContext } from "../../src/automation/index.ts";
import { greedyStrategy } from "../../src/automation/strategies/greedy.ts";
import {
  CyberpunkTestEngine,
  P1,
  createMockGear,
  createMockUnit,
} from "../../src/testing/index.ts";

describe("Greedy bot gear sequencing", () => {
  it("equips Yorinobu before the turn-11 attack from the reported match", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailZetatechFaceplate],
        field: [
          { card: welcomeToNightCityRetailYorinobuArasakaSteelDragon, spent: false, hasLag: false },
        ],
        eddies: 7,
      },
      { gigArea: [4, 3, 3] },
    );
    const host = engine.getCard(welcomeToNightCityRetailYorinobuArasakaSteelDragon, "field", P1);
    const gear = engine.getCard(welcomeToNightCityRetailZetatechFaceplate, "hand", P1);
    expect(
      greedyStrategy.decideAction(buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5)),
    ).toMatchObject({
      kind: "command",
      move: "playCard",
      args: { cardId: gear.instanceId, attachToId: host.instanceId },
    });
    const bot = new AIPlayer(engine.getLocalEngine(), P1, greedyStrategy);
    expect(bot.step()).toMatchObject({ kind: "acted", decision: { move: "playCard" } });
    expect(bot.step()).toMatchObject({
      kind: "acted",
      decision: { move: "attackRival", args: { attackerId: host.instanceId } },
    });
  });

  it.each(["direct", "fight"])("equips power gear before a %s attack", (kind) => {
    const host = createMockUnit({ id: "gear-sequence-host", power: kind === "direct" ? 9 : 5 });
    const gear = createMockGear({ id: "gear-sequence-gear", power: 2, cost: 2 });
    const rival = createMockUnit({ id: "gear-sequence-rival", power: 3 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [gear], field: [{ card: host, spent: false, hasLag: false }], eddies: 2 },
      kind === "direct"
        ? {
            gigArea: [
              { dieType: "d6", faceValue: 3 },
              { dieType: "d8", faceValue: 4 },
            ],
          }
        : { field: [{ card: rival, spent: true }] },
    );
    const bot = new AIPlayer(engine.getLocalEngine(), P1, greedyStrategy);
    expect(bot.step()).toMatchObject({ kind: "acted", decision: { move: "playCard" } });
    expect(bot.step()).toMatchObject({
      kind: "acted",
      decision: { move: kind === "direct" ? "attackRival" : "attackUnit" },
    });
    if (kind === "direct") {
      engine.resolveFullSteal();
      expect(engine.getGigCount(P1)).toBe(2);
    }
  });

  it.each(["unaffordable", "other-host", "zero-power"])(
    "does not delay an attack for %s gear",
    (condition) => {
      const host = createMockUnit({ id: "sequence-attacker", power: 5 });
      const other = createMockUnit({ id: "sequence-spent-host", power: 9 });
      const gear = createMockGear({
        id: "sequence-unhelpful-gear",
        power: condition === "zero-power" ? 0 : 2,
        cost: 2,
      });
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [gear],
          field: [
            { card: host, spent: false, hasLag: false },
            ...(condition === "other-host" ? [{ card: other, spent: true, hasLag: false }] : []),
          ],
          eddies: condition === "unaffordable" ? 0 : 2,
        },
        { gigArea: [3] },
      );
      engine.spendAllLegends();
      expect(new AIPlayer(engine.getLocalEngine(), P1, greedyStrategy).step()).toMatchObject({
        kind: "acted",
        decision: { move: "attackRival" },
      });
    },
  );
});
