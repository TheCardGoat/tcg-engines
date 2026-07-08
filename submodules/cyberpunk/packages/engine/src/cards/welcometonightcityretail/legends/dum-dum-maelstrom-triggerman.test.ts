import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailDumDumMaelstromTriggerman,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Dum Dum - Maelstrom Triggerman", () => {
  it("defeats a friendly Gear on call and draws 2 if you do", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        field: [
          {
            card: welcomeToNightCityRetailSwordwiseHuscle,
            spent: false,
            playedThisTurn: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
        legendArea: [{ card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: true }],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.callLegend(welcomeToNightCityRetailDumDumMaelstromTriggerman, { as: P1 });
    engine.resolveCardToMove(welcomeToNightCityRetailKiroshiOptics, { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailKiroshiOptics.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailDelamainCab.id,
    ]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("draws 1 on call when there is no friendly Gear to defeat", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
        legendArea: [{ card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: true }],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.callLegend(welcomeToNightCityRetailDumDumMaelstromTriggerman, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
    ]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("spends to give a friendly Unit +1 power per equipped Gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailSwordwiseHuscle,
          spent: false,
          playedThisTurn: false,
          attachedGears: [
            welcomeToNightCityRetailKiroshiOptics,
            welcomeToNightCityRetailMantisBlades,
          ],
        },
      ],
      legendArea: [
        { card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: false, spent: false },
      ],
      eddies: 1,
    });
    const swordwiseId = engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    const before = getEffectivePower(engine.getState(), swordwiseId);

    engine.activateAbility(welcomeToNightCityRetailDumDumMaelstromTriggerman, 2, { as: P1 });

    expect(getEffectivePower(engine.getState(), swordwiseId)).toBe(before + 2);
    expect(
      engine.getCard(welcomeToNightCityRetailDumDumMaelstromTriggerman, "legendArea", P1).meta
        .spent,
    ).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("does not activate the power ability when there is no friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: false, spent: false },
      ],
      eddies: 1,
    });

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailDumDumMaelstromTriggerman, 2, { as: P1 }),
    );

    expect(failure.errorCode).toBe("NO_VALID_TARGETS");
    expect(
      engine.getCard(welcomeToNightCityRetailDumDumMaelstromTriggerman, "legendArea", P1).meta
        .spent,
    ).toBe(false);
    expect(engine.getEddies(P1)).toBe(1);
  });
});
