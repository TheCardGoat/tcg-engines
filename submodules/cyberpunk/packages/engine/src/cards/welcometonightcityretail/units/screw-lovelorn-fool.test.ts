import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailLiveWithTheAftermath,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailRebootOptics,
  welcomeToNightCityRetailScrewLovelornFool,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const aftermath = welcomeToNightCityRetailLiveWithTheAftermath;

describe("Screw - Lovelorn Fool", () => {
  it("has the exact red Maelstrom identity and mandatory other-friendly-Unit recovery trigger", () => {
    expect(welcomeToNightCityRetailScrewLovelornFool).toMatchObject({
      canonicalId: "screw-lovelorn-fool",
      slug: "screw-lovelorn-fool",
      name: "Screw",
      displayName: "Screw: Lovelorn Fool",
      subname: "Lovelorn Fool",
      type: "unit",
      color: "red",
      classifications: ["Ganger", "Maelstrom"],
      cost: 5,
      power: 7,
      ram: 2,
      hasSellTag: false,
      rarity: "Common",
      printNumber: "018",
      rulesText: "{Defeated} Add another Unit from your trash to your hand.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "defeated" },
          source: { selector: "self" },
          effects: [
            {
              effect: "moveCard",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["trash"],
                cardTypes: ["unit"],
                excludeSelf: true,
                selection: { mode: "choose", min: 1, max: 1 },
              },
              destination: "hand",
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 5 to play and enters with Lag", () => {
    const successEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailScrewLovelornFool],
      eddies: 5,
    });
    for (const legend of successEngine.getCardsInZone("legendArea", P1)) {
      successEngine.judgeSpendCard(legend, { as: P1 });
    }
    successEngine.playCard(welcomeToNightCityRetailScrewLovelornFool, { as: P1 });
    expect(successEngine.getEddies(P1)).toBe(0);
    expect(
      successEngine.getCard(welcomeToNightCityRetailScrewLovelornFool, "field", P1).meta.hasLag,
    ).toBe(true);

    const failureEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailScrewLovelornFool],
      eddies: 4,
    });
    for (const legend of failureEngine.getCardsInZone("legendArea", P1)) {
      failureEngine.judgeSpendCard(legend, { as: P1 });
    }
    expect(() =>
      failureEngine.playCard(welcomeToNightCityRetailScrewLovelornFool, { as: P1 }),
    ).toThrow(/INSUFFICIENT_EDDIES/);
  });

  it("offers exactly one other friendly Unit, excluding non-Units and rival trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailScrewLovelornFool,
            spent: false,
            hasLag: false,
          },
        ],
        trash: [
          welcomeToNightCityRetailMoxInciters,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailDyingNightVSPistol,
          welcomeToNightCityRetailRebootOptics,
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 5 }],
        trash: [welcomeToNightCityRetailOffdutyMalfini],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailScrewLovelornFool,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("Expected Screw's mandatory trash recovery choice.");
    }
    const eligibleIds = [
      welcomeToNightCityRetailMoxInciters,
      welcomeToNightCityRetailFieldOperator,
    ].map((card) => engine.findCardId(card, "trash", P1) as string);
    const excludedIds = [
      engine.findCardId(welcomeToNightCityRetailScrewLovelornFool, "trash", P1),
      engine.findCardId(welcomeToNightCityRetailDyingNightVSPistol, "trash", P1),
      engine.findCardId(welcomeToNightCityRetailRebootOptics, "trash", P1),
      engine.findCardId(welcomeToNightCityRetailOffdutyMalfini, "trash", P2),
    ] as string[];
    expect(choice.payload).toMatchObject({ min: 1, max: 1 });
    expect(choice.payload.eligibleIds).toEqual(expect.arrayContaining(eligibleIds));
    expect(choice.payload.eligibleIds).not.toEqual(expect.arrayContaining(excludedIds));

    engine.resolveEffectTargetIds([eligibleIds[0]!], { as: P1 });
    expect(engine.getCardsInZone("hand", P1).map((card) => card.instanceId)).toContain(
      eligibleIds[0],
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.instanceId)).toContain(
      eligibleIds[1],
    );
  });

  it("adds another Unit from trash to hand when defeated", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailScrewLovelornFool,
            spent: false,
            hasLag: false,
          },
        ],
        trash: [welcomeToNightCityRetailMoxInciters],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 5 }],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailScrewLovelornFool,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMoxInciters, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailScrewLovelornFool.id,
    );
  });

  it("does not offer itself as the Unit returned from trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailScrewLovelornFool,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 5 }],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailScrewLovelornFool,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailScrewLovelornFool.id,
    );
  });

  it("adds a Unit from trash to hand when defeated by an effect (Live with the Aftermath)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [aftermath],
        eddies: 3,
        field: [welcomeToNightCityRetailMoxInciters, welcomeToNightCityRetailScrewLovelornFool],
        trash: [welcomeToNightCityRetailCorpoSecurity],
      },
      {
        field: [welcomeToNightCityRetailSwordwiseHuscle],
      },
    );

    engine.playCard(aftermath, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailScrewLovelornFool, {
      as: P1,
      allowPendingChoice: true,
      reason: "the rival must now choose their own Unit",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, {
      as: P2,
      allowPendingChoice: true,
      reason: "Screw's {Defeated} trigger still needs a Unit from trash",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([aftermath.id, welcomeToNightCityRetailScrewLovelornFool.id]),
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});
