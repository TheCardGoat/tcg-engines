import {
  alphaArmoredMinotaur,
  alphaCorporateSurveillance,
  alphaCorpoSecurity,
  alphaDelamainCab,
  alphaDyingNightVSPistol,
  alphaEmergencyAtlus,
  alphaEvelynParkerSchemingSiren,
  alphaFloorIt,
  alphaGoroTakemuraLosingHisWay,
  alphaGoroTakemuraHandsUnclean,
  alphaIndustrialAssembly,
  alphaJackieWellesRideOrDieChoom,
  alphaJackieWellesPourOneOutForMe,
  alphaKiroshiOptics,
  alphaMantisBlades,
  alphaMt0d12Flathead,
  alphaRebootOptics,
  alphaRuthlessLowlife,
  alphaSaburoArasakaStubbornPatriach,
  alphaSandevistan,
  alphaSecondhandBombus,
  alphaSwordwiseHuscle,
  alphaTBugAmateurPhilosopher,
  alphaVCorporateExile,
  alphaViktorVektorSitDownAndRelax,
  alphaYorinobuArasakaEmbracingDestruction,
} from "@tcg/cyberpunk-cards";
import type { PlayerId } from "@tcg/cyberpunk-engine";
import type { SimulatorPage } from "../poms/SimulatorPage";
import { test, expect } from "../fixtures/test";

const P1 = "p1" as PlayerId;
const P2 = "p2" as PlayerId;

