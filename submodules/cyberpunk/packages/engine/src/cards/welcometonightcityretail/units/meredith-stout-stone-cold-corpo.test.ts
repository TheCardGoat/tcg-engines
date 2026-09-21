import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
  welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
  welcomeToNightCityRetailTraumaTeamOperatives,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const meredith = welcomeToNightCityRetailMeredithStoutStoneColdCorpo;
const trashCard = welcomeToNightCityRetailCorporateSurveillance;

function chooseMeredithTrigger(engine: CyberpunkTestEngine, player = P1): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  if (choice?.type === "chooseTrigger") {
    expect(choice.chooserId).toBe(player);
    const trigger = choice.payload.options.find(
      (option) => option.sourceCardId === engine.getCard(meredith, "field", player).instanceId,
    );
    if (!trigger) throw new Error("Expected Meredith trigger option.");
    engine.executeMove("resolveTrigger", { args: { triggerId: trigger.triggerId } }, player);
  }
  expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
    type: "chooseTarget",
    chooserId: player,
    payload: { type: "effectTarget", canDecline: true },
  });
}

describe("Meredith Stout - Stone Cold Corpo", () => {
  it("is the exact red Militech Corpo Unit with BLOCKER, Legend-fight power, and rival Gig-change recovery", () => {
    expect(meredith).toMatchObject({
      canonicalId: "meredith-stout-stone-cold-corpo",
      slug: "meredith-stout-stone-cold-corpo",
      name: "Meredith Stout",
      subname: "Stone Cold Corpo",
      displayName: "Meredith Stout: Stone Cold Corpo",
      type: "unit",
      color: "red",
      classifications: ["Corpo", "Militech"],
      cost: 4,
      power: 5,
      ram: 1,
      hasSellTag: false,
      printNumber: "014",
      keywords: ["blocker"],
      rulesText:
        "{Blocker}\nThis Unit has +2 power while fighting a Legend.\nWhen a Rival adjusts or swaps 1 or more friendly Gigs, you may add a card from your trash to your hand.",
    });
    expect(meredith.abilities).toHaveLength(4);
    expect(meredith.abilities[1]).toMatchObject({
      kind: "static",
      effects: [
        {
          effect: "modifyPower",
          target: { selector: "self" },
          value: 2,
          duration: "continuous",
          conditions: [
            {
              condition: "fightKind",
              kind: "fight",
              opponent: { selector: "card", cardTypes: ["legend"] },
            },
          ],
        },
      ],
    });
    expect(meredith.abilities[2]).toMatchObject({
      kind: "triggered",
      trigger: {
        trigger: "event",
        event: {
          event: "gigValueChanged",
          player: "rival",
          target: { selector: "gig", controller: "friendly" },
        },
      },
      effects: [
        {
          effect: "moveCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["trash"],
            selection: { mode: "choose", min: 1, max: 1 },
          },
          destination: "hand",
          optional: true,
        },
      ],
    });
    expect(meredith.abilities[3]).toMatchObject({
      kind: "triggered",
      trigger: {
        trigger: "event",
        event: {
          event: "gigsSwapped",
          player: "rival",
          target: { selector: "gig", controller: "friendly" },
        },
      },
      effects: meredith.abilities[2]?.effects,
    });
  });

  it("has 7 power only while fighting a Legend", () => {
    const legendFight = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: meredith, spent: false }] },
      { field: [{ card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, spent: true }] },
    );

    legendFight.attackUnit(meredith, embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, {
      as: P1,
    });
    legendFight.resolveFullFight({ as: P1 });

    expect(legendFight.getCardsInZone("field", P1).map((card) => card.definitionId)).not.toContain(
      meredith.id,
    );
    expect(legendFight.getCardsInZone("field", P2).map((card) => card.definitionId)).not.toContain(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean.id,
    );

    const unitFight = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: meredith, spent: false }] },
      {
        field: [
          {
            card: welcomeToNightCityRetailTraumaTeamOperatives,
            spent: true,
          },
        ],
      },
    );

    unitFight.attackUnit(meredith, welcomeToNightCityRetailTraumaTeamOperatives, { as: P1 });
    unitFight.resolveFullFight({ as: P1 });

    expect(unitFight.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      meredith.id,
    );
    expect(unitFight.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailTraumaTeamOperatives.id,
    );
  });

  it("can spend as BLOCKER to redirect a rival attack to itself", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: meredith, spent: false }] },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      { activePlayerId: P2 },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(meredith, { as: P1 });
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCard(meredith, "field", P1).meta.spent).toBe(true);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getGigDice(P1)).toHaveLength(0);
  });

  it("may return exactly one friendly trash card when a rival adjusts a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [meredith],
        trash: [trashCard, welcomeToNightCityRetailDyingNightVSPistol],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
          },
        ],
      },
      { activePlayerId: P2 },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d8")], {
      as: P2,
      allowPendingChoice: true,
      reason: "Dying Night still needs the selected Gig's new face value",
    });
    engine.resolveAdjustGig(4, { as: P2 });
    chooseMeredithTrigger(engine);

    const targetChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(targetChoice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
      payload: { min: 1, max: 1, canDecline: true },
    });
    if (!targetChoice || targetChoice.type !== "chooseTarget") {
      throw new Error("Expected Meredith trash-card target choice.");
    }
    expect(targetChoice.payload.eligibleIds).toEqual(
      expect.arrayContaining(engine.getCardsInZone("trash", P1).map((card) => card.instanceId)),
    );
    engine.resolveEffectTarget(trashCard, {
      as: P1,
      allowPendingChoice: true,
      reason: "Meredith still needs the selected trash card move confirmed",
    });
    engine.resolveCardToMove(trashCard, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      trashCard.id,
    ]);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailDyingNightVSPistol.id,
    );
  });

  it("may return a trash card when a rival swaps away a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [meredith], trash: [trashCard], gigArea: [{ dieType: "d4", faceValue: 2 }] },
      {
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: false,
            spent: false,
          },
        ],
        gigArea: [{ dieType: "d8", faceValue: 6 }],
      },
      { activePlayerId: P2 },
    );
    const rivalFriendlyGig = engine.findGigIdByType(P2, "d8");
    const meredithFriendlyGig = engine.findGigIdByType(P1, "d4");

    engine.activateAbility(welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, 0, {
      as: P2,
    });
    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
      payload: { type: "effectTarget", canDecline: true },
    });
    chooseMeredithTrigger(engine);
    engine.resolveEffectTarget(trashCard, {
      as: P1,
      allowPendingChoice: true,
      reason: "Meredith still needs the selected trash card move confirmed",
    });
    engine.resolveCardToMove(trashCard, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      trashCard.id,
    );
    expect(engine.getGigDice(P1).map((gig) => gig.id)).toContain(rivalFriendlyGig);
    expect(engine.getGigDice(P2).map((gig) => gig.id)).toContain(meredithFriendlyGig);
  });

  it("may decline after a rival change and does not trigger for its controller's own adjustment", () => {
    const rivalEngine = CyberpunkTestEngine.createWithFixture(
      {
        field: [meredith],
        trash: [trashCard],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
          },
        ],
      },
      { activePlayerId: P2 },
    );

    rivalEngine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    rivalEngine.resolveEffectTargetIds([rivalEngine.findGigIdByType(P1, "d8")], {
      as: P2,
      allowPendingChoice: true,
      reason: "Dying Night still needs the selected Gig's new face value",
    });
    rivalEngine.resolveAdjustGig(4, { as: P2 });
    const choice = rivalEngine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
      payload: { type: "effectTarget", canDecline: true },
    });
    rivalEngine.executeMove("resolveEffectTarget", { args: { targetIds: [], pass: true } }, P1);
    expect(rivalEngine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      trashCard.id,
    );
    expect(rivalEngine.getState().G.turnMetadata.pendingChoice).toBeUndefined();

    const friendlyEngine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          meredith,
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
          },
        ],
        trash: [trashCard],
      },
      { gigArea: [{ dieType: "d8", faceValue: 5 }] },
    );

    friendlyEngine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    friendlyEngine.resolveEffectTargetIds([friendlyEngine.findGigIdByType(P2, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Dying Night still needs the selected Gig's new face value",
    });
    friendlyEngine.resolveAdjustGig(4, { as: P1 });

    expect(friendlyEngine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(friendlyEngine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      trashCard.id,
    );
  });
});
