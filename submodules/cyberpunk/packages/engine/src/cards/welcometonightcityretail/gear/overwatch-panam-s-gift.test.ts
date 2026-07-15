import { describe, expect, it } from "vite-plus/test";
import { enMessages, formatActionLog } from "../../../logging/index.ts";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailRebootOptics,
  welcomeToNightCityRetailSaulBrightStormrider,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Overwatch - Panam's Gift", () => {
  it("is offered while attached to a friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [
          {
            card: welcomeToNightCityRetailSaulBrightStormrider,
            spent: false,
            attachedGears: [welcomeToNightCityRetailOverwatchPanamSGift],
          },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    const gearId = engine.findCardId(welcomeToNightCityRetailOverwatchPanamSGift, "field", P1);

    expect(activateAbilityCandidates(engine)).toContainEqual({
      cardId: gearId as string,
      abilityIndex: 1,
    });
  });

  it("spends its host, discards a card, and defeats a spent rival Unit within that cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [
          {
            card: welcomeToNightCityRetailSaulBrightStormrider,
            spent: false,
            attachedGears: [welcomeToNightCityRetailOverwatchPanamSGift],
          },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    const result = engine.activateAbility(welcomeToNightCityRetailOverwatchPanamSGift, 1, {
      as: P1,
    });
    const activationLog = result.moveLogs.find((log) => log.type === "action");
    expect(activationLog).toMatchObject({
      messageKey: "move.activateAbility.attached",
      params: {
        cardName: welcomeToNightCityRetailOverwatchPanamSGift.displayName,
        attachedToName: welcomeToNightCityRetailSaulBrightStormrider.displayName,
      },
    });
    if (activationLog?.type === "action") {
      expect(
        formatActionLog(
          {
            type: "actionLog",
            messageKey: activationLog.messageKey,
            params: activationLog.params,
            playerId: activationLog.playerId,
          },
          enMessages,
        ),
      ).toBe("Saul Bright — Stormrider activated Overwatch — Panam's Gift.");
    }
    if (engine.getState().G.turnMetadata.pendingChoice?.type === "chooseTarget") {
      engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    }

    const saul = engine.getCard(welcomeToNightCityRetailSaulBrightStormrider, "field", P1);
    expect(saul.meta.spent).toBe(true);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRebootOptics.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("can target a spent cost 3 rival Unit after discarding a cost 3 card", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMoxInciters],
        field: [
          {
            card: welcomeToNightCityRetailSaulBrightStormrider,
            spent: false,
            attachedGears: [welcomeToNightCityRetailOverwatchPanamSGift],
          },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: true }],
      },
    );

    const activationResult = engine.activateAbility(
      welcomeToNightCityRetailOverwatchPanamSGift,
      1,
      {
        as: P1,
      },
    );
    const discardLog = activationResult.moveLogs.find(
      (log) => log.type === "action" && log.messageKey === "effect.discard.resolved",
    );
    expect(discardLog).toMatchObject({
      params: {
        sourceCardName: welcomeToNightCityRetailOverwatchPanamSGift.displayName,
        discardedCardName: welcomeToNightCityRetailMoxInciters.displayName,
        discardedCost: 3,
      },
    });
    if (discardLog?.type === "action") {
      expect(
        formatActionLog(
          {
            type: "actionLog",
            messageKey: discardLog.messageKey,
            params: discardLog.params,
            playerId: discardLog.playerId,
          },
          enMessages,
        ),
      ).toBe("Overwatch — Panam's Gift discarded Mox Inciters (cost 3).");
    }

    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );
  });

  it("does not offer the ability when the attached host is already spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [
          {
            card: welcomeToNightCityRetailSaulBrightStormrider,
            spent: true,
            attachedGears: [welcomeToNightCityRetailOverwatchPanamSGift],
          },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    const gearId = engine.findCardId(welcomeToNightCityRetailOverwatchPanamSGift, "field", P1);

    expect(activateAbilityCandidates(engine)).not.toContainEqual({
      cardId: gearId as string,
      abilityIndex: 1,
    });
    expect(
      engine.executeMove(
        "activateAbility",
        { args: { cardId: gearId as string, abilityIndex: 1 } },
        P1,
      ),
    ).toMatchObject({
      success: false,
      errorCode: "CARD_SPENT",
    });
  });

  it("does not offer the ability when all discard choices are too cheap for the spent rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [
          {
            card: welcomeToNightCityRetailSaulBrightStormrider,
            spent: false,
            attachedGears: [welcomeToNightCityRetailOverwatchPanamSGift],
          },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: true }],
      },
    );
    const gearId = engine.findCardId(welcomeToNightCityRetailOverwatchPanamSGift, "field", P1);

    expect(activateAbilityCandidates(engine)).not.toContainEqual({
      cardId: gearId as string,
      abilityIndex: 1,
    });
    expect(
      engine.executeMove(
        "activateAbility",
        { args: { cardId: gearId as string, abilityIndex: 1 } },
        P1,
      ),
    ).toMatchObject({
      success: false,
      errorCode: "NO_VALID_TARGETS",
    });
  });

  it("does not offer the ability when the only rival Unit in range is ready", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMoxInciters],
        field: [
          {
            card: welcomeToNightCityRetailSaulBrightStormrider,
            spent: false,
            attachedGears: [welcomeToNightCityRetailOverwatchPanamSGift],
          },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
      },
    );
    const gearId = engine.findCardId(welcomeToNightCityRetailOverwatchPanamSGift, "field", P1);

    expect(activateAbilityCandidates(engine)).not.toContainEqual({
      cardId: gearId as string,
      abilityIndex: 1,
    });
    expect(
      engine.executeMove(
        "activateAbility",
        { args: { cardId: gearId as string, abilityIndex: 1 } },
        P1,
      ),
    ).toMatchObject({
      success: false,
      errorCode: "NO_VALID_TARGETS",
    });
  });

  it("still offers the ability when only Overwatch is already spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [
          {
            card: welcomeToNightCityRetailSaulBrightStormrider,
            spent: false,
            attachedGears: [welcomeToNightCityRetailOverwatchPanamSGift],
          },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    const gearId = engine.findCardId(welcomeToNightCityRetailOverwatchPanamSGift, "field", P1);
    engine.getState().G.cardIndex[gearId as string]!.meta.spent = true;

    expect(activateAbilityCandidates(engine)).toContainEqual({
      cardId: gearId as string,
      abilityIndex: 1,
    });
  });
});

function activateAbilityCandidates(engine: CyberpunkTestEngine) {
  const spec = engine
    .getPrompt(P1)
    .availableMoves.find((move) => move.moveId === "activateAbility")?.inputSpec;
  return spec?.type === "selectAbility" ? spec.candidates : [];
}
