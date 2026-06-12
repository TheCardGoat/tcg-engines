import { test, expect } from "@playwright/test";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectExcludes,
  expectIncludes,
  getChoiceDefinitionIds,
  getZoneDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaCorporateSurveillance,
  alphaFloorIt,
  alphaJackieWellesRideOrDieChoom,
  alphaKiroshiOptics,
  alphaMantisBlades,
  alphaMt0d12Flathead,
  alphaRebootOptics,
  alphaRuthlessLowlife,
  alphaSecondhandBombus,
  alphaSwordwiseHuscle,
  alphaTBugAmateurPhilosopher,
  promoLucynaKushinada,
  spoilerAdamSmasherMetalOverMeat,
  spoilerAfterpartyAtLizzieS,
  spoilerAltCunninghamSoulkillerArchitect,
  spoilerCaliberTotentanzSTopDog,
  spoilerCyberpsychosis,
  spoilerDumDumMaelstromTriggerman,
  spoilerElSombreronLaVenganzaLenta,
  spoilerEvelynParkerBeautifulEnigma,
  spoilerGildedMaton,
  spoilerGoroTakemuraVengefulBodyguard,
  spoilerHanakoArasakaInAGildedCage,
  spoilerKerryEurodyneTheLastRockerboy,
  spoilerMamanBrigitte,
  spoilerMeredithStoutStoneColdCorpo,
  spoilerPanamPalmerNomadCavalry,
  spoilerPeaceOffering,
  spoilerPlacideVoodooSentinel,
  spoilerRidingNomad,
  spoilerRiverWardDetectiveOnTheHunt,
  spoilerRoyceDonTCallMeSimon,
  spoilerRoycePsychoOnTheEdge,
  spoilerSandayuOdaHanakoSGuardian,
  spoilerVStreetkid,
} from "@tcg/cyberpunk-cards";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";

const POWER_THREE_MOCK_ID = "scenario-royce-power-three-mock";

