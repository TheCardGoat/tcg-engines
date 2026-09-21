import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKiroshiOptics,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectAttachTarget } from "../../../testing/index.ts";

describe("Kiroshi Optics (retail)", () => {
  function getAttachTargets(engine: CyberpunkTestEngine): string[] {
    const gearId = engine.getCard(welcomeToNightCityRetailKiroshiOptics, "hand", P1).instanceId;
    const playMove = engine.getPrompt(P1).availableMoves.find((move) => move.moveId === "playCard");
    if (!playMove || playMove.inputSpec.type !== "playCard") return [];
    return (
      playMove.inputSpec.candidates.find((candidate) => candidate.cardId === gearId)
        ?.attachTargets ?? []
    );
  }

  it("is the exact yellow 1-cost Cyberware Gear with its host Attack ability", () => {
    expect(welcomeToNightCityRetailKiroshiOptics).toMatchObject({
      type: "gear",
      color: "yellow",
      classifications: ["Cyberware"],
      printNumber: "061",
      cost: 1,
      power: 1,
      ram: 1,
      hasSellTag: true,
      timingTriggers: ["attack"],
      abilities: [
        expect.objectContaining({
          trigger: { trigger: "attack" },
          source: { selector: "host" },
          effects: [
            expect.objectContaining({
              effect: "lookAt",
              revealToOpponent: false,
            }),
          ],
        }),
      ],
    });
  });

  it("can equip to a friendly Unit or face-up Legend, but not a face-down Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailKiroshiOptics],
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      legendArea: [
        { card: theHeistRetailStarterDeckVCorporateExile, faceDown: false },
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
      ],
      eddies: 1,
    });

    expectAttachTarget(
      engine,
      welcomeToNightCityRetailKiroshiOptics,
      welcomeToNightCityRetailFieldOperator,
    );
    const attachTargets = getAttachTargets(engine);
    expect(attachTargets).toContain(
      engine.getCard(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1).instanceId,
    );
    expect(attachTargets).not.toContain(
      engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, "legendArea", P1)
        .instanceId,
    );
  });

  it("looks at a friendly face-down legend without revealing it", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [welcomeToNightCityRetailKiroshiOptics],
        },
      ],
      legendArea: [
        { card: theHeistRetailStarterDeckVCorporateExile, faceDown: true },
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: false },
      ],
    });
    const faceDownLegendId = engine.findCardId(
      theHeistRetailStarterDeckVCorporateExile,
      "legendArea",
      P1,
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type === "chooseTarget") {
      expect(choice.payload.eligibleIds).toEqual([faceDownLegendId]);
      expect(choice.payload.canDecline).toBe(false);
      expect(choice.payload.min).toBe(1);
      expect(choice.payload.max).toBe(1);
    }
    expect(
      engine.resolveEffectTarget(theHeistRetailStarterDeckVCorporateExile, { as: P1 }),
    ).toMatchObject({
      success: true,
    });

    // Look-at must not flip the legend.
    expect(engine.getCard(faceDownLegendId, "legendArea", P1).meta.faceDown).toBe(true);
    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getFilteredView(P2).players.p1?.zones.legendArea).toContainEqual(
      expect.objectContaining({
        instanceId: faceDownLegendId,
        definitionId: "",
        cardName: null,
        faceDown: true,
        revealed: false,
      }),
    );
    const lookEvents = engine.getEvents("cardsRevealed");
    expect(lookEvents.some((event) => event.playerId === P1)).toBe(true);
    expect(lookEvents.some((event) => event.playerId === P2)).toBe(false);
  });

  it("does not target a rival face-down Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
        legendArea: [
          {
            card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
            faceDown: false,
          },
        ],
      },
      { legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: true }] },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getEvents("cardsRevealed")).toEqual([]);
  });

  it("does not open a target choice when no friendly face-down Legend exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [welcomeToNightCityRetailKiroshiOptics],
        },
      ],
      legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
    });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
  });
});
