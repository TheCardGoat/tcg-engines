import { describe, expect, it } from "vite-plus/test";
import {
  boxTopperRetailGoroTakemuraHandsUnclean,
  boxTopperRetailSaburoArasakaStubbornPatriarch,
  welcomeToNightCityRetailChromeReverie,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "../../../logging/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Chrome Reverie", () => {
  it("can make a rival unit unable to attack until the caster's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailChromeReverie],
        eddies: 3,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailChromeReverie, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, {
      as: P1,
      allowPendingChoice: true,
      reason: "Chrome Reverie still needs a friendly min Gig for the Legend call check",
    });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not call a legend when no friendly min Gig is present", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailChromeReverie],
      eddies: 3,
      gigArea: [{ dieType: "d6", faceValue: 3 }],
    });

    engine.playCard(welcomeToNightCityRetailChromeReverie, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailChromeReverie.id),
    ).toBe(true);
  });

  it("logs when it skips the free Legend call because a Legend was already called", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailChromeReverie],
        eddies: 5,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        legendArea: [
          { card: boxTopperRetailSaburoArasakaStubbornPatriarch, faceDown: true },
          { card: boxTopperRetailGoroTakemuraHandsUnclean, faceDown: true },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }],
      },
    );

    engine.callLegend(boxTopperRetailSaburoArasakaStubbornPatriarch, { as: P1 });
    engine.playCard(welcomeToNightCityRetailChromeReverie, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    const skippedLog = engine
      .getEvents("actionLog")
      .find((event) => event.messageKey === "effect.callLegend.skippedAlreadyCalled");

    expect(skippedLog ? formatActionLog(skippedLog, enMessages) : "").toBe(
      "Chrome Reverie skipped calling a Legend because a Legend was already called this turn.",
    );
    expect(engine.getCard(boxTopperRetailGoroTakemuraHandsUnclean).meta.faceDown).toBe(true);
  });
});
