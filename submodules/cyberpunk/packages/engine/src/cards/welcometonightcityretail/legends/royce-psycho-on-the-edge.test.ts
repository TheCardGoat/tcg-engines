import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAdamSmasherMetalOverMeat,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRoycePsychoOnTheEdge,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2, expectAttackCandidate } from "../../../testing/index.ts";

describe("Royce - Psycho on the Edge", () => {
  it("has the exact red Ganger Maelstrom GO SOLO identity and turn-scoped Gear scaling", () => {
    expect(welcomeToNightCityRetailRoycePsychoOnTheEdge).toMatchObject({
      canonicalId: "royce-psycho-on-the-edge",
      slug: "royce-psycho-on-the-edge",
      name: "Royce",
      subname: "Psycho on the Edge",
      displayName: "Royce: Psycho on the Edge",
      type: "legend",
      color: "red",
      classifications: ["Ganger", "Maelstrom"],
      cost: 6,
      power: 6,
      ram: 2,
      hasSellTag: true,
      rarity: "Rare",
      printNumber: "004",
      keywords: ["goSolo"],
      rulesText:
        "{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\nDuring your turn, this Legend has +2 power for each of its equipped Gear.",
      abilities: [
        { kind: "keyword", keyword: "goSolo" },
        {
          kind: "static",
          effects: [
            {
              effect: "modifyPower",
              target: { selector: "self" },
              value: {
                type: "perCount",
                multiplier: 2,
                target: {
                  selector: "card",
                  controller: "friendly",
                  cardTypes: ["gear"],
                  attachedTo: { selector: "self" },
                },
              },
              duration: "continuous",
              conditions: [{ condition: "turn", player: "friendly" }],
            },
          ],
        },
      ],
    });
  });

  it("goes solo as a ready Unit that can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
      eddies: 6,
    });
    const royceId = engine.findCardId(
      welcomeToNightCityRetailRoycePsychoOnTheEdge,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: royceId as string } }, P1);

    expect(result.success).toBe(true);
    expect(engine.getEddies(P1)).toBe(1);
    expectAttackCandidate(engine, welcomeToNightCityRetailRoycePsychoOnTheEdge, { as: P1 });
  });

  it("uses its own Sell Tag but rejects GO SOLO one Eddie below the exact cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
      eddies: 4,
    });
    const royceId = engine.findCardId(
      welcomeToNightCityRetailRoycePsychoOnTheEdge,
      "legendArea",
      P1,
    );

    expect(engine.executeMove("goSolo", { args: { cardId: royceId as string } }, P1)).toMatchObject(
      { success: false, errorCode: "INSUFFICIENT_EDDIES" },
    );
    expect(engine.getEddies(P1)).toBe(4);
    expect(
      engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge, "legendArea", P1),
    ).toBeDefined();
  });

  it("is removed from the game rather than trashed after GO SOLO when it leaves the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAdamSmasherMetalOverMeat],
      legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
      eddies: 20,
    });
    const royceId = engine.findCardId(
      welcomeToNightCityRetailRoycePsychoOnTheEdge,
      "legendArea",
      P1,
    );

    engine.executeMove("goSolo", { args: { cardId: royceId as string } }, P1);
    engine.playCard(welcomeToNightCityRetailAdamSmasherMetalOverMeat, { as: P1 });

    expect(engine.getCardsInZone("removedFromGame", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRoycePsychoOnTheEdge.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailRoycePsychoOnTheEdge.id,
    );
  });

  it("gets +2 power per attached Gear only during your turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailRoycePsychoOnTheEdge,
          faceDown: false,
          spent: false,
          hasLag: false,
          attachedGears: [
            welcomeToNightCityRetailMantisBlades,
            welcomeToNightCityRetailZetatechFaceplate,
          ],
        },
      ],
    });
    const royceId = engine.findCardId(welcomeToNightCityRetailRoycePsychoOnTheEdge, "field", P1);
    const attachedGearPower =
      welcomeToNightCityRetailMantisBlades.power + welcomeToNightCityRetailZetatechFaceplate.power;

    expect(getEffectivePower(engine.getState(), royceId)).toBe(
      welcomeToNightCityRetailRoycePsychoOnTheEdge.power + attachedGearPower + 4,
    );

    engine.completeTurn({ as: P1 });

    expect(getEffectivePower(engine.getState(), royceId)).toBe(
      welcomeToNightCityRetailRoycePsychoOnTheEdge.power + attachedGearPower,
    );

    engine.completeTurn({ as: P2 });
    expect(getEffectivePower(engine.getState(), royceId)).toBe(
      welcomeToNightCityRetailRoycePsychoOnTheEdge.power + attachedGearPower + 4,
    );
  });

  it("counts only Gear attached to Royce and grants no extra power with none", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        { card: welcomeToNightCityRetailRoycePsychoOnTheEdge, spent: false, hasLag: false },
        {
          card: welcomeToNightCityRetailCorpoSecurity,
          spent: false,
          hasLag: false,
          attachedGears: [welcomeToNightCityRetailMantisBlades],
        },
      ],
    });
    const royceId = engine.findCardId(welcomeToNightCityRetailRoycePsychoOnTheEdge, "field", P1);

    expect(getEffectivePower(engine.getState(), royceId)).toBe(6);
  });
});
