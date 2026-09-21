import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAnimalsWrecker,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailPeaceOffering,
  welcomeToNightCityRetailSafetyOverride,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectAttackCandidate } from "../../../testing/index.ts";
import { enMessages, formatActionLog, stripPrivateFields } from "../../../logging/index.ts";

describe("V - Streetkid", () => {
  it("has the exact red Merc CALL and GO SOLO identity", () => {
    expect(welcomeToNightCityRetailVStreetkid).toMatchObject({
      canonicalId: "v-streetkid",
      slug: "v-streetkid",
      name: "V",
      subname: "Streetkid",
      displayName: "V: Streetkid",
      type: "legend",
      color: "red",
      classifications: ["Merc"],
      cost: 5,
      power: 6,
      ram: 2,
      hasSellTag: true,
      rarity: "Rare",
      printNumber: "005a",
      timingTriggers: ["call"],
      keywords: ["goSolo"],
      rulesText:
        "{Call} Trash 3. Then, add 1 BRAINDANCE Program from your trash to your hand.\n{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
      abilities: [
        {
          kind: "keyword",
          keyword: "goSolo",
          text: "Go Solo (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
          source: { selector: "self" },
          effects: [],
        },
        {
          kind: "triggered",
          text: "{Call} Trash 3. Then, add 1 BRAINDANCE Program from your trash to your hand.",
          trigger: { trigger: "call" },
          source: { selector: "self" },
          effects: [
            { effect: "trashFromDeck", player: "friendly", amount: 3 },
            {
              effect: "moveCard",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["trash"],
                cardTypes: ["program"],
                classifications: ["Braindance"],
                selection: { mode: "choose", min: 1, max: 1 },
              },
              destination: "hand",
            },
          ],
        },
      ],
    });
  });

  it("goes solo as a ready Unit that can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
      eddies: 5,
    });
    const vId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result.success).toBe(true);
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getCard(welcomeToNightCityRetailVStreetkid, "field", P1).meta.hasLag).toBe(false);
    expectAttackCandidate(engine, welcomeToNightCityRetailVStreetkid, { as: P1 });
  });

  it("uses its own Sell Tag but rejects GO SOLO one Eddie below the exact cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
      eddies: 3,
    });
    const vId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P1);
    expect(engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1)).toMatchObject({
      success: false,
      errorCode: "INSUFFICIENT_EDDIES",
    });
    expect(engine.getEddies(P1)).toBe(3);
  });

  it("is removed from the game rather than trashed after GO SOLO and defeat", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
        eddies: 5,
      },
      { field: [{ card: welcomeToNightCityRetailAnimalsWrecker, spent: true, hasLag: false }] },
    );
    const vId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P1);
    engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);
    engine.attackUnit(welcomeToNightCityRetailVStreetkid, welcomeToNightCityRetailAnimalsWrecker, {
      as: P1,
    });
    engine.resolveFullFight({ as: P1 });
    expect(engine.getCardsInZone("removedFromGame", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailVStreetkid.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailVStreetkid.id,
    );
  });

  it("trashes 3 on call and returns a Braindance Program from trash to hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        trash: [welcomeToNightCityRetailPeaceOffering, welcomeToNightCityRetailSafetyOverride],
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
      sourceCardName: "V: Streetkid",
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
      "V: Streetkid trashed 3 card(s) from the top of the deck: Corpo Security, Delamain Cab, Corpo Security.",
    );

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type === "chooseTarget") {
      expect(choice.payload.eligibleIds).toEqual([
        engine.findCardId(welcomeToNightCityRetailPeaceOffering, "trash", P1),
      ]);
    }

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
    ).toBe("Selected Peace Offering for V: Streetkid.");

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

  it("may return a Braindance Program among the three cards just trashed", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailPeaceOffering,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
        ],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );
    engine.callLegend(welcomeToNightCityRetailVStreetkid, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailPeaceOffering, { as: P1 });
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
