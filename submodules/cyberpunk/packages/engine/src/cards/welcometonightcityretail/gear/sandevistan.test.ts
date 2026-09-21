import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailSandevistan,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Sandevistan (retail)", () => {
  it("has the exact green Cyberware identity, attachment scope, and end-turn ready trigger", () => {
    expect(welcomeToNightCityRetailSandevistan).toMatchObject({
      canonicalId: "sandevistan",
      slug: "sandevistan",
      name: "Sandevistan",
      displayName: "Sandevistan",
      type: "gear",
      color: "green",
      classifications: ["Cyberware"],
      cost: 3,
      power: 2,
      ram: 3,
      hasSellTag: true,
      rarity: "Uncommon",
      printNumber: "095",
      rulesText:
        "(Equip to a friendly Unit or face-up Legend.)\nAt the end of your turn, ready this Unit or Legend.",
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
          trigger: { trigger: "event", event: { event: "turnEnded", player: "friendly" } },
          source: { selector: "host" },
          effects: [{ effect: "ready", target: { selector: "host" } }],
        },
      ],
    });
  });

  it("pays exactly 3, attaches publicly to a friendly Unit, and grants 2 power", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSandevistan],
      field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
      eddies: 3,
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.attachGear(
      welcomeToNightCityRetailSandevistan,
      welcomeToNightCityRetailSwordwiseHuscle,
      { as: P1 },
    );

    const host = engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    const gear = engine.getCard(welcomeToNightCityRetailSandevistan, "field", P1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(host.meta.attachedGearIds).toContain(gear.instanceId);
    expect(gear.meta.attachedToId).toBe(host.instanceId);
    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailSwordwiseHuscle.power + 2,
    );
  });

  it("offers only a friendly Unit or face-up Legend as public attachment targets", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSandevistan],
        field: [welcomeToNightCityRetailSwordwiseHuscle],
        legendArea: [
          { card: theHeistRetailStarterDeckVCorporateExile, faceDown: false },
          { card: theHeistRetailStarterDeckVCorporateExile, faceDown: true },
        ],
        eddies: 3,
      },
      { field: [welcomeToNightCityRetailOffdutyMalfini] },
    );
    const gearId = engine.getCard(welcomeToNightCityRetailSandevistan, "hand", P1).instanceId;
    const playMove = engine.getPrompt(P1).availableMoves.find((move) => move.moveId === "playCard");
    if (!playMove || playMove.inputSpec.type !== "playCard") {
      throw new Error("Expected the public play-card command.");
    }
    const candidate = playMove.inputSpec.candidates.find((entry) => entry.cardId === gearId);
    const friendlyUnitId = engine.getCard(
      welcomeToNightCityRetailSwordwiseHuscle,
      "field",
      P1,
    ).instanceId;
    const legends = engine
      .getCardsInZone("legendArea", P1)
      .filter((card) => card.definitionId === theHeistRetailStarterDeckVCorporateExile.id);
    const faceUpLegendId = legends.find((card) => !card.meta.faceDown)?.instanceId;
    const faceDownLegendId = legends.find((card) => card.meta.faceDown)?.instanceId;
    const rivalUnitId = engine.getCard(
      welcomeToNightCityRetailOffdutyMalfini,
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

  it("readies the equipped Unit host at the end of its controller's turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailSwordwiseHuscle,
          spent: true,
          hasLag: false,
          attachedGears: [welcomeToNightCityRetailSandevistan],
        },
      ],
    });

    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      true,
    );

    engine.completeTurn({ as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      false,
    );
  });

  it("readies an equipped face-up Legend at the end of its controller's turn", () => {
    // Printed text: "(Equip to a friendly Unit or face-up Legend.) At the end
    // of your turn, ready this Unit or Legend." Exercise the Legend branch.
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: theHeistRetailStarterDeckVCorporateExile,
          faceDown: false,
          attachedGears: [welcomeToNightCityRetailSandevistan],
        },
      ],
    });

    // Fixture setup auto-readies legends; spend it explicitly so Sandevistan
    // has work to do at end of turn.
    engine.judgeSpendCard(theHeistRetailStarterDeckVCorporateExile, { as: P1 });
    expect(
      engine.getCard(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1).meta.spent,
    ).toBe(true);

    engine.completeTurn({ as: P1 });

    expect(
      engine.getCard(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1).meta.spent,
    ).toBe(false);
  });
});
