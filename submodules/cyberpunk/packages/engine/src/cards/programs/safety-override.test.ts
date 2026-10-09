import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailPlacideVoodooSentinel,
  welcomeToNightCityRetailSafetyOverride,
  welcomeToNightCityRetailMaelstromZealots,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../testing/index.ts";

describe("Safety Override (registration)", () => {
  it("has the exact yellow Quickhack identity and one-turn loss trigger", () => {
    expect(welcomeToNightCityRetailSafetyOverride).toMatchObject({
      canonicalId: "safety-override",
      slug: "safety-override",
      name: "Safety Override",
      displayName: "Safety Override",
      type: "program",
      color: "yellow",
      classifications: ["Quickhack"],
      cost: 2,
      power: null,
      ram: 3,
      hasSellTag: true,
      rarity: "Common",
      printNumber: "069",
      keywords: ["quick"],
      timingTriggers: ["play"],
      rulesText:
        "{Quick} The next time a friendly Unit loses a fight this turn, defeat the opposing rival Unit.",
      reminderText: ["Discard programs after they resolve."],
      abilities: [
        { kind: "keyword", keyword: "quick" },
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [{ effect: "grantNextFriendlyFightLossDefeat", duration: "turn" }],
        },
      ],
    });
  });

  it("pays exactly 2 Eddies, resolves, and moves to trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSafetyOverride],
      eddies: 2,
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSafetyOverride.id,
    );
  });
});

