import { describe, expect, it } from "vite-plus/test";
import { enMessages, formatActionLog, type MoveLog } from "../../logging/index.ts";
import {
  welcomeToNightCityRetailAfterpartyAtLizzieS,
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetail6thStreetRecruits,
  welcomeToNightCityRetailFieldOperator,
  theHeistRetailStarterDeckJackieWellesPourOneOutForMe,
  welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
  welcomeToNightCityRetailIndustrialAssembly,
  welcomeToNightCityRetailJackedInVoodooBoy,
  welcomeToNightCityRetailLaLloronaGhostOfThePast,
  welcomeToNightCityRetailMaxtacHeavy,
  welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
  welcomeToNightCityRetailNocturneOp55N1,
  welcomeToNightCityRetailTraumaTeamOperatives,
  welcomeToNightCityRetailVRoamerOfTheBadlands,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../testing/index.ts";

const meredith = welcomeToNightCityRetailMeredithStoutStoneColdCorpo;
const trashCard = welcomeToNightCityRetailCorporateSurveillance;

function visibleLogLine(log: MoveLog): string {
  if (log.type !== "action") return log.type;
  return formatActionLog(
    {
      type: "actionLog",
      messageKey: log.messageKey,
      params: log.params,
      playerId: log.playerId,
    },
    enMessages,
  );
}

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

  for (const meredithPlayer of [P1, P2]) {
    for (const actorIsFriendly of [true, false]) {
      for (const targetIsFriendly of [true, false]) {
        it(`filters Dying Night by cause and target: Meredith=${meredithPlayer}, friendly actor=${actorIsFriendly}, friendly Gig=${targetIsFriendly}`, () => {
          const rival = meredithPlayer === P1 ? P2 : P1;
          const actor = actorIsFriendly ? meredithPlayer : rival;
          const gigOwner = targetIsFriendly ? meredithPlayer : rival;
          const attacker = actorIsFriendly ? meredith : welcomeToNightCityRetailFieldOperator;
          const friendly = {
            field: [
              {
                card: meredith,
                spent: false,
                attachedGears: actorIsFriendly ? [welcomeToNightCityRetailDyingNightVSPistol] : [],
              },
            ],
            trash: [trashCard],
            gigArea: [{ dieType: "d8" as const, faceValue: 5 }],
          };
          const opponent = {
            field: actorIsFriendly
              ? []
              : [
                  {
                    card: welcomeToNightCityRetailFieldOperator,
                    spent: false,
                    attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
                  },
                ],
            gigArea: [{ dieType: "d8" as const, faceValue: 5 }],
          };
          const engine = CyberpunkTestEngine.createWithFixture(
            meredithPlayer === P1 ? friendly : opponent,
            meredithPlayer === P1 ? opponent : friendly,
            { activePlayerId: actor },
          );

          engine.attackRival(attacker, { as: actor });
          engine.resolveEffectTargetIds([engine.findGigIdByType(gigOwner, "d8")], {
            as: actor,
            allowPendingChoice: true,
            reason: "Dying Night needs the selected Gig's new value",
          });
          engine.resolveAdjustGig(4, { as: actor });

          expect(engine.getGigDice(gigOwner)[0]?.faceValue).toBe(4);
          if (!actorIsFriendly && targetIsFriendly) {
            chooseMeredithTrigger(engine, meredithPlayer);
          } else {
            expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
          }
          expect(
            engine.getCardsInZone("trash", meredithPlayer).map((card) => card.definitionId),
          ).toContain(trashCard.id);
          expect(engine.getCardsInZone("hand", meredithPlayer)).toHaveLength(0);
        });
      }
    }
  }

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
    engine.resolveEffectTarget(trashCard, { as: P1 });

    // The trash pick is final: no chooseCardToMove follow-up for the same card.
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
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
    engine.resolveEffectTarget(trashCard, { as: P1 });

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

  it("may return a trash card when a rival increases a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [meredith],
        trash: [trashCard],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        hand: [welcomeToNightCityRetailIndustrialAssembly],
        eddies: 1,
        gigArea: [{ dieType: "d8", faceValue: 3 }],
      },
      { activePlayerId: P2 },
    );

    engine.playCard(welcomeToNightCityRetailIndustrialAssembly, { as: P2 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P2,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the selected Gig's new face value",
    });
    const adjusted = engine.resolveAdjustGig(6, { as: P2 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(6);
    expect(adjusted.moveLogs.map(visibleLogLine)).toContain(
      "Auto-resolved Meredith Stout: Stone Cold Corpo: When a Rival adjusts or swaps 1 or more friendly Gigs, you may add a card from your trash to your hand.",
    );
    chooseMeredithTrigger(engine);
    engine.resolveEffectTarget(trashCard, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      trashCard.id,
    ]);
  });

  it("does not offer recovery when a rival increases a friendly Gig and trash is empty", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [meredith],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        hand: [welcomeToNightCityRetailIndustrialAssembly],
        eddies: 1,
      },
      { activePlayerId: P2 },
    );

    const played = engine.playCard(welcomeToNightCityRetailIndustrialAssembly, { as: P2 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P2,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the selected Gig's new face value",
    });
    const adjusted = engine.resolveAdjustGig(6, { as: P2 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(6);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getState().G.turnMetadata.triggerQueue).toHaveLength(0);
    expect(played.moveLogs.map(visibleLogLine)).toEqual([
      "Played Industrial Assembly for 1 eddies.",
      "Auto-resolved Industrial Assembly: Increase a Gig by up to 4. If you control a Gig with 8+ value, draw 1.",
    ]);
    expect(adjusted.moveLogs.map(visibleLogLine)).toEqual([
      "Selected D6 for Industrial Assembly.",
      "Adjusted D6 gig die from 2 to 6.",
      "Industrial Assembly did not draw: the required target does not exist.",
    ]);
    expect(engine.getEvents("actionLog").map((event) => event.messageKey)).not.toContain(
      "trigger.noValidTargets",
    );
    expect(
      engine
        .getEvents("actionLog")
        .map((event) => formatActionLog(event, enMessages))
        .join("\n"),
    ).not.toContain("Meredith");
  });

  it("does not trigger when Jackie Welles decreases a friendly Gig after Jacked-In Voodoo Boy", () => {
    const jackie = theHeistRetailStarterDeckJackieWellesPourOneOutForMe;
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailNocturneOp55N1, welcomeToNightCityRetailJackedInVoodooBoy],
      field: [{ card: meredith, spent: false, hasLag: false }],
      trash: [trashCard],
      legendArea: [{ card: jackie, faceDown: false }],
      gigArea: [{ dieType: "d8", faceValue: 8 }],
      eddies: 2,
    });

    const sold = engine.sellCard(welcomeToNightCityRetailNocturneOp55N1, { as: P1 });
    const played = engine.playCard(welcomeToNightCityRetailJackedInVoodooBoy, { as: P1 });
    const selected = engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Jackie still needs the optional friendly Gig target",
    });
    const decreased = engine.resolveAdjustGig(6, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d8")?.faceValue).toBe(6);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getState().G.turnMetadata.triggerQueue).toHaveLength(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual([
      trashCard.id,
    ]);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(sold.moveLogs).toContainEqual(
      expect.objectContaining({ type: "sellCard", cardName: "Nocturne OP55 N1" }),
    );
    expect(played.moveLogs.map(visibleLogLine)).toEqual([
      "Played Jacked-In Voodoo Boy for 2 eddies.",
      "Auto-resolved Jackie Welles: Pour One Out For Me: The first time you play a Blue Unit or Blue Gear each turn, you may decrease a friendly Gig by up to 2. If it becomes a min Gig, draw 1.",
    ]);
    expect([...(selected?.moveLogs ?? []), ...decreased.moveLogs].map(visibleLogLine)).toEqual([
      "Selected D8 for Jackie Welles: Pour One Out For Me.",
      "Adjusted D8 gig die from 8 to 6.",
      "Jackie Welles: Pour One Out For Me did not draw: the target did not change to the required value.",
    ]);
    const visibleLog = engine
      .getEvents("actionLog")
      .map((event) => formatActionLog(event, enMessages));
    expect(visibleLog).toEqual(
      expect.arrayContaining([
        "Sold Nocturne OP55 N1.",
        "Played Jacked-In Voodoo Boy for 2 eddies.",
        "Selected D8 for Jackie Welles: Pour One Out For Me.",
      ]),
    );
    expect(visibleLog.join("\n")).not.toContain("Meredith");
  });

  it("may return a trash card when a rival increases a Gig that Meredith's controller still controls", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetail6thStreetRecruits, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailMaxtacHeavy, spent: false, hasLag: false },
        ],
      },
      {
        field: [meredith],
        trash: [trashCard],
        gigArea: [
          { dieType: "d6", faceValue: 1 },
          { dieType: "d10", faceValue: 2 },
        ],
      },
    );
    const remainingGig = engine.findGigIdByType(P2, "d10");

    engine.attackRival(welcomeToNightCityRetailMaxtacHeavy, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1, gigIdsToSteal: [engine.findGigIdByType(P2, "d6")] });
    engine.resolveEffectTargetIds([remainingGig], {
      as: P1,
      allowPendingChoice: true,
      reason: "6th Street Recruits still needs the selected Gig's new face value",
    });
    engine.resolveAdjustGig(8, { as: P1 });

    expect(engine.getGigDice(P2).find((die) => die.id === remainingGig)?.faceValue).toBe(8);
    chooseMeredithTrigger(engine, P2);
  });

  it("does not trigger when a rival increases a Gig it just stole", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailVRoamerOfTheBadlands,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [meredith],
        trash: [trashCard],
        gigArea: [{ dieType: "d10", faceValue: 2 }],
      },
    );
    const stolenGig = engine.findGigIdByType(P2, "d10");

    engine.attackRival(welcomeToNightCityRetailVRoamerOfTheBadlands, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    engine.resolveAdjustGig(7, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.id === stolenGig)?.faceValue).toBe(7);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      trashCard.id,
    );
  });

  it("may return a trash card when a blocking rival increases a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailLaLloronaGhostOfThePast, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [
          meredith,
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
        trash: [trashCard],
        gigArea: [{ dieType: "d8", faceValue: 2 }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailLaLloronaGhostOfThePast, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P2, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "La Llorona still needs the selected Gig's new face value",
    });
    engine.resolveAdjustGig(5, { as: P1 });

    expect(engine.getGigDice(P2).find((die) => die.dieType === "d8")?.faceValue).toBe(5);
    chooseMeredithTrigger(engine, P2);
  });

  it("does not trigger when a rival increases their own Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [meredith],
        trash: [trashCard],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        hand: [welcomeToNightCityRetailIndustrialAssembly],
        eddies: 1,
        gigArea: [{ dieType: "d8", faceValue: 3 }],
      },
      { activePlayerId: P2 },
    );

    engine.playCard(welcomeToNightCityRetailIndustrialAssembly, { as: P2 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P2, "d8")], {
      as: P2,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the selected Gig's new face value",
    });
    engine.resolveAdjustGig(7, { as: P2 });

    expect(engine.getGigDice(P2).find((die) => die.dieType === "d8")?.faceValue).toBe(7);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      trashCard.id,
    );
  });

  it("does not trigger when its controller adjusts a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [meredith],
      hand: [welcomeToNightCityRetailAfterpartyAtLizzieS],
      eddies: 1,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
      trash: [trashCard],
    });

    engine.playCard(welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d4")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Afterparty needs the selected friendly Gig's new face value",
    });
    engine.resolveAdjustGig(2, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d4")?.faceValue).toBe(2);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      trashCard.id,
    );
  });
});