test.describe("Spoiler and promo card Playwright happy paths", () => {
  test("Afterparty at Lizzie's - rival gig to adjust", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/progAfterpartyAtLizzies?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const rivalD6 = expectDefined(
      "Afterparty rival d6",
      (await pom.getGigDice(CYBERPUNK_P2)).find((die) => die.dieType === "d6"),
    );
    const program = expectDefined(
      "Afterparty at Lizzie's in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Afterparty eligible gig count", eligible.length, 2);
    if (!eligible.includes(rivalD6.id)) {
      throw new Error("Expected rival d6 to be eligible for Afterparty at Lizzie's.");
    }

    await pom.resolveEffectTarget([rivalD6.id], CYBERPUNK_P1);
    await pom.resolveAdjustGig(2, CYBERPUNK_P1);

    await pom.expectGigValue(rivalD6.id, 2);
    await pom.expectHandSize(CYBERPUNK_P1, 1);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 1);
    await pom.expectStructuralState();
  });

  test("Carnage At The Colosseum - reduced cost and weaker rival target", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/progCarnageAtTheColosseum?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const program = expectDefined(
      "Carnage At The Colosseum in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );
    const lowlife = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaRuthlessLowlife.id,
    );
    const minotaur = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaArmoredMinotaur.id,
    );

    await pom.expectEddies(CYBERPUNK_P1, 4);
    await pom.expectGigCount(CYBERPUNK_P1, 3);
    expectEqual("Carnage fixture Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 21);

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectEddies(CYBERPUNK_P1, 0);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Carnage eligible rival target count", eligible.length, 1);
    if (!eligible.includes(lowlife.instanceId)) {
      throw new Error("Expected Ruthless Lowlife to be the only Carnage target.");
    }
    if (eligible.includes(minotaur.instanceId)) {
      throw new Error("Expected Armored Minotaur to be excluded from Carnage targets.");
    }

    await pom.resolveEffectTarget([lowlife.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldSize(CYBERPUNK_P2, 1);
    await pom.expectTrashSize(CYBERPUNK_P2, 1);
    await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaRuthlessLowlife.id);
    await pom.getCardInZoneByInstanceId("field", CYBERPUNK_P2, minotaur.instanceId);
    await pom.expectStructuralState();
  });

  test("Chrome Reverie - cant-attack target and free legend call", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/progChromeReverie?ai=off&auto-advance-attack=off");
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const program = expectDefined(
      "Chrome Reverie in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );
    const corpoSecurity = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );
    const riverWard = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      spoilerRiverWardDetectiveOnTheHunt.id,
    );

    expectEqual("River Ward starts face-down", riverWard.faceDown, true);
    await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 4);

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectEddies(CYBERPUNK_P1, 1);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const rivalUnitTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Chrome Reverie rival unit target count", rivalUnitTargets.length, 2);
    if (!rivalUnitTargets.includes(corpoSecurity.instanceId)) {
      throw new Error("Expected rival Corpo Security to be a Chrome Reverie target.");
    }

    await pom.resolveEffectTarget([corpoSecurity.instanceId], CYBERPUNK_P1);

    await pom.expectFieldCardGrantedRule(
      CYBERPUNK_P2,
      corpoSecurity.instanceId,
      "cantAttack",
      true,
    );
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const legendTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Chrome Reverie free legend-call target count", legendTargets.length, 1);
    if (!legendTargets.includes(riverWard.instanceId)) {
      throw new Error("Expected face-down River Ward to be the free legend-call target.");
    }

    await pom.resolveEffectTarget([riverWard.instanceId], CYBERPUNK_P1);

    const calledRiverWard = await pom.getCardInZoneByInstanceId(
      "legendArea",
      CYBERPUNK_P1,
      riverWard.instanceId,
    );
    expectEqual("River Ward is face-up after free call", calledRiverWard.faceDown, false);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);
    await pom.expectHandSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 1);
    await pom.expectFieldCardGrantedRule(
      CYBERPUNK_P2,
      corpoSecurity.instanceId,
      "cantAttack",
      true,
    );
    await pom.expectStructuralState();
  });

  test("Cyberpsychosis - equipped unit attack window", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/progCyberpsychosis?ai=off&auto-advance-attack=off");
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const tBug = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaTBugAmateurPhilosopher.id,
    );
    const bombus = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaSecondhandBombus.id,
    );

    await pom.expectHandSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 3);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, tBug.instanceId, 2);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, tBug.instanceId, 8);

    await pom.attackRival(tBug.instanceId, CYBERPUNK_P1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTrigger");

    const triggerOptions = await pom.getPendingTriggerOptions(CYBERPUNK_P1);
    const cyberpsychosisTrigger = expectDefined(
      "Cyberpsychosis trigger option",
      triggerOptions.find((option) => option.cardName === spoilerCyberpsychosis.displayName),
    );
    expectEqual("Cyberpsychosis trigger optional flag", cyberpsychosisTrigger.optional, true);

    await pom.resolveTrigger(cyberpsychosisTrigger.triggerId, CYBERPUNK_P1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const equippedUnitTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Cyberpsychosis equipped unit target count", equippedUnitTargets.length, 1);
    if (!equippedUnitTargets.includes(tBug.instanceId)) {
      throw new Error("Expected equipped T-Bug to be the Cyberpsychosis target.");
    }

    await pom.resolveEffectTarget([tBug.instanceId], CYBERPUNK_P1);
    const additionalCostTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Cyberpsychosis additional-cost target count", additionalCostTargets.length, 2);
    if (additionalCostTargets.includes(tBug.instanceId)) {
      throw new Error("Expected attacking T-Bug to be excluded from additional-cost targets.");
    }
    if (!additionalCostTargets.includes(bombus.instanceId)) {
      throw new Error("Expected ready Secondhand Bombus to be an additional-cost target.");
    }

    await pom.resolveEffectTarget([bombus.instanceId], CYBERPUNK_P1);

    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectEddies(CYBERPUNK_P1, 1);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, tBug.instanceId, true);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, bombus.instanceId, true);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, tBug.instanceId, 12);

    const remainingTriggers = await pom.getPendingTriggerOptions(CYBERPUNK_P1);
    if (remainingTriggers.some((option) => option.cardName === spoilerCyberpsychosis.displayName)) {
      throw new Error("Expected Cyberpsychosis to leave the trigger queue after resolving.");
    }
    await pom.expectStructuralState();
  });

  test("Gorilla Arms - extra same-sided gig steal", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/gearGorillaArms?ai=off&auto-advance-attack=off");
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const attacker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaTBugAmateurPhilosopher.id,
    );
    const firstD4 = expectDefined(
      "Gorilla Arms first rival d4",
      (await pom.getGigDice(CYBERPUNK_P2)).find((die) => die.dieType === "d4"),
    );

    await pom.expectGigCount(CYBERPUNK_P1, 1);
    await pom.expectGigCount(CYBERPUNK_P2, 3);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 9);

    await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
    await pom.resolveAttack(CYBERPUNK_P1, { gigIdsToSteal: [firstD4.id] });

    expectEqual("Gorilla Arms attack cleared", await pom.getAttackState(), null);
    await pom.expectGigCount(CYBERPUNK_P1, 3);
    await pom.expectGigCount(CYBERPUNK_P2, 1);
    const remainingRivalD4s = (await pom.getGigDice(CYBERPUNK_P2)).filter(
      (die) => die.dieType === "d4",
    );
    expectEqual("Gorilla Arms remaining rival d4 count", remainingRivalD4s.length, 0);
    await pom.expectStructuralState();
  });

  test("Zetatech Faceplate - spend trigger adjusts a gig and draws", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/gearZetatechFaceplate?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const host = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaSwordwiseHuscle.id,
    );
    const d8 = expectDefined(
      "Zetatech friendly d8",
      (await pom.getGigDice(CYBERPUNK_P1)).find((die) => die.dieType === "d8"),
    );

    await pom.expectHandSize(CYBERPUNK_P1, 1);
    await pom.expectGigValue(d8.id, 3);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);

    await pom.attackRival(host.instanceId, CYBERPUNK_P1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Zetatech eligible gig target count", eligible.length, 4);
    if (!eligible.includes(d8.id)) {
      throw new Error("Expected friendly d8 to be an eligible Zetatech Faceplate target.");
    }

    await pom.resolveEffectTarget([d8.id], CYBERPUNK_P1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    await pom.resolveAdjustGig(4, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectGigValue(d8.id, 4);
    await pom.expectHandSize(CYBERPUNK_P1, 2);
    await pom.expectStructuralState();
  });

  test("Adam Smasher - play trigger defeats every other unit", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/unitAdamSmasherMetalOverMeat?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const adam = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerAdamSmasherMetalOverMeat.id,
    );

    await pom.playCardFromHand(adam.instanceId, CYBERPUNK_P1);

    await pom.expectFieldSize(CYBERPUNK_P1, 1);
    await pom.expectFieldSize(CYBERPUNK_P2, 0);
    await pom.expectTrashSize(CYBERPUNK_P1, 2);
    await pom.expectTrashSize(CYBERPUNK_P2, 3);
    await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      spoilerAdamSmasherMetalOverMeat.id,
    );

    const p1Trash = await getZoneDefinitionIds(pom, "trash", CYBERPUNK_P1);
    expectIncludes("Adam P1 trash", p1Trash, alphaSwordwiseHuscle.id);
    expectIncludes("Adam P1 trash", p1Trash, alphaSecondhandBombus.id);

    const p2Trash = await getZoneDefinitionIds(pom, "trash", CYBERPUNK_P2);
    expectIncludes("Adam P2 trash", p2Trash, alphaCorpoSecurity.id);
    expectIncludes("Adam P2 trash", p2Trash, alphaArmoredMinotaur.id);
    expectIncludes("Adam P2 trash", p2Trash, alphaJackieWellesRideOrDieChoom.id);
    await pom.expectStructuralState();
  });

  test("Caliber - defeated trigger forces rival discards", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/unitCaliberTotentanzSTopDog?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const caliber = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      spoilerCaliberTotentanzSTopDog.id,
    );
    const minotaur = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaArmoredMinotaur.id,
    );

    await pom.attackUnit(caliber.instanceId, minotaur.instanceId, CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
    await pom.resolveAttack(CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P1);

    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P1, spoilerCaliberTotentanzSTopDog.id);
    await pom.expectPendingChoiceType(CYBERPUNK_P2, "chooseTarget");

    const firstChoices = await pom.getEligibleTargetIds(CYBERPUNK_P2);
    const firstDefinitions = await getChoiceDefinitionIds(pom, firstChoices);
    expectIncludes("Caliber first discard choices", firstDefinitions, alphaMt0d12Flathead.id);

    const flatheadId = firstChoices[firstDefinitions.indexOf(alphaMt0d12Flathead.id)];
    if (!flatheadId) {
      throw new Error("Expected Flathead to be discardable for Caliber's first discard.");
    }
    await pom.resolveDiscardFromHand([flatheadId], CYBERPUNK_P2);

    await pom.expectPendingChoiceType(CYBERPUNK_P2, "chooseTarget");
    const bonusChoices = await pom.getEligibleTargetIds(CYBERPUNK_P2);
    const bonusDefinitions = await getChoiceDefinitionIds(pom, bonusChoices);
    expectIncludes("Caliber bonus discard choices", bonusDefinitions, alphaCorpoSecurity.id);

    const corpoId = bonusChoices[bonusDefinitions.indexOf(alphaCorpoSecurity.id)];
    if (!corpoId) {
      throw new Error("Expected Corpo Security to be discardable for Caliber's bonus discard.");
    }
    await pom.resolveDiscardFromHand([corpoId], CYBERPUNK_P2);

    await pom.expectPendingChoiceType(CYBERPUNK_P2, null);
    await pom.expectHandSize(CYBERPUNK_P2, 1);
    await pom.expectTrashSize(CYBERPUNK_P2, 2);
    expectEqual("Caliber attack cleared", await pom.getAttackState(), null);
    await pom.expectStructuralState();
  });

  test("El Sombreron - attack trigger doubles fight power", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/unitElSombreronLaVenganzaLenta?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const elSombreron = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      spoilerElSombreronLaVenganzaLenta.id,
    );
    const target = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );

    await pom.attackUnit(elSombreron.instanceId, target.instanceId, CYBERPUNK_P1);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, elSombreron.instanceId, 8);

    const attack = await pom.getAttackState();
    if (!attack) {
      throw new Error("Expected El Sombreron to start a fight.");
    }
    expectEqual("El Sombreron attack kind", attack.kind, "fight");
    expectEqual("El Sombreron attack defender", attack.defenderId, target.instanceId);

    await pom.resolveAttack(CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
    await pom.resolveAttack(CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P1);

    expectEqual("El Sombreron resolved attack", await pom.getAttackState(), null);
    await pom.expectFieldSize(CYBERPUNK_P1, 1);
    await pom.expectTrashSize(CYBERPUNK_P2, 1);
    await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaCorpoSecurity.id);
    await pom.expectStructuralState();
  });

  test("Gilded Maton - defeats friendly gear to defeat cheap rival unit", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/unitGildedMaton?ai=off&auto-advance-attack=off");
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const maton = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerGildedMaton.id,
    );
    const host = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaSwordwiseHuscle.id,
    );
    const gear = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaKiroshiOptics.id,
    );
    const cheapTarget = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );

    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
    await pom.playCardFromHand(maton.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");
    const gearChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
    expectEqual("Gilded Maton gear choice count", gearChoices.length, 1);
    expectEqual("Gilded Maton gear choice", gearChoices[0], gear.instanceId);

    await pom.resolveCardToMove(gear.instanceId, CYBERPUNK_P1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
    expectIncludes("Gilded Maton eligible targets", eligibleDefinitions, alphaCorpoSecurity.id);
    expectExcludes("Gilded Maton eligible targets", eligibleDefinitions, alphaArmoredMinotaur.id);

    await pom.resolveEffectTarget([cheapTarget.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 0);
    await pom.expectFieldSize(CYBERPUNK_P1, 2);
    await pom.expectFieldSize(CYBERPUNK_P2, 1);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectTrashSize(CYBERPUNK_P2, 1);
    await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P1, alphaKiroshiOptics.id);
    await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaCorpoSecurity.id);
    await pom.expectStructuralState();
  });

  test("Hanako Arasaka - play trigger keeps top-deck cost matches", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/unitHanakoArasakaInAGildedCage?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const hanako = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerHanakoArasakaInAGildedCage.id,
    );

    expectEqual("Hanako initial deck size", await pom.getDeckSize(CYBERPUNK_P1), 40);
    await pom.playCardFromHand(hanako.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldSize(CYBERPUNK_P1, 2);
    await pom.expectHandSize(CYBERPUNK_P1, 2);
    await pom.expectTrashSize(CYBERPUNK_P1, 2);
    expectEqual("Hanako deck after search", await pom.getDeckSize(CYBERPUNK_P1), 36);
    await pom.expectEddies(CYBERPUNK_P1, 1);

    const handDefinitions = await getZoneDefinitionIds(pom, "hand", CYBERPUNK_P1);
    expectIncludes("Hanako hand definitions", handDefinitions, alphaSwordwiseHuscle.id);
    expectIncludes("Hanako hand definitions", handDefinitions, alphaFloorIt.id);
    expectExcludes("Hanako hand definitions", handDefinitions, alphaSecondhandBombus.id);

    const trashDefinitions = await getZoneDefinitionIds(pom, "trash", CYBERPUNK_P1);
    expectIncludes("Hanako trash definitions", trashDefinitions, alphaCorpoSecurity.id);
    expectIncludes("Hanako trash definitions", trashDefinitions, alphaRuthlessLowlife.id);
    await pom.expectStructuralState();
  });

  test("Kerry Eurodyne - max-value gig ability draws two", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/unitKerryEurodyneTheLastRockerboy?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const kerry = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      spoilerKerryEurodyneTheLastRockerboy.id,
    );
    const abilityCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "activateAbility");
    if (!abilityCandidates.includes(`${kerry.instanceId}:0`)) {
      throw new Error("Expected Kerry's activated ability to be visible.");
    }

    const handBefore = await pom.getHandSize(CYBERPUNK_P1);
    const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);

    await pom.activateAbility(kerry.instanceId, 0, CYBERPUNK_P1);

    await pom.expectFieldCardSpent(CYBERPUNK_P1, kerry.instanceId, true);
    await pom.expectHandSize(CYBERPUNK_P1, handBefore + 2);
    expectEqual("Kerry deck after draw", await pom.getDeckSize(CYBERPUNK_P1), deckBefore - 2);
    await pom.expectStructuralState();
  });

  test("Maman Brigitte - discards programs to bottom-deck unequipped unit", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/unitMamanBrigitte?ai=off&auto-advance-attack=off");
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const maman = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerMamanBrigitte.id,
    );
    const reboot = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaRebootOptics.id,
    );
    const surveillance = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaCorporateSurveillance.id,
    );
    await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaKiroshiOptics.id);
    const unequippedTarget = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaRuthlessLowlife.id,
    );

    const deckBefore = await pom.getDeckSize(CYBERPUNK_P2);
    await pom.playCardFromHand(maman.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    const discardChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    const discardDefinitions = await getChoiceDefinitionIds(pom, discardChoices);
    expectEqual("Maman discard choice count", discardChoices.length, 2);
    expectIncludes("Maman discard definitions", discardDefinitions, alphaRebootOptics.id);
    expectIncludes("Maman discard definitions", discardDefinitions, alphaCorporateSurveillance.id);
    expectExcludes("Maman discard definitions", discardDefinitions, alphaKiroshiOptics.id);

    await pom.resolveDiscardFromHand([reboot.instanceId, surveillance.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    const targetChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    const targetDefinitions = await getChoiceDefinitionIds(pom, targetChoices);
    expectEqual("Maman bottom-deck target count", targetChoices.length, 1);
    expectIncludes("Maman target definitions", targetDefinitions, alphaRuthlessLowlife.id);
    expectExcludes("Maman target definitions", targetDefinitions, alphaSwordwiseHuscle.id);

    await pom.resolveEffectTarget([unequippedTarget.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldSize(CYBERPUNK_P2, 1);
    await pom.expectTrashSize(CYBERPUNK_P1, 2);
    expectEqual("Maman rival deck size", await pom.getDeckSize(CYBERPUNK_P2), deckBefore + 1);

    const p2Deck = await getZoneDefinitionIds(pom, "deck", CYBERPUNK_P2);
    expectEqual("Maman bottom-decked card", p2Deck[p2Deck.length - 1], alphaRuthlessLowlife.id);
    await pom.expectStructuralState();
  });

  test("Meredith Stout - rival gig decrease recovers from trash", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/unitMeredithStoutStoneColdCorpo?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      spoilerMeredithStoutStoneColdCorpo.id,
    );
    const evelyn = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P2,
      spoilerEvelynParkerBeautifulEnigma.id,
    );
    const p1Gig = (await pom.getGigDice(CYBERPUNK_P1))[0];
    if (!p1Gig) {
      throw new Error("Expected Meredith fixture to start with a friendly gig.");
    }

    await pom.expectTrashSize(CYBERPUNK_P1, 2);
    await pom.callLegend(evelyn.instanceId, CYBERPUNK_P2);

    await pom.expectGigValue(p1Gig.id, 1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");
    const recoverChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
    const recoverDefinitions = await getChoiceDefinitionIds(pom, recoverChoices);
    expectIncludes("Meredith recovery choices", recoverDefinitions, alphaKiroshiOptics.id);

    const kiroshiId = recoverChoices[recoverDefinitions.indexOf(alphaKiroshiOptics.id)];
    if (!kiroshiId) {
      throw new Error("Expected Kiroshi Optics to be recoverable by Meredith.");
    }
    await pom.resolveCardToMove(kiroshiId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectHandSize(CYBERPUNK_P1, 1);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P2, 4);
    await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaKiroshiOptics.id);
    expectEqual("Meredith active player remains P2", await pom.getActivePlayerId(), CYBERPUNK_P2);
    await pom.expectStructuralState();
  });

  test("Placide - discards program to bottom-deck a rival unit", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/unitPlacideVoodooSentinel?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const placide = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerPlacideVoodooSentinel.id,
    );
    const program = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaCorporateSurveillance.id,
    );
    const target = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaArmoredMinotaur.id,
    );

    const deckBefore = await pom.getDeckSize(CYBERPUNK_P2);
    await pom.playCardFromHand(placide.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");
    const cardChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
    const choiceDefinitions = await getChoiceDefinitionIds(pom, cardChoices);
    expectEqual("Placide program choice count", cardChoices.length, 1);
    expectIncludes("Placide program choices", choiceDefinitions, alphaCorporateSurveillance.id);

    await pom.resolveCardToMove(program.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    const targetChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    const targetDefinitions = await getChoiceDefinitionIds(pom, targetChoices);
    expectEqual("Placide target count", targetChoices.length, 2);
    expectIncludes("Placide target choices", targetDefinitions, alphaArmoredMinotaur.id);
    expectIncludes("Placide target choices", targetDefinitions, alphaCorpoSecurity.id);

    await pom.resolveEffectTarget([target.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectFieldSize(CYBERPUNK_P2, 1);
    expectEqual("Placide rival deck size", await pom.getDeckSize(CYBERPUNK_P2), deckBefore + 1);

    const p2Deck = await getZoneDefinitionIds(pom, "deck", CYBERPUNK_P2);
    expectEqual("Placide bottom-decked card", p2Deck[p2Deck.length - 1], alphaArmoredMinotaur.id);
    await pom.expectStructuralState();
  });

  test("Riding Nomad - can attack spent units on played turn", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/unitRidingNomad?ai=off&auto-advance-attack=off");
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const nomadInHand = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerRidingNomad.id,
    );
    const spentTarget = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );
    const readyRival = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaArmoredMinotaur.id,
    );

    await pom.playCardFromHand(nomadInHand.instanceId, CYBERPUNK_P1);
    const nomad = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      spoilerRidingNomad.id,
    );
    expectEqual("Riding Nomad played this turn", nomad.playedThisTurn, true);
    await pom.expectFieldCardGrantedRule(
      CYBERPUNK_P1,
      nomad.instanceId,
      "canAttackOnPlayedTurnAgainstUnits",
      true,
    );

    const attackers = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackUnit");
    const targets = await pom.getMoveTargetCandidateIds(CYBERPUNK_P1, "attackUnit");
    if (!attackers.includes(nomad.instanceId)) {
      throw new Error("Expected Riding Nomad to be an attackUnit candidate after being played.");
    }
    if (!targets.includes(spentTarget.instanceId)) {
      throw new Error("Expected spent Corpo Security to be a Riding Nomad attack target.");
    }
    if (targets.includes(readyRival.instanceId)) {
      throw new Error("Expected ready Armored Minotaur not to be a Riding Nomad attack target.");
    }
    const directCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackRival");
    if (directCandidates.includes(nomad.instanceId)) {
      throw new Error("Expected Riding Nomad not to attack the rival directly on played turn.");
    }

    await pom.attackUnit(nomad.instanceId, spentTarget.instanceId, CYBERPUNK_P1);

    const attack = await pom.getAttackState();
    if (!attack) {
      throw new Error("Expected Riding Nomad to start a fight.");
    }
    expectEqual("Riding Nomad attack kind", attack.kind, "fight");
    expectEqual("Riding Nomad attack defender", attack.defenderId, spentTarget.instanceId);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, nomad.instanceId, true);
    await pom.expectStructuralState();
  });

  test("Royce - high Street Cred targets power three units", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/unitRoyceDonTCallMeSimonHighCred?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const royce = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerRoyceDonTCallMeSimon.id,
    );

    expectEqual("Royce high P1 Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 10);
    expectEqual("Royce high P2 Street Cred", await pom.getStreetCred(CYBERPUNK_P2), 1);
    await pom.playCardFromHand(royce.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
    expectIncludes("Royce high eligible targets", eligibleDefinitions, alphaCorpoSecurity.id);
    expectIncludes("Royce high eligible targets", eligibleDefinitions, POWER_THREE_MOCK_ID);
    expectExcludes("Royce high eligible targets", eligibleDefinitions, alphaArmoredMinotaur.id);

    const mockId = eligible[eligibleDefinitions.indexOf(POWER_THREE_MOCK_ID)];
    if (!mockId) {
      throw new Error("Expected high-cred Royce to target the power-three mock unit.");
    }
    await pom.resolveEffectTarget([mockId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldSize(CYBERPUNK_P2, 2);
    await pom.expectTrashSize(CYBERPUNK_P2, 1);
    await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, POWER_THREE_MOCK_ID);
    await pom.expectStructuralState();
  });

  test("Royce - low Street Cred targets power two or less", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/unitRoyceDonTCallMeSimonLowCred?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const royce = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerRoyceDonTCallMeSimon.id,
    );
    const lowlife = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaRuthlessLowlife.id,
    );

    expectEqual("Royce low P1 Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 2);
    expectEqual("Royce low P2 Street Cred", await pom.getStreetCred(CYBERPUNK_P2), 6);
    await pom.playCardFromHand(royce.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
    expectEqual("Royce low eligible count", eligible.length, 1);
    expectIncludes("Royce low eligible targets", eligibleDefinitions, alphaRuthlessLowlife.id);
    expectExcludes("Royce low eligible targets", eligibleDefinitions, alphaSwordwiseHuscle.id);

    await pom.resolveEffectTarget([lowlife.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldSize(CYBERPUNK_P2, 1);
    await pom.expectTrashSize(CYBERPUNK_P2, 1);
    await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaRuthlessLowlife.id);
    await pom.expectStructuralState();
  });

  test("Sandayu Oda - value pairs spend units and allow unit attack", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/unitSandayuOdaHanakoSGuardian?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const sandayuInHand = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerSandayuOdaHanakoSGuardian.id,
    );
    const corpo = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );
    const minotaur = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaArmoredMinotaur.id,
    );

    await pom.playCardFromHand(sandayuInHand.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
    expectEqual("Sandayu spend target count", eligible.length, 2);
    expectIncludes("Sandayu spend targets", eligibleDefinitions, alphaCorpoSecurity.id);
    expectIncludes("Sandayu spend targets", eligibleDefinitions, alphaArmoredMinotaur.id);

    await pom.resolveEffectTarget([corpo.instanceId, minotaur.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldCardSpent(CYBERPUNK_P2, corpo.instanceId, true);
    await pom.expectFieldCardSpent(CYBERPUNK_P2, minotaur.instanceId, true);

    const sandayu = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      spoilerSandayuOdaHanakoSGuardian.id,
    );
    await pom.expectFieldCardGrantedRule(
      CYBERPUNK_P1,
      sandayu.instanceId,
      "canAttackOnPlayedTurnAgainstUnits",
      true,
    );

    const attackers = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackUnit");
    const targets = await pom.getMoveTargetCandidateIds(CYBERPUNK_P1, "attackUnit");
    if (!attackers.includes(sandayu.instanceId)) {
      throw new Error("Expected Sandayu to be an attackUnit candidate after being played.");
    }
    if (!targets.includes(corpo.instanceId) || !targets.includes(minotaur.instanceId)) {
      throw new Error("Expected Sandayu to attack spent rival units after its play trigger.");
    }

    const directCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackRival");
    if (directCandidates.includes(sandayu.instanceId)) {
      throw new Error("Expected Sandayu not to attack the rival directly on played turn.");
    }

    await pom.attackUnit(sandayu.instanceId, corpo.instanceId, CYBERPUNK_P1);

    const attack = await pom.getAttackState();
    if (!attack) {
      throw new Error("Expected Sandayu to start a fight against a spent unit.");
    }
    expectEqual("Sandayu attack kind", attack.kind, "fight");
    expectEqual("Sandayu attack defender", attack.defenderId, corpo.instanceId);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, sandayu.instanceId, true);
    await pom.expectStructuralState();
  });

  test("Alt Cunningham - steal gig and replay a program", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/legendAltCunninghamSoulkillerArchitect?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const alt = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      spoilerAltCunninghamSoulkillerArchitect.id,
    );
    const corpoSecurity = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );

    await pom.attackRival(alt.instanceId, CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
    await pom.resolveAttack(CYBERPUNK_P1);

    expectEqual(
      "Alt removed after steal trigger",
      await pom.getCardInstanceExists(alt.instanceId),
      false,
    );
    await pom.expectGigCount(CYBERPUNK_P1, 3);
    await pom.expectGigCount(CYBERPUNK_P2, 0);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToPlay");

    const choices = await pom.getChoiceCardIds(CYBERPUNK_P1);
    expectEqual("Alt program choice count", choices.length, 1);
    expectEqual(
      "Alt program choice",
      await pom.getCardDefinitionId(choices[0]!),
      alphaCorporateSurveillance.id,
    );

    await pom.resolveCardToPlay(choices[0]!, CYBERPUNK_P1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const targets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    if (!targets.includes(corpoSecurity.instanceId)) {
      throw new Error("Expected Corporate Surveillance to target rival Corpo Security.");
    }

    await pom.resolveEffectTarget([corpoSecurity.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectEddies(CYBERPUNK_P1, 8);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectFieldCardSpent(CYBERPUNK_P2, corpoSecurity.instanceId, true);
    await pom.expectStructuralState();
  });

  test("Dum Dum - call defeats gear to draw four", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/legendDumDumMaelstromTriggerman?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const dumDum = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      spoilerDumDumMaelstromTriggerman.id,
    );
    const host = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaTBugAmateurPhilosopher.id,
    );
    const kiroshi = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaKiroshiOptics.id,
    );

    await pom.callLegend(dumDum.instanceId, CYBERPUNK_P1);

    await pom.expectEddies(CYBERPUNK_P1, 2);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");
    const choices = await pom.getChoiceCardIds(CYBERPUNK_P1);
    expectEqual("Dum Dum friendly gear choices", choices.length, 2);
    if (!choices.includes(kiroshi.instanceId)) {
      throw new Error("Expected Dum Dum to offer attached Kiroshi Optics.");
    }

    await pom.resolveCardToMove(kiroshi.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectHandSize(CYBERPUNK_P1, 5);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
    const moved = await pom.getCardInZoneByInstanceId("trash", CYBERPUNK_P1, kiroshi.instanceId);
    expectEqual("Dum Dum moved gear detached", moved.attachedToId, null);
    await pom.expectStructuralState();
  });

  test("Evelyn Parker - spend searches for Braindance", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/legendEvelynParkerBeautifulEnigma?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const evelyn = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      spoilerEvelynParkerBeautifulEnigma.id,
    );

    await pom.activateAbility(evelyn.instanceId, 1, CYBERPUNK_P1);

    await pom.expectLegendCardSpent(CYBERPUNK_P1, evelyn.instanceId, true);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "searchDeck");
    const revealed = await pom.getSearchDeckRevealedCardIds(CYBERPUNK_P1);
    expectEqual("Evelyn reveal count", revealed.length, 3);

    const definitions = await Promise.all(
      revealed.map((cardId) => pom.getCardDefinitionId(cardId)),
    );
    const afterpartyId = revealed[definitions.indexOf(spoilerAfterpartyAtLizzieS.id)];
    if (!afterpartyId) {
      throw new Error("Expected Evelyn search to reveal Afterparty at Lizzie's.");
    }

    await pom.resolveSearchDeck([afterpartyId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectHandSize(CYBERPUNK_P1, 2);
    expectEqual("Evelyn deck after search", await pom.getDeckSize(CYBERPUNK_P1), 38);
    await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, spoilerAfterpartyAtLizzieS.id);
    await pom.expectStructuralState();
  });

  test("Goro Takemura - Vengeful Bodyguard grants BLOCKER", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/legendGoroTakemuraVengefulBodyguard?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const goro = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      spoilerGoroTakemuraVengefulBodyguard.id,
    );
    const corpoSecurity = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaCorpoSecurity.id,
    );
    const attacker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaArmoredMinotaur.id,
    );

    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    const targets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    if (!targets.includes(corpoSecurity.instanceId)) {
      throw new Error("Expected Goro to be able to grant BLOCKER to Corpo Security.");
    }

    await pom.resolveEffectTarget([corpoSecurity.instanceId], CYBERPUNK_P1);

    await pom.expectLegendCardSpent(CYBERPUNK_P1, goro.instanceId, true);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, corpoSecurity.instanceId, 3);
    await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, corpoSecurity.instanceId, "blocker", true);

    const offensiveAttack = expectDefined("Goro defensive attack", await pom.getAttackState());
    expectEqual("Goro defensive attacker", offensiveAttack.attackerId, attacker.instanceId);

    await pom.resolveAttack(CYBERPUNK_P2);
    await pom.useBlocker(corpoSecurity.instanceId, CYBERPUNK_P1);

    const redirected = expectDefined("Goro redirected attack", await pom.getAttackState());
    expectEqual("Goro redirected kind", redirected.kind, "fight");
    expectEqual("Goro redirected defender", redirected.defenderId, corpoSecurity.instanceId);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, corpoSecurity.instanceId, true);
    await pom.expectStructuralState();
  });

  test("Panam Palmer - transfers legend gear to attacker", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/legendPanamPalmerNomadCavalry?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const panam = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      spoilerPanamPalmerNomadCavalry.id,
    );
    const attacker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaSwordwiseHuscle.id,
    );
    const mantis = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      alphaMantisBlades.id,
    );

    await pom.expectLegendCardAttachedGearCount(CYBERPUNK_P1, panam.instanceId, 1);
    await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);

    await pom.expectLegendCardSpent(CYBERPUNK_P1, panam.instanceId, true);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, attacker.instanceId, true);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");

    const choices = await pom.getChoiceCardIds(CYBERPUNK_P1);
    expectEqual("Panam gear choice count", choices.length, 1);
    expectEqual("Panam gear choice", choices[0], mantis.instanceId);

    await pom.resolveCardToMove(mantis.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectLegendCardAttachedGearCount(CYBERPUNK_P1, panam.instanceId, 0);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, attacker.instanceId, 1);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, attacker.instanceId, false);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 7);
    const moved = await pom.getCardInZoneByInstanceId("field", CYBERPUNK_P1, mantis.instanceId);
    expectEqual("Mantis moved to attacker", moved.attachedToId, attacker.instanceId);
    await pom.expectStructuralState();
  });

  test("River Ward - attack trigger equips free gear", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/legendRiverWardDetectiveOnTheHunt?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const river = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      spoilerRiverWardDetectiveOnTheHunt.id,
    );
    const attacker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaTBugAmateurPhilosopher.id,
    );
    const host = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaSecondhandBombus.id,
    );
    const kiroshi = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaKiroshiOptics.id,
    );

    await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);

    await pom.expectLegendCardSpent(CYBERPUNK_P1, river.instanceId, true);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToPlay");
    const choices = await pom.getChoiceCardIds(CYBERPUNK_P1);
    if (!choices.includes(kiroshi.instanceId)) {
      throw new Error("Expected River Ward to offer Kiroshi Optics as the free gear.");
    }

    await pom.resolveCardToPlay(kiroshi.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectEddies(CYBERPUNK_P1, 4);
    await pom.expectHandSize(CYBERPUNK_P1, 1);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
    const attached = await pom.getCardInZoneByInstanceId("field", CYBERPUNK_P1, kiroshi.instanceId);
    expectEqual("Kiroshi attached to River target", attached.attachedToId, host.instanceId);
    await pom.expectStructuralState();
  });

  test("Royce - Psycho on the Edge - gear-scaled GO SOLO", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/legendRoycePsychoOnTheEdge?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const royce = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      spoilerRoycePsychoOnTheEdge.id,
    );

    const legendView = await pom.getCardView(royce.instanceId, CYBERPUNK_P1);
    expectEqual("Royce legend effective power before GO SOLO", legendView.effectivePower, 13);
    expectEqual("Royce legend attached gear count", legendView.attachedGearIds.length, 2);

    await pom.goSolo(royce.instanceId, CYBERPUNK_P1);

    await pom.expectEddies(CYBERPUNK_P1, 2);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, royce.instanceId, false);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, royce.instanceId, 2);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, royce.instanceId, 13);
    await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, royce.instanceId, "goSolo", true);
    await pom.expectStructuralState();
  });

  test("V - Streetkid - GO SOLO defeated trigger", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/legendVStreetkid?ai=off&auto-advance-attack=off");
    const pom = await createPlaywrightCyberpunkSimulatorPom(page);

    const v = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      spoilerVStreetkid.id,
    );
    const defender = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaSwordwiseHuscle.id,
    );

    await pom.goSolo(v.instanceId, CYBERPUNK_P1);
    await pom.attackUnit(v.instanceId, defender.instanceId, CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
    await pom.resolveAttack(CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P1);

    expectEqual(
      "V Streetkid removed after GO SOLO defeat",
      await pom.getCardInstanceExists(v.instanceId),
      false,
    );
    expectEqual("V Streetkid attack cleared", await pom.getAttackState(), null);
    await pom.expectFieldSize(CYBERPUNK_P1, 1);
    await pom.expectHandSize(CYBERPUNK_P1, 1);
    await pom.expectTrashSize(CYBERPUNK_P1, 4);
    await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, spoilerAfterpartyAtLizzieS.id);
    expectEqual("V Streetkid deck after mill", await pom.getDeckSize(CYBERPUNK_P1), 3);
    await pom.expectStructuralState();
  });

  test("Peace Offering renders and opens the two-Gig choice", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/progPeaceOffering?ai=off&auto-advance-attack=off");
    const pom = await createPlaywrightCyberpunkSimulatorPom(page, { skipStructuralState: true });

    const program = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerPeaceOffering.id,
    );
    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  });

  test("Lucyna Kushinada renders as a promo legend", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/legendLucynaKushinada?ai=off&auto-advance-attack=off",
    );
    const pom = await createPlaywrightCyberpunkSimulatorPom(page, { skipStructuralState: true });

    const lucyna = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      promoLucynaKushinada.id,
    );
    expect(lucyna.definitionId).toBe(promoLucynaKushinada.id);
  });
});
