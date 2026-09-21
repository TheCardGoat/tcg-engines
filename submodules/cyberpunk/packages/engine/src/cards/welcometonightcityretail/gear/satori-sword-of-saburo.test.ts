import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailSatoriSwordOfSaburo,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Satori — Sword of Saburo (retail)", () => {
  it("has the exact red Arasaka Weapon identity, attachment scope, and symmetric win trigger", () => {
    expect(welcomeToNightCityRetailSatoriSwordOfSaburo).toMatchObject({
      canonicalId: "satori-sword-of-saburo",
      slug: "satori-sword-of-saburo",
      name: "Satori",
      displayName: "Satori: Sword of Saburo",
      subname: "Sword of Saburo",
      type: "gear",
      color: "red",
      classifications: ["Arasaka", "Weapon"],
      cost: 2,
      power: 2,
      ram: 1,
      hasSellTag: true,
      rarity: "Uncommon",
      printNumber: "026",
      rulesText:
        "(Equip to a friendly Unit or face-up Legend.)\nWhen this Unit wins a fight against a rival Unit, draw 1.",
      attachment: {
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field", "legendArea"],
          cardTypes: ["unit", "legend"],
          face: "faceUp",
        },
      },
      abilities: [
        {
          kind: "triggered",
          trigger: {
            trigger: "event",
            event: { event: "fightResolved", player: "any", winner: { selector: "host" } },
          },
          source: { selector: "host" },
          effects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    });
  });

  it("pays exactly 2, attaches publicly to a friendly Unit, and grants 2 power", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSatoriSwordOfSaburo],
      field: [welcomeToNightCityRetailOffdutyMalfini],
      eddies: 2,
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.attachGear(
      welcomeToNightCityRetailSatoriSwordOfSaburo,
      welcomeToNightCityRetailOffdutyMalfini,
      { as: P1 },
    );

    const host = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);
    const gear = engine.getCard(welcomeToNightCityRetailSatoriSwordOfSaburo, "field", P1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(host.meta.attachedGearIds).toContain(gear.instanceId);
    expect(gear.meta.attachedToId).toBe(host.instanceId);
    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailOffdutyMalfini.power + 2,
    );
  });

  it("offers only a friendly Unit or face-up Legend as public attachment targets", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSatoriSwordOfSaburo],
        field: [welcomeToNightCityRetailOffdutyMalfini],
        legendArea: [
          { card: theHeistRetailStarterDeckVCorporateExile, faceDown: false },
          { card: theHeistRetailStarterDeckVCorporateExile, faceDown: true },
        ],
        eddies: 2,
      },
      { field: [welcomeToNightCityRetailFieldOperator] },
    );
    const gearId = engine.getCard(
      welcomeToNightCityRetailSatoriSwordOfSaburo,
      "hand",
      P1,
    ).instanceId;
    const playMove = engine.getPrompt(P1).availableMoves.find((move) => move.moveId === "playCard");
    if (!playMove || playMove.inputSpec.type !== "playCard") {
      throw new Error("Expected the public play-card command.");
    }
    const candidate = playMove.inputSpec.candidates.find((entry) => entry.cardId === gearId);
    const friendlyUnitId = engine.getCard(
      welcomeToNightCityRetailOffdutyMalfini,
      "field",
      P1,
    ).instanceId;
    const legends = engine
      .getCardsInZone("legendArea", P1)
      .filter((card) => card.definitionId === theHeistRetailStarterDeckVCorporateExile.id);
    const faceUpLegendId = legends.find((card) => !card.meta.faceDown)?.instanceId;
    const faceDownLegendId = legends.find((card) => card.meta.faceDown)?.instanceId;
    const rivalUnitId = engine.getCard(
      welcomeToNightCityRetailFieldOperator,
      "field",
      P2,
    ).instanceId;

    expect(candidate?.attachTargets).toEqual(
      expect.arrayContaining([friendlyUnitId, faceUpLegendId]),
    );
    expect(candidate?.attachTargets).not.toEqual(
      expect.arrayContaining([faceDownLegendId, rivalUnitId]),
    );
  });

  it("draws 1 after the equipped attacker wins a fight against a rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        // Offduty Malfini (5) + Satori (2) > Corpo Security (2)
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailSatoriSwordOfSaburo],
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore + 1);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("draws 1 after the equipped defender wins a fight against a rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: true,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailSatoriSwordOfSaburo],
          },
        ],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
          },
        ],
      },
      { activePlayerId: P2, preserveDeckOrder: true },
    );

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailOffdutyMalfini,
      { as: P2 },
    );
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("does not draw when the equipped Unit loses the fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailSatoriSwordOfSaburo],
          },
        ],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
          },
        ],
      },
      { activePlayerId: P2, preserveDeckOrder: true },
    );

    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailFieldOperator,
      { as: P2 },
    );
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("wins normally but draws nothing when its controller's deck is empty", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: 0,
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailSatoriSwordOfSaburo],
          },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );

    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(0);
  });

  it("does not draw on a direct attack (no fight, no win-fight trigger)", () => {
    // Printed text: "When this Unit wins a fight against a rival Unit, draw 1."
    // A direct attack on the rival doesn't enter the fight step, so the
    // win-fight trigger never fires even though the attacker "wins".
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailSatoriSwordOfSaburo],
          },
        ],
      },
      {
        // No ready rival units → direct attack is the only option.
      },
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;

    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
  });
});
