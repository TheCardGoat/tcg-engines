import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailPeaceOffering,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectAttackCandidate } from "../../../testing/index.ts";
import { enMessages, formatActionLog, stripPrivateFields } from "../../../logging/index.ts";

describe("V - Streetkid", () => {
  it("goes solo as a ready Unit that can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
      eddies: 5,
    });
    const vId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result.success).toBe(true);
    expectAttackCandidate(engine, welcomeToNightCityRetailVStreetkid, { as: P1 });
  });

  it("trashes 3 on call and returns a Braindance Program from trash to hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        trash: [welcomeToNightCityRetailPeaceOffering],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    const callResult = engine.callLegend(welcomeToNightCityRetailVStreetkid, { as: P1 });
    const trashLog = callResult.moveLogs.find(
      (log) => log.type === "action" && log.messageKey === "effect.trashFromDeck.resolved",
    );
    if (!trashLog || trashLog.type !== "action") {
      throw new Error("Expected a trash-from-deck action log from V StreetKid.");
    }
    expect(trashLog.params).toMatchObject({
      sourceCardName: "V — StreetKid",
      trashedCount: 3,
    });
    const visibleTrashLog = stripPrivateFields(trashLog, P1);
    expect(
      visibleTrashLog
        ? formatActionLog(
            {
              type: "actionLog",
              messageKey: visibleTrashLog.messageKey,
              params: visibleTrashLog.params,
              playerId: visibleTrashLog.playerId,
            },
            enMessages,
          )
        : "",
    ).toBe(
      "V — StreetKid trashed 3 card(s) from the top of the deck: Corpo Security, Delamain Cab, Corpo Security.",
    );

    const targetResult = engine.resolveEffectTarget(welcomeToNightCityRetailPeaceOffering, {
      as: P1,
    });
    const selectedLog = targetResult.moveLogs.find(
      (log) => log.type === "action" && log.messageKey === "trigger.targetResolved",
    );
    if (!selectedLog || selectedLog.type !== "action") {
      throw new Error("Expected a target resolved action log from V StreetKid.");
    }
    expect(
      selectedLog
        ? formatActionLog(
            {
              type: "actionLog",
              messageKey: selectedLog.messageKey,
              params: selectedLog.params,
              playerId: selectedLog.playerId,
            },
            enMessages,
          )
        : "",
    ).toBe("Selected Peace Offering for V — StreetKid.");

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailPeaceOffering.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailCorpoSecurity.id,
        welcomeToNightCityRetailDelamainCab.id,
      ]),
    );
  });

  it("does not leave a pending choice when the trashed cards include no Braindance Program", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.callLegend(welcomeToNightCityRetailVStreetkid, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getHandCount(P1)).toBe(0);
  });
});
