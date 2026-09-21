import { describe, expect, it } from "vite-plus/test";
import { enMessages, formatActionLog } from "../../../logging/index.ts";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailRebootOptics,
  welcomeToNightCityRetailSaulBrightStormrider,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";
import { getEffectivePower } from "../../../active-effects/index.ts";

const overwatch = welcomeToNightCityRetailOverwatchPanamSGift;

function getAttachTargets(engine: CyberpunkTestEngine): string[] {
  const gearId = engine.getCard(overwatch, "hand", P1).instanceId;
  const playMove = engine.getPrompt(P1).availableMoves.find((move) => move.moveId === "playCard");
  if (!playMove || playMove.inputSpec.type !== "playCard") return [];
  return (
    playMove.inputSpec.candidates.find((candidate) => candidate.cardId === gearId)?.attachTargets ??
    []
  );
}

describe("Overwatch: Panam's Gift", () => {
  it("is the exact green 4-cost 4-power QUICK Weapon Gear", () => {
    expect(overwatch).toMatchObject({
      canonicalId: "overwatch-panam-s-gift",
      slug: "overwatch-panam-s-gift",
      name: "Overwatch",
      subname: "Panam's Gift",
      displayName: "Overwatch: Panam's Gift",
      type: "gear",
      color: "green",
      classifications: ["Weapon"],
      cost: 4,
      power: 4,
      ram: 4,
      hasSellTag: true,
      printNumber: "093",
      keywords: ["quick"],
      rulesText:
        "{Quick} 1 €$, {Spend} Discard 1. Defeat a spent rival Unit with cost equal to or less than the discarded card's cost.",
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
        { kind: "keyword", keyword: "quick", source: { selector: "host" } },
        {
          kind: "triggered",
          trigger: { trigger: "activated" },
          source: { selector: "self" },
          bindings: [
            {
              id: "discardedCard",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["hand"],
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
          costs: [
            { cost: "payEddies", amount: 1 },
            { cost: "spend", target: { selector: "host" } },
          ],
          effects: [
            {
              effect: "moveCard",
              target: { selector: "bound", id: "discardedCard" },
              destination: "trash",
            },
            {
              effect: "defeat",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                state: "spent",
                maxCostOf: { selector: "bound", id: "discardedCard" },
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
        },
      ],
    });
  });

  it("offers only a friendly Unit and friendly face-up Legend as attachment hosts", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [overwatch],
        field: [{ card: welcomeToNightCityRetailSaulBrightStormrider, spent: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: true },
        ],
        eddies: 4,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );
    const targets = getAttachTargets(engine);
    expect(targets).toContain(
      engine.findCardId(welcomeToNightCityRetailSaulBrightStormrider, "field", P1),
    );
    expect(targets).toContain(
      engine.getCardsInZone("legendArea", P1).find((card) => card.meta.faceDown === false)
        ?.instanceId,
    );
    expect(targets).not.toContain(
      engine.getCardsInZone("legendArea", P1).find((card) => card.meta.faceDown === true)
        ?.instanceId,
    );
    expect(targets).not.toContain(
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    );
  });

  it("pays 4 to equip a face-up Legend and can spend that host for the ability", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [overwatch, welcomeToNightCityRetailRebootOptics],
        legendArea: [
          {
            card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
            faceDown: false,
            spent: false,
          },
        ],
        eddies: 5,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );

    engine.attachGear(overwatch, welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, {
      as: P1,
    });
    expect(engine.getEddies(P1)).toBe(1);
    expect(
      getEffectivePower(
        engine.getState(),
        engine.findCardId(
          welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          "legendArea",
          P1,
        ) as string,
      ),
    ).toBe(4);
    engine.activateAbility(overwatch, 1, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

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

    expect(activateAbilityCandidates(engine)).toContainEqual(
      expect.objectContaining({
        cardId: gearId as string,
        abilityIndex: 1,
        eddieCost: 1,
        spendsCard: true,
        effectHints: ["moveCard", "defeat"],
      }),
    );
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
      ).toBe("Saul Bright: Stormrider activated Overwatch: Panam's Gift.");
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
      ).toBe("Overwatch: Panam's Gift discarded Mox Inciters (cost 3).");
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
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getCard(welcomeToNightCityRetailRebootOptics, "hand", P1)).toBeDefined();
    expect(
      engine.getCard(welcomeToNightCityRetailSaulBrightStormrider, "field", P1).meta.spent,
    ).toBe(false);
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
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getCard(welcomeToNightCityRetailMoxInciters, "hand", P1)).toBeDefined();
    expect(
      engine.getCard(welcomeToNightCityRetailSaulBrightStormrider, "field", P1).meta.spent,
    ).toBe(false);
  });

  it("does not offer and rejects the ability without an available Eddie", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMoxInciters],
        field: [
          {
            card: welcomeToNightCityRetailSaulBrightStormrider,
            spent: false,
            attachedGears: [overwatch],
          },
        ],
        legendArea: [],
        eddies: 0,
      },
      { field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: true }] },
    );
    const gearId = engine.findCardId(overwatch, "field", P1);

    expect(activateAbilityCandidates(engine)).not.toContainEqual(
      expect.objectContaining({
        cardId: gearId as string,
        abilityIndex: 1,
      }),
    );
    expect(
      engine.executeMove(
        "activateAbility",
        { args: { cardId: gearId as string, abilityIndex: 1 } },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "INSUFFICIENT_EDDIES" });
    expect(engine.getCard(welcomeToNightCityRetailMoxInciters, "hand", P1)).toBeDefined();
    expect(
      engine.getCard(welcomeToNightCityRetailSaulBrightStormrider, "field", P1).meta.spent,
    ).toBe(false);
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

    expect(activateAbilityCandidates(engine)).toContainEqual(
      expect.objectContaining({
        cardId: gearId as string,
        abilityIndex: 1,
        eddieCost: 1,
        spendsCard: true,
        effectHints: ["moveCard", "defeat"],
      }),
    );
  });

  it("activates as a QUICK reaction during a rival attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMoxInciters],
        field: [
          {
            card: welcomeToNightCityRetailSaulBrightStormrider,
            spent: false,
            attachedGears: [overwatch],
          },
        ],
        eddies: 1,
      },
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true, hasLag: false },
        ],
      },
      { activePlayerId: P2 },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAttack({ as: P2 });
    expect(engine.activateAbility(overwatch, 1, { as: P1 })).toMatchObject({ success: true });
    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(
      engine.getCard(welcomeToNightCityRetailSaulBrightStormrider, "field", P1).meta.spent,
    ).toBe(true);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );
  });
});

function activateAbilityCandidates(engine: CyberpunkTestEngine) {
  const spec = engine
    .getPrompt(P1)
    .availableMoves.find((move) => move.moveId === "activateAbility")?.inputSpec;
  return spec?.type === "selectAbility" ? spec.candidates : [];
}