describe("Safety Override — next time a friendly Unit loses a fight this turn, defeat the opposing rival Unit", () => {
  for (const first of ["Safety Override", "Maelstrom Zealots"] as const) {
    it(`lets one controller choose ${first} first among authored and delayed fight effects`, () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [welcomeToNightCityRetailSafetyOverride],
          field: [{ card: welcomeToNightCityRetailMaelstromZealots, spent: false, hasLag: false }],
          eddies: 2,
        },
        { field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: true, hasLag: false }] },
      );
      engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });
      expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
        welcomeToNightCityRetailSafetyOverride.id,
      );
      engine.attackUnit(
        welcomeToNightCityRetailMaelstromZealots,
        welcomeToNightCityRetailOffdutyMalfini,
        { as: P1 },
      );
      engine.resolveFullFight({ as: P1 });
      const choice = engine.getPrompt(P1).choice;
      expect(choice?.type).toBe("chooseTrigger");
      if (choice?.type !== "chooseTrigger") throw new Error("Expected fight-effect order choice");
      expect(choice.payload.options.map((option) => option.cardName)).toEqual(
        expect.arrayContaining([
          welcomeToNightCityRetailSafetyOverride.displayName,
          welcomeToNightCityRetailMaelstromZealots.displayName,
        ]),
      );
      const selected = choice.payload.options.find((option) => option.cardName === first);
      if (!selected) throw new Error(`Expected ${first} trigger option`);
      engine.executeMove("resolveTrigger", { args: { triggerId: selected.triggerId } }, P1);
      engine.resolveFullFight({ as: P1 });
      expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
        welcomeToNightCityRetailOffdutyMalfini.id,
      );
    });
  }

  it("uses both copies on the first loss, leaving no override for a later loss", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride, welcomeToNightCityRetailSafetyOverride],
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
        eddies: 4,
      },
      {
        field: [
          { card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: true },
          { card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: true },
        ],
      },
    );
    const attackers = engine
      .getCardsInZone("field", P1)
      .filter((card) => card.definitionId === welcomeToNightCityRetailFieldOperator.id);
    const defenders = engine
      .getCardsInZone("field", P2)
      .filter((card) => card.definitionId === welcomeToNightCityRetailPlacideVoodooSentinel.id);
    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });
    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });

    engine.attackUnit(attackers[0]!.instanceId, defenders[0]!.instanceId, { as: P1 });
    engine.resolveFullFight({ as: P1 });
    for (let guard = 0; guard < 3; guard += 1) {
      const choice = engine.getPrompt(P1).choice;
      if (choice?.type !== "chooseTrigger") break;
      engine.executeMove(
        "resolveTrigger",
        { args: { triggerId: choice.payload.options[0]!.triggerId } },
        P1,
      );
    }
    engine.resolveFullFight({ as: P1 });
    expect(engine.getCard(defenders[0]!.instanceId).zone).toBe("trash");

    engine.attackUnit(attackers[1]!.instanceId, defenders[1]!.instanceId, { as: P1 });
    engine.resolveFullFight({ as: P1 });
    expect(engine.getCard(defenders[1]!.instanceId).zone).toBe("field");
    expect(engine.getCard(attackers[1]!.instanceId).zone).toBe("trash");
  });

  it("can be played as a QUICK reaction and defeats the rival attacker when the defender loses", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
        eddies: 2,
      },
      {
        field: [
          { card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: false, hasLag: false },
        ],
      },
    );
    engine.completeTurn({ as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailPlacideVoodooSentinel,
      welcomeToNightCityRetailFieldOperator,
      { as: P2 },
    );
    engine.resolveAttack({ as: P2 });

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });
    engine.resolveAttack({ as: P1, pass: true });
    engine.resolveAttack({ as: P2 });
    engine.resolveAttack({ as: P2 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailSafetyOverride.id,
        welcomeToNightCityRetailFieldOperator.id,
      ]),
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailPlacideVoodooSentinel.id,
    );
  });

  it("defeats the opposing rival Unit when a friendly Unit loses a fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailPlacideVoodooSentinel,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailFieldOperator.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((card) => card.definitionId === welcomeToNightCityRetailPlacideVoodooSentinel.id),
    ).toBe(true);
  });

  it("is consumed after one friendly loss (single use)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });

    const hasSafetyEffect = () =>
      engine
        .getState()
        .G.activeEffects.some((e) => e.kind === "defeatRivalOnNextFriendlyFightLoss");

    expect(hasSafetyEffect()).toBe(true);

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailPlacideVoodooSentinel,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });
    expect(hasSafetyEffect()).toBe(false);
  });

  it("is consumed when equal-power Units both lose the fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
      },
    );
    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailFieldOperator,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(
      engine
        .getState()
        .G.activeEffects.some((effect) => effect.kind === "defeatRivalOnNextFriendlyFightLoss"),
    ).toBe(false);
  });

  it("does not trigger when a friendly Unit wins the fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailFieldOperator,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(
      engine
        .getState()
        .G.activeEffects.some((e) => e.kind === "defeatRivalOnNextFriendlyFightLoss"),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((card) => card.definitionId === welcomeToNightCityRetailFieldOperator.id),
    ).toBe(true);
  });

  it("expires at end of turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });
    engine.completeTurn();
    engine.completeTurn();

    expect(
      engine
        .getState()
        .G.activeEffects.some((e) => e.kind === "defeatRivalOnNextFriendlyFightLoss"),
    ).toBe(false);
  });

  it("is a no-op while no friendly Unit loses a fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        eddies: 2,
      },
      {},
    );

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });

    expect(
      engine
        .getState()
        .G.activeEffects.some((e) => e.kind === "defeatRivalOnNextFriendlyFightLoss"),
    ).toBe(true);
    expect(engine.getCardsInZone("trash", P2)).toHaveLength(0);
  });

  it("defeats only the opposing rival Unit, not a bystander", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [
          { card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: true },
          { card: welcomeToNightCityRetailOffdutyMalfini, spent: false },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailPlacideVoodooSentinel,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((card) => card.definitionId === welcomeToNightCityRetailOffdutyMalfini.id),
    ).toBe(false);
  });

  it("declares a Quick play trigger that grants a one-turn friendly-fight-loss defeat", () => {
    const card = welcomeToNightCityRetailSafetyOverride;
    expect(card.keywords).toContain("quick");
    const ability = card.abilities.find((a) => a.kind === "triggered")!;
    expect(ability.trigger).toMatchObject({ trigger: "play" });
    expect(ability.effects.map((e) => e.effect)).toEqual(["grantNextFriendlyFightLossDefeat"]);
    expect(ability.effects[0]).toMatchObject({
      effect: "grantNextFriendlyFightLossDefeat",
      duration: "turn",
    });
  });
});
