import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCarnageAtTheColosseum,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailJudyAlvarezBraindanceMaestro,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMaelstromZealots,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailRebootOptics,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const judy = welcomeToNightCityRetailJudyAlvarezBraindanceMaestro;
const braindance = welcomeToNightCityRetailCarnageAtTheColosseum;
const nonBraindance = welcomeToNightCityRetailFloorIt;
const zealots = welcomeToNightCityRetailMaelstromZealots;
const fieldOperator = welcomeToNightCityRetailFieldOperator;
const malfini = welcomeToNightCityRetailOffdutyMalfini;
const program = welcomeToNightCityRetailRebootOptics;
const gear = welcomeToNightCityRetailKiroshiOptics;

function resolveJudyPlayTrigger(engine: CyberpunkTestEngine): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  if (!choice || choice.type !== "chooseTrigger") {
    throw new Error("Expected a trigger-order choice after playing the BRAINDANCE Program.");
  }
  const judyTrigger = choice.payload.options.find(
    (option) => option.cardName === judy.displayName && option.abilityIndex === 0,
  );
  if (!judyTrigger) throw new Error("Expected Judy's BRAINDANCE trigger in the trigger queue.");
  engine.executeMove(
    "resolveTrigger",
    { args: { triggerId: judyTrigger.triggerId } },
    choice.chooserId,
  );
}

describe("Judy Álvarez — Braindance Maestro", () => {
  it("is the exact blue Ganger Mox Techie Legend with both printed abilities", () => {
    expect(judy).toMatchObject({
      type: "legend",
      color: "blue",
      classifications: ["Ganger", "Mox", "Techie"],
      printNumber: "108",
      ram: 2,
      hasSellTag: true,
    });
    expect(judy.abilities).toEqual([
      expect.objectContaining({
        trigger: {
          trigger: "event",
          event: {
            event: "cardPlayed",
            player: "friendly",
            target: {
              selector: "card",
              controller: "friendly",
              cardTypes: ["program"],
              classifications: ["Braindance"],
            },
          },
        },
        effects: [expect.objectContaining({ effect: "modifyPower", value: 1, duration: "turn" })],
      }),
      expect.objectContaining({
        trigger: { trigger: "activated" },
        costs: [{ cost: "spend", target: { selector: "self" } }],
        effects: [
          {
            effect: "trashFromDeck",
            player: "friendly",
            amount: 1,
            outputBinding: "trashedCards",
          },
          expect.objectContaining({
            effect: "moveCard",
            destination: "hand",
            optional: true,
            target: {
              selector: "bound",
              id: "trashedCards",
              cardTypes: ["program"],
            },
          }),
        ],
      }),
    ]);
  });

  it("gives exactly one chosen friendly Unit +1 when a BRAINDANCE Program is played", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [braindance],
        legendArea: [{ card: judy, faceDown: false, spent: false }],
        field: [
          { card: zealots, spent: false, hasLag: false },
          { card: fieldOperator, spent: false, hasLag: false },
        ],
        eddies: 6,
      },
      { field: [{ card: malfini, spent: false, hasLag: false }] },
    );
    const zealotsCard = engine.getCard(zealots, "field", P1);
    const operatorCard = engine.getCard(fieldOperator, "field", P1);
    const rivalId = engine.findCardId(malfini, "field", P2);
    const zealotsPower = getEffectivePower(engine.getState(), zealotsCard.instanceId);
    const operatorPower = getEffectivePower(engine.getState(), operatorCard.instanceId);

    engine.playCard(braindance, { as: P1 });
    resolveJudyPlayTrigger(engine);

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget")
      throw new Error("Expected friendly Unit choice.");
    expect(choice.chooserId).toBe(P1);
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(choice.payload.eligibleIds?.sort()).toEqual(
      [zealotsCard.instanceId as string, operatorCard.instanceId as string].sort(),
    );
    expect(choice.payload.eligibleIds).not.toContain(rivalId);

    engine.resolveEffectTargetIds([zealotsCard.instanceId], { as: P1 });
    expect(getEffectivePower(engine.getState(), zealotsCard.instanceId)).toBe(zealotsPower + 1);
    expect(getEffectivePower(engine.getState(), operatorCard.instanceId)).toBe(operatorPower);
  });

  it("does not trigger for a Program without the BRAINDANCE classification", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [nonBraindance],
      legendArea: [{ card: judy, faceDown: false, spent: false }],
      field: [{ card: zealots, spent: false, hasLag: false }],
      eddies: 1,
    });
    const unit = engine.getCard(zealots, "field", P1);
    const basePower = getEffectivePower(engine.getState(), unit.instanceId);

    engine.playCard(nonBraindance, { as: P1 });

    expect(getEffectivePower(engine.getState(), unit.instanceId)).toBe(basePower);
    engine.expectNoPendingChoice();
  });

  it("removes the BRAINDANCE power bonus when the turn ends", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [braindance],
      legendArea: [{ card: judy, faceDown: false, spent: false }],
      field: [{ card: zealots, spent: false, hasLag: false }],
      eddies: 6,
    });
    const unit = engine.getCard(zealots, "field", P1);
    const basePower = getEffectivePower(engine.getState(), unit.instanceId);

    engine.playCard(braindance, { as: P1 });
    resolveJudyPlayTrigger(engine);
    engine.resolveEffectTargetIds([unit.instanceId], { as: P1 });
    expect(getEffectivePower(engine.getState(), unit.instanceId)).toBe(basePower + 1);
    engine.completeTurn({ as: P1 });
    expect(getEffectivePower(engine.getState(), unit.instanceId)).toBe(basePower);
  });

  it("spends Judy, trashes the top Program, and may return that Program to hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [program, gear],
        trash: [nonBraindance],
        legendArea: [{ card: judy, faceDown: false, spent: false }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.activateAbility(judy, 1, { as: P1 });

    const trashedProgramId = engine.findCardId(program, "trash", P1);
    const oldTrashId = engine.findCardId(nonBraindance, "trash", P1);
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseCardToMove") {
      throw new Error("Expected optional Program recovery choice.");
    }
    expect(choice.chooserId).toBe(P1);
    expect(choice.payload).toMatchObject({
      cardIds: [trashedProgramId],
      destination: "hand",
      canDecline: true,
    });
    expect(choice.payload.cardIds).not.toContain(oldTrashId);
    expect(engine.getCard(judy, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(gear.id);

    engine.resolveCardToMove(program, { as: P1 });
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      program.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      program.id,
    );
  });

  it("may decline recovery and leave the newly trashed Program in trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [program],
        legendArea: [{ card: judy, faceDown: false, spent: false }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.activateAbility(judy, 1, { as: P1 });
    expect(engine.resolveCardToMove(undefined, { as: P1, pass: true }).success).toBe(true);

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      program.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      program.id,
    );
    engine.expectNoPendingChoice();
  });

  it("does not offer recovery when the top card is not a Program", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [gear, program],
        legendArea: [{ card: judy, faceDown: false, spent: false }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.activateAbility(judy, 1, { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(gear.id);
    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(program.id);
    engine.expectNoPendingChoice();
  });

  it("cannot activate the trash ability while Judy is already spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [program],
        legendArea: [{ card: judy, faceDown: false, spent: true }],
      },
      {},
      { preserveDeckOrder: true },
    );
    engine.getCard(judy, "legendArea", P1).meta.spent = true;

    const failure = engine.expectFailure(() => engine.activateAbility(judy, 1, { as: P1 }));

    expect(failure.errorCode).toBe("CARD_SPENT");
    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(program.id);
    expect(engine.getCardsInZone("trash", P1)).toHaveLength(0);
  });
});