test.describe("Alpha card Playwright happy paths", () => {
  test("Corporate Surveillance spends the selected rival low-cost unit", async ({ simulator }) => {
    await simulator.gotoFixture("progCorporateSurveillance");
    const player = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(player);

    const programId = await findCardId(simulator, "hand", player, alphaCorporateSurveillance.id);
    await simulator.playCardFromHand(programId, player);
    const eligibleIds = await simulator.getEligibleTargetIds(player);
    expect(eligibleIds).toHaveLength(2);

    await simulator.resolveEffectTarget([eligibleIds[0]!], player);

    const rivalField = await simulator.getCardsInZone("field", rival);
    expect(
      rivalField.filter((card) => card.definitionId === alphaCorpoSecurity.id && card.spent),
    ).toHaveLength(1);
    expect(
      rivalField.filter((card) => card.definitionId === alphaCorpoSecurity.id && !card.spent),
    ).toHaveLength(1);
    await expect(simulator.playerBoard.trashZone).toHaveAttribute("data-count", "1");
  });

  test("Floor It returns the selected spent low-cost unit to its owner's hand", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progFloorIt");
    const player = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(player);
    const rivalHandBefore = await simulator.getHandSize(rival);

    await simulator.playCardFromHand(
      await findCardId(simulator, "hand", player, alphaFloorIt.id),
      player,
    );
    const corpoId = await findCardId(simulator, "field", rival, alphaCorpoSecurity.id);
    await simulator.resolveEffectTarget([corpoId], player);

    expect(await simulator.getHandSize(rival)).toBe(rivalHandBefore + 1);
    expect(
      (await simulator.getCardsInZone("field", rival)).some(
        (card) => card.definitionId === alphaCorpoSecurity.id,
      ),
    ).toBe(false);
    await expect(simulator.playerBoard.trashZone).toHaveAttribute("data-count", "1");
  });

  test("Industrial Assembly increases the selected friendly Gig and draws at high Street Cred", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progIndustrialAssemblyHighCred");
    const player = await simulator.getActivePlayerId();
    const handBefore = await simulator.getHandSize(player);
    const d8 = (await simulator.getGigDice(player)).find((die) => die.dieType === "d8");
    expect(d8).toBeDefined();

    await simulator.playCardFromHand(
      await findCardId(simulator, "hand", player, alphaIndustrialAssembly.id),
      player,
    );
    await simulator.resolveEffectTarget([d8!.id], player);

    await simulator.expectGigFaceValue(player, "d8", 5);
    expect(await simulator.getHandSize(player)).toBe(handBefore);
    await expect(simulator.playerBoard.trashZone).toHaveAttribute("data-count", "1");
  });

  test("Reboot Optics buffs the selected friendly unit and trashes the Program", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progRebootOptics");
    const player = await simulator.getActivePlayerId();
    const swordwiseId = await findCardId(simulator, "field", player, alphaSwordwiseHuscle.id);

    await simulator.playCardFromHand(
      await findCardId(simulator, "hand", player, alphaRebootOptics.id),
      player,
    );
    await simulator.resolveEffectTarget([swordwiseId], player);

    await expect(simulator.page.getByLabel("5 printed power, 9 current power")).toBeVisible();
    await expect(simulator.playerBoard.trashZone).toHaveAttribute("data-count", "1");
  });

  test("Corpo Security redirects a direct attack as a blocker", async ({ simulator }) => {
    await simulator.gotoFixture("unitCorpoSecurity");
    const attacker = await simulator.getActivePlayerId();
    const defender = await simulator.getOpponentOf(attacker);

    await simulator.attackRival(
      await findCardId(simulator, "field", attacker, alphaSwordwiseHuscle.id),
      attacker,
    );
    await simulator.resolveAttack(attacker);
    const corpoId = await findCardId(simulator, "field", defender, alphaCorpoSecurity.id);
    await simulator.useBlocker(corpoId, defender);

    const attack = await simulator.getAttackState();
    expect(attack?.kind).toBe("fight");
    expect(attack?.defenderId).toBe(corpoId);
    expect(
      (await simulator.getCardsInZone("field", defender)).find(
        (card) => card.instanceId === corpoId,
      )?.spent,
    ).toBe(true);
  });

  test("MT0D12 Flathead keeps its direct attack from being blocked at 7+ Street Cred", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitMt0d12Flathead");
    const player = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(player);
    const flatheadId = await findCardId(simulator, "field", player, alphaMt0d12Flathead.id);
    const blockerId = await findCardId(simulator, "field", rival, alphaCorpoSecurity.id);

    await simulator.attackRival(flatheadId, player);
    await simulator.resolveAttack(player);
    const result = await simulator.executeMove("useBlocker", { blockerId }, rival);

    expect((result as { success: boolean; errorCode?: string }).success).toBe(false);
    expect((result as { success: boolean; errorCode?: string }).errorCode).toBe("CANT_BE_BLOCKED");
    expect((await simulator.getAttackState())?.kind).toBe("direct");
  });

  test("Armored Minotaur defeats the selected rival unit at 12+ Street Cred", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitArmoredMinotaur");
    const player = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(player);

    await simulator.playCardFromHand(
      await findCardId(simulator, "hand", player, alphaArmoredMinotaur.id),
      player,
    );
    const corpoId = await findCardId(simulator, "field", rival, alphaCorpoSecurity.id);
    await simulator.resolveEffectTarget([corpoId], player);

    expect(
      (await simulator.getCardsInZone("field", player)).some(
        (card) => card.definitionId === alphaArmoredMinotaur.id,
      ),
    ).toBe(true);
    expect(
      (await simulator.getCardsInZone("trash", rival)).some(
        (card) => card.definitionId === alphaCorpoSecurity.id,
      ),
    ).toBe(true);
  });

  test("Secondhand Bombus redirects a direct attack and becomes spent", async ({ simulator }) => {
    await simulator.gotoFixture("unitSecondhandBombus");
    const attacker = await simulator.getActivePlayerId();
    const defender = await simulator.getOpponentOf(attacker);
    const bombusId = await findCardId(simulator, "field", defender, alphaSecondhandBombus.id);

    const initialAttack = await simulator.getAttackState();
    expect(initialAttack?.kind).toBe("direct");
    expect(initialAttack?.step).toBe("defensive");

    await simulator.useBlocker(bombusId, defender);

    const blockedAttack = await simulator.getAttackState();
    expect(blockedAttack?.kind).toBe("fight");
    expect(blockedAttack?.defenderId).toBe(bombusId);
    expect(blockedAttack?.redirectedByBlocker).toBe(true);
    expect(
      (await simulator.getCardsInZone("field", defender)).find(
        (card) => card.instanceId === bombusId,
      )?.spent,
    ).toBe(true);
  });

  test("Ruthless Lowlife renders spent with friendly Gigs ready to be stolen", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitRuthlessLowlife");
    const lowlifeId = await findCardId(simulator, "field", P1, alphaRuthlessLowlife.id);
    const attackerId = await findCardId(simulator, "field", P2, alphaArmoredMinotaur.id);
    const gigIdsToSteal = (await simulator.getGigDice(P1)).map((die) => die.id);
    expect(gigIdsToSteal).toHaveLength(2);
    await simulator.forceFixtureMainPhaseForPlayer(P2, {
      spentCardIds: [lowlifeId],
    });

    expect(attackerId).toBeTruthy();
    expect(
      (await simulator.getCardsInZone("field", P1)).find((card) => card.instanceId === lowlifeId)
        ?.spent,
    ).toBe(true);
  });

  test("Evelyn Parker draws after a rival steals a friendly Gig while she is spent", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitEvelynParkerSchemingSiren");
    const evelynId = await findCardId(simulator, "field", P1, alphaEvelynParkerSchemingSiren.id);
    const attackerId = await findCardId(simulator, "field", P2, alphaArmoredMinotaur.id);
    const handBefore = await simulator.getHandSize(P1);
    const gigToSteal = (await simulator.getGigDice(P1))[0];
    expect(gigToSteal).toBeDefined();
    await simulator.forceFixtureMainPhaseForPlayer(P2, {
      spentCardIds: [evelynId],
    });

    await simulator.attackRival(attackerId, P2);
    await simulator.resolveAttack(P2);
    await simulator.resolveAttack(P1, { pass: true });
    await simulator.resolveAttack(P2, { gigIdsToSteal: [gigToSteal!.id] });

    await simulator.expectHandSize(P1, handBefore + 1);
  });

  test("Jackie Welles shows twelve current power from three friendly Gigs", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitJackieWellesRideOrDieChoom");
    const player = await simulator.getActivePlayerId();

    expect(
      await findCardId(simulator, "field", player, alphaJackieWellesRideOrDieChoom.id),
    ).toBeTruthy();
    await simulator.expectGigCount(player, 3);
    await expect(simulator.page.getByLabel("6 printed power, 12 current power")).toBeVisible();
  });

  test("Goro Takemura shows seven current power from face-up friendly Legends", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitGoroTakemuraLosingHisWay");
    const player = await simulator.getActivePlayerId();

    expect(
      await findCardId(simulator, "field", player, alphaGoroTakemuraLosingHisWay.id),
    ).toBeTruthy();
    await simulator.expectFaceDownLegendsCount(player, 0);
    await expect(simulator.page.getByLabel("5 printed power, 7 current power")).toBeVisible();
  });

  test("Delamain Cab renders as a 7-power unit and starts a direct attack", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitDelamainCab");
    const delamainId = await findCardId(simulator, "field", P1, alphaDelamainCab.id);

    await expect(
      simulator.page.getByRole("button", { name: "Delamain Cab 7 power" }),
    ).toBeVisible();
    await simulator.attackRival(delamainId, P1);

    expect((await simulator.getAttackState())?.kind).toBe("direct");
    expect(
      (await simulator.getCardsInZone("field", P1)).find((card) => card.instanceId === delamainId)
        ?.spent,
    ).toBe(true);
  });

  test("Emergency Atlus renders as a 7-power unit and starts a direct attack", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitEmergencyAtlus");
    const atlusId = await findCardId(simulator, "field", P1, alphaEmergencyAtlus.id);

    await expect(
      simulator.page.getByRole("button", { name: "Emergency Atlus 7 power" }),
    ).toBeVisible();
    await simulator.attackRival(atlusId, P1);

    expect((await simulator.getAttackState())?.kind).toBe("direct");
    expect(
      (await simulator.getCardsInZone("field", P1)).find((card) => card.instanceId === atlusId)
        ?.spent,
    ).toBe(true);
  });

  test("Swordwise Huscle renders as a 5-power unit and starts a direct attack", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitSwordwiseHuscle");
    const swordwiseId = await findCardId(simulator, "field", P1, alphaSwordwiseHuscle.id);

    await expect(
      simulator.page.getByRole("button", { name: "Swordwise Huscle 5 power" }),
    ).toBeVisible();
    await simulator.attackRival(swordwiseId, P1);

    expect((await simulator.getAttackState())?.kind).toBe("direct");
    expect(
      (await simulator.getCardsInZone("field", P1)).find((card) => card.instanceId === swordwiseId)
        ?.spent,
    ).toBe(true);
  });

  test("T-Bug renders as a 5-power unit and starts a direct attack", async ({ simulator }) => {
    await simulator.gotoFixture("unitTBugAmateurPhilosopher");
    const tBugId = await findCardId(simulator, "field", P1, alphaTBugAmateurPhilosopher.id);

    await expect(
      simulator.page.getByRole("button", { name: "T-Bug - Amateur Philosopher 5 power" }),
    ).toBeVisible();
    await simulator.attackRival(tBugId, P1);

    expect((await simulator.getAttackState())?.kind).toBe("direct");
    expect(
      (await simulator.getCardsInZone("field", P1)).find((card) => card.instanceId === tBugId)
        ?.spent,
    ).toBe(true);
  });

  test("Dying Night defeats a rival low-cost gear at high Street Cred", async ({ simulator }) => {
    await simulator.gotoFixture("gearDyingNightHighCred");
    const attackerId = await findCardId(simulator, "field", P1, alphaTBugAmateurPhilosopher.id);
    const rivalGearId = await findCardId(simulator, "field", P2, alphaKiroshiOptics.id);

    await simulator.attackRival(attackerId, P1);
    expect(await simulator.getPendingChoiceType(P1)).toBe("chooseTarget");
    expect(await simulator.getEligibleTargetIds(P1)).toContain(rivalGearId);
    await simulator.resolveEffectTarget([rivalGearId], P1);

    expect(
      (await simulator.getCardsInZone("trash", P2)).some(
        (card) => card.definitionId === alphaKiroshiOptics.id,
      ),
    ).toBe(true);
  });

  test("Kiroshi Optics peeks a friendly face-down legend without revealing it", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("gearKiroshiOptics");
    const attackerId = await findCardId(simulator, "field", P1, alphaSwordwiseHuscle.id);
    await simulator.expectFaceDownLegendsCount(P1, 2);

    await simulator.attackRival(attackerId, P1);
    const targetId = (await simulator.getEligibleTargetIds(P1))[0]!;
    await simulator.resolveEffectTarget([targetId], P1);

    await simulator.expectFaceDownLegendsCount(P1, 2);
    expect(await simulator.getPendingChoiceType(P1)).toBeNull();
  });

  test("Mandibular Upgrade grants BLOCKER to its equipped unit", async ({ simulator }) => {
    await simulator.gotoFixture("gearMandibularUpgrade");
    const blockerId = await findCardId(simulator, "field", P1, alphaSwordwiseHuscle.id);
    expect((await simulator.getAttackState())?.kind).toBe("direct");

    await simulator.useBlocker(blockerId, P1);

    const attack = await simulator.getAttackState();
    expect(attack?.kind).toBe("fight");
    expect(attack?.defenderId).toBe(blockerId);
    expect(
      (await simulator.getCardsInZone("field", P1)).find((card) => card.instanceId === blockerId)
        ?.spent,
    ).toBe(true);
  });

  test("Mantis Blades adds power to its equipped host in combat", async ({ simulator }) => {
    await simulator.gotoFixture("gearMantisBlades");
    const hostId = await findCardId(simulator, "field", P1, alphaSwordwiseHuscle.id);
    const defenderId = await findCardId(simulator, "field", P2, alphaCorpoSecurity.id);

    await expect(simulator.page.getByLabel("5 printed power, 7 current power")).toBeVisible();
    await simulator.attackUnit(hostId, defenderId, P1);

    expect((await simulator.getAttackState())?.kind).toBe("fight");
  });

  test("Sandevistan lets the equipped played unit attack a spent unit", async ({ simulator }) => {
    await simulator.gotoFixture("gearSandevistan");
    const unitId = await findCardId(simulator, "hand", P1, alphaSwordwiseHuscle.id);
    const gearId = await findCardId(simulator, "hand", P1, alphaSandevistan.id);
    const defenderId = await findCardId(simulator, "field", P2, alphaCorpoSecurity.id);

    await simulator.playCardFromHand(unitId, P1);
    const hostId = await findCardId(simulator, "field", P1, alphaSwordwiseHuscle.id);
    await simulator.attachGearFromHand(gearId, hostId, P1);
    await expect(simulator.page.getByLabel("5 printed power, 8 current power")).toBeVisible();
    await simulator.attackUnit(hostId, defenderId, P1);

    expect((await simulator.getAttackState())?.defenderId).toBe(defenderId);
  });

  test("Satori gives its equipped host enough power to start a winning fight", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("gearSatoriSwordOfSaburo");
    const attackerId = await findCardId(simulator, "field", P1, alphaTBugAmateurPhilosopher.id);
    const defenderId = await findCardId(simulator, "field", P2, alphaCorpoSecurity.id);

    await expect(simulator.page.getByLabel("5 printed power, 6 current power")).toBeVisible();
    await simulator.attackUnit(attackerId, defenderId, P1);

    const attack = await simulator.getAttackState();
    expect(attack?.kind).toBe("fight");
    expect(attack?.attackerId).toBe(attackerId);
    expect(attack?.defenderId).toBe(defenderId);
  });

  test("V - Corporate Exile goes solo as a ready attacker", async ({ simulator }) => {
    await simulator.gotoFixture("legendVCorporateExile");
    const vId = await findCardId(simulator, "legendArea", P1, alphaVCorporateExile.id);
    const defenderId = await findCardId(simulator, "field", P2, alphaCorpoSecurity.id);

    await simulator.goSolo(vId, P1);
    await expect(
      simulator.page.getByRole("button", {
        name: "V - Corporate Exile Card abilities and effects 8 power",
      }),
    ).toBeVisible();
    await simulator.attackUnit(vId, defenderId, P1);

    expect((await simulator.getAttackState())?.kind).toBe("fight");
  });

  test("Goro Takemura - Hands Unclean goes solo with BLOCKER", async ({ simulator }) => {
    await simulator.gotoFixture("legendGoroTakemuraHandsUnclean");
    const goroId = await findCardId(simulator, "legendArea", P1, alphaGoroTakemuraHandsUnclean.id);

    await simulator.goSolo(goroId, P1);

    await expect(
      simulator.page.getByRole("button", {
        name: "Goro Takemura - Hands Unclean Card abilities and effects 7 power",
      }),
    ).toBeVisible();
    expect(
      (await simulator.getCardsInZone("field", P1)).some(
        (card) => card.definitionId === alphaGoroTakemuraHandsUnclean.id,
      ),
    ).toBe(true);
  });

  test("Jackie Welles increases a Gig after blue gear is played", async ({ simulator }) => {
    await simulator.gotoFixture("legendJackieWellesPourOneOutForMe");
    expect(
      await findCardId(simulator, "legendArea", P1, alphaJackieWellesPourOneOutForMe.id),
    ).toBeTruthy();
    const gearId = await findCardId(simulator, "hand", P1, alphaDyingNightVSPistol.id);
    const hostId = await findCardId(simulator, "field", P1, alphaSwordwiseHuscle.id);
    const handBefore = await simulator.getHandSize(P1);

    await simulator.expectGigFaceValue(P1, "d4", 2);
    await simulator.attachGearFromHand(gearId, hostId, P1);

    await simulator.expectGigFaceValue(P1, "d4", 4);
    expect(await simulator.getHandSize(P1)).toBe(handBefore);
  });

  test("Saburo Arasaka buffs friendly Arasaka units while attacking", async ({ simulator }) => {
    await simulator.gotoFixture("legendSaburoArasakaStubbornPatriach");
    expect(
      await findCardId(simulator, "legendArea", P1, alphaSaburoArasakaStubbornPatriach.id),
    ).toBeTruthy();
    const minotaurId = await findCardId(simulator, "field", P1, alphaArmoredMinotaur.id);
    const defenderId = await findCardId(simulator, "field", P2, alphaCorpoSecurity.id);

    await expect(
      simulator.page.getByRole("button", { name: "Armored Minotaur 9 power" }),
    ).toBeVisible();
    await simulator.attackUnit(minotaurId, defenderId, P1);
    await expect(simulator.page.getByText(/PWR\s*10\s*\+1/)).toBeVisible();
  });

  test("Viktor Vektor calls to search top deck for low-cost gear", async ({ simulator }) => {
    await simulator.gotoFixture("legendViktorVektorSitDownAndRelax");
    const viktorId = await findCardId(
      simulator,
      "legendArea",
      P1,
      alphaViktorVektorSitDownAndRelax.id,
    );

    await simulator.callLegend(viktorId, P1);
    expect(await simulator.getPendingChoiceType(P1)).toBe("searchDeck");
    const revealed = await simulator.getSearchDeckRevealedCardIds(P1);
    const definitions = await Promise.all(
      revealed.map((cardId) => simulator.getCardDefinitionId(cardId)),
    );
    const selected = [
      revealed[definitions.indexOf(alphaKiroshiOptics.id)]!,
      revealed[definitions.indexOf(alphaMantisBlades.id)]!,
    ];
    expect(selected.every(Boolean)).toBe(true);
    await simulator.resolveSearchDeck(selected, P1);

    const handDefinitions = (await simulator.getCardsInZone("hand", P1)).map(
      (card) => card.definitionId,
    );
    expect(handDefinitions).toContain(alphaKiroshiOptics.id);
    expect(handDefinitions).toContain(alphaMantisBlades.id);
  });

  test("Yorinobu draws then discards on the first friendly Arasaka attack", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendYorinobuArasakaEmbracingDestruction");
    expect(
      await findCardId(simulator, "legendArea", P1, alphaYorinobuArasakaEmbracingDestruction.id),
    ).toBeTruthy();
    const minotaurId = await findCardId(simulator, "field", P1, alphaArmoredMinotaur.id);
    const defenderId = await findCardId(simulator, "field", P2, alphaCorpoSecurity.id);

    await simulator.expectHandSize(P1, 2);
    await simulator.attackUnit(minotaurId, defenderId, P1);
    await simulator.expectHandSize(P1, 3);
    const discardId = (await simulator.getEligibleTargetIds(P1))[0]!;
    await simulator.resolveDiscardFromHand([discardId], P1);

    await simulator.expectHandSize(P1, 2);
    expect(await simulator.getPendingChoiceType(P1)).toBeNull();
  });
});

type CardZone = "hand" | "field" | "legendArea" | "eddieArea" | "trash";

async function findCardId(
  simulator: SimulatorPage,
  zone: CardZone,
  player: PlayerId,
  definitionId: string,
): Promise<string> {
  const card = (await simulator.getCardsInZone(zone, player)).find(
    (candidate) => candidate.definitionId === definitionId,
  );
  if (!card) {
    throw new Error(`Expected ${definitionId} in ${player} ${zone}.`);
  }
  return card.instanceId;
}
