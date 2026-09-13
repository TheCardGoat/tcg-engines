import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  type FabCardRef,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { arcanicCrackleBlue } from "./arcanic-crackle.ts";
import { oathOfTheArknightRed } from "./oath-of-the-arknight.ts";
import { oathOfTheArknightYellow } from "./oath-of-the-arknight.ts";
import { oathOfTheArknightBlue } from "./oath-of-the-arknight.ts";
import { lockedAndLoadedRed } from "./locked-and-loaded.ts";
import { lockedAndLoadedYellow } from "./locked-and-loaded.ts";
import { lockedAndLoadedBlue } from "./locked-and-loaded.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { tekloPlasmaPistol } from "../weapons/teklo-plasma-pistol.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { fryRed } from "./fry.ts";
import { sizzleRed } from "./sizzle.ts";
import { sizzleYellow } from "./sizzle.ts";
import { cinderskinDevotionRed } from "./cinderskin-devotion.ts";
import { riseFromTheAshesRed } from "./rise-from-the-ashes.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { brandWithCinderclawRed } from "./brand-with-cinderclaw.ts";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { mischievousMeepsRed } from "./mischievous-meeps.ts";
import { surayaArchangelOfKnowledge } from "../allies/suraya-archangel-of-knowledge.ts";
import { systemResetYellow } from "./system-reset.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { heraldOfProtectionRed } from "./herald-of-protection.ts";
import { awakeningBellowRed } from "./awakening-bellow.ts";
import { awakeningBellowBlue } from "./awakening-bellow.ts";
import { weaveEarthRed } from "./weave-earth.ts";
import { weaveEarthYellow } from "./weave-earth.ts";
import { weaveEarthBlue } from "./weave-earth.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { weaveIceYellow } from "./weave-ice.ts";
import { weaveIceBlue } from "./weave-ice.ts";
import { weaveLightningRed } from "./weave-lightning.ts";
import { weaveLightningYellow } from "./weave-lightning.ts";
import { weaveLightningBlue } from "./weave-lightning.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { winterSGraspRed } from "./winter-s-grasp.ts";
import { packHuntBlue } from "./pack-hunt.ts";
import { awakeningBellowYellow } from "./awakening-bellow.ts";
import { nimblismBlue } from "./nimblism.ts";
import { clapEmInIronsBlue } from "./clap-em-in-irons.ts";
import { outsideInterferenceBlue } from "./outside-interference.ts";
import { tearDownTheIdolsRed } from "./tear-down-the-idols.ts";
import { artOfTheDragonFireRed } from "./art-of-the-dragon-fire.ts";
import { riseFromTheAshesYellow } from "./rise-from-the-ashes.ts";
import { riseFromTheAshesBlue } from "./rise-from-the-ashes.ts";
import { eraseFaceRed } from "./erase-face.ts";

function startDashTurnAfterEraseFaceHits(hand: readonly FabCardRef[]) {
  const game = FabTestEngine.start(
    { hero: briar, hand: [eraseFaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
    { hero: dash, life: 20, hand, deck: 6 },
    FAB_MANUAL_HARNESS,
  );
  const Briar = game.as(briar);
  const Dash = game.as(dash);

  Briar.playAttack(eraseFaceRed);
  game.closeCombat({ optionals: "decline", ordering: "listed" });
  expectFabPlayer(Dash).toHaveLife(14);
  Briar.endTurn();
  game.untilIdle({ ordering: "listed" });

  return { game, Dash };
}

describe("Erase Face (UPR187) AAA", () => {
  it("happy: hits a hero for printed 6", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [eraseFaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(eraseFaceRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(Briar, eraseFaceRed).toBeIn("graveyard");
  });

  it("boundary: a fully blocked attack does not hit and deals no damage", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [eraseFaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [brutalAssaultBlue, brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.attackWith(eraseFaceRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Briar, eraseFaceRed).toBeIn("graveyard");
  });

  it("boundary: 0 resources cannot pay the cost-2 attack", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [eraseFaceRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(briar).attackWith(eraseFaceRed)).toThrow();
  });

  it("removes class and talent types from equipment owned by the hit hero", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [eraseFaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, weapon1: [tekloPlasmaPistol], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(eraseFaceRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, tekloPlasmaPistol).notToHaveSupertype("Mechanologist");
  });

  it("Awakening Bellow Red does not recognize an erased Brute attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      awakeningBellowRed,
      packHuntBlue,
      nimblismBlue,
    ]);
    expectFabCard(Dash, packHuntBlue).notToHaveSupertype("Brute");

    Dash.must.pitch(nimblismBlue).play(awakeningBellowRed);
    game.untilIdle();
    Dash.playAttack(packHuntBlue);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("Awakening Bellow Yellow does not recognize an erased Brute attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      awakeningBellowYellow,
      packHuntBlue,
      nimblismBlue,
    ]);
    expectFabCard(Dash, packHuntBlue).notToHaveSupertype("Brute");

    Dash.must.pitch(nimblismBlue).play(awakeningBellowYellow);
    game.untilIdle();
    Dash.playAttack(packHuntBlue);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("Awakening Bellow Blue does not recognize an erased Brute attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      awakeningBellowBlue,
      packHuntBlue,
      nimblismBlue,
    ]);
    expectFabCard(Dash, packHuntBlue).notToHaveSupertype("Brute");

    Dash.must.pitch(nimblismBlue).play(awakeningBellowBlue);
    game.untilIdle();
    Dash.playAttack(packHuntBlue);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("Locked and Loaded Red does not recognize an erased Mechanologist attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([lockedAndLoadedRed, zeroToSixtyRed]);
    expectFabCard(Dash, zeroToSixtyRed).notToHaveSupertype("Mechanologist");

    Dash.play(lockedAndLoadedRed);
    game.untilIdle();
    Dash.playAttack(zeroToSixtyRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("Locked and Loaded Yellow does not recognize an erased Mechanologist attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([lockedAndLoadedYellow, zeroToSixtyRed]);
    expectFabCard(Dash, zeroToSixtyRed).notToHaveSupertype("Mechanologist");

    Dash.play(lockedAndLoadedYellow);
    game.untilIdle();
    Dash.playAttack(zeroToSixtyRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("Locked and Loaded Blue does not recognize an erased Mechanologist attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([lockedAndLoadedBlue, zeroToSixtyRed]);
    expectFabCard(Dash, zeroToSixtyRed).notToHaveSupertype("Mechanologist");

    Dash.play(lockedAndLoadedBlue);
    game.untilIdle();
    Dash.playAttack(zeroToSixtyRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("Rise from the Ashes Red does not recognize an erased Draconic Ninja attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      riseFromTheAshesRed,
      cinderskinDevotionRed,
      nimblismBlue,
    ]);
    expectFabCard(Dash, cinderskinDevotionRed).notToHaveSupertype("Draconic");
    expectFabCard(Dash, cinderskinDevotionRed).notToHaveSupertype("Ninja");

    Dash.play(riseFromTheAshesRed);
    game.untilIdle({ optionals: "decline" });
    Dash.must.pitch(nimblismBlue).playAttack(cinderskinDevotionRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("Rise from the Ashes Yellow does not recognize an erased Draconic Ninja attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      riseFromTheAshesYellow,
      cinderskinDevotionRed,
      nimblismBlue,
    ]);
    expectFabCard(Dash, cinderskinDevotionRed).notToHaveSupertype("Draconic");
    expectFabCard(Dash, cinderskinDevotionRed).notToHaveSupertype("Ninja");

    Dash.play(riseFromTheAshesYellow);
    game.untilIdle({ optionals: "decline" });
    Dash.must.pitch(nimblismBlue).playAttack(cinderskinDevotionRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("Rise from the Ashes Blue does not recognize an erased Draconic Ninja attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      riseFromTheAshesBlue,
      cinderskinDevotionRed,
      nimblismBlue,
    ]);
    expectFabCard(Dash, cinderskinDevotionRed).notToHaveSupertype("Draconic");
    expectFabCard(Dash, cinderskinDevotionRed).notToHaveSupertype("Ninja");

    Dash.play(riseFromTheAshesBlue);
    game.untilIdle({ optionals: "decline" });
    Dash.must.pitch(nimblismBlue).playAttack(cinderskinDevotionRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("Oath of the Arknight Red does not recognize an erased Runeblade attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      oathOfTheArknightRed,
      arcanicCrackleBlue,
      nimblismBlue,
    ]);
    expectFabCard(Dash, arcanicCrackleBlue).notToHaveSupertype("Runeblade");

    Dash.must.pitch(nimblismBlue).play(oathOfTheArknightRed);
    game.untilIdle();
    Dash.playAttack(arcanicCrackleBlue, { stopAt: "on-attack" });
    Dash.target(game.as(briar));

    expectCombat(game).toHaveAttackPower(1);
  });

  it("Oath of the Arknight Yellow does not recognize an erased Runeblade attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      oathOfTheArknightYellow,
      arcanicCrackleBlue,
      nimblismBlue,
    ]);
    expectFabCard(Dash, arcanicCrackleBlue).notToHaveSupertype("Runeblade");

    Dash.must.pitch(nimblismBlue).play(oathOfTheArknightYellow);
    game.untilIdle();
    Dash.playAttack(arcanicCrackleBlue, { stopAt: "on-attack" });
    Dash.target(game.as(briar));

    expectCombat(game).toHaveAttackPower(1);
  });

  it("Oath of the Arknight Blue does not recognize an erased Runeblade attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      oathOfTheArknightBlue,
      arcanicCrackleBlue,
      nimblismBlue,
    ]);
    expectFabCard(Dash, arcanicCrackleBlue).notToHaveSupertype("Runeblade");

    Dash.must.pitch(nimblismBlue).play(oathOfTheArknightBlue);
    game.untilIdle();
    Dash.playAttack(arcanicCrackleBlue, { stopAt: "on-attack" });
    Dash.target(game.as(briar));

    expectCombat(game).toHaveAttackPower(1);
  });

  it("Weave Earth Red does not recognize an erased Earth attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      weaveEarthRed,
      autumnSTouchBlue,
      nimblismBlue,
    ]);
    expectFabCard(Dash, autumnSTouchBlue).notToHaveSupertype("Earth");

    Dash.play(weaveEarthRed);
    game.untilIdle();
    Dash.must.pitch(nimblismBlue).playAttack(autumnSTouchBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
  });

  it("Weave Earth Yellow does not recognize an erased Earth attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      weaveEarthYellow,
      autumnSTouchBlue,
      nimblismBlue,
    ]);
    expectFabCard(Dash, autumnSTouchBlue).notToHaveSupertype("Earth");

    Dash.play(weaveEarthYellow);
    game.untilIdle();
    Dash.must.pitch(nimblismBlue).playAttack(autumnSTouchBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
  });

  it("Weave Earth Blue does not recognize an erased Earth attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      weaveEarthBlue,
      autumnSTouchBlue,
      nimblismBlue,
    ]);
    expectFabCard(Dash, autumnSTouchBlue).notToHaveSupertype("Earth");

    Dash.play(weaveEarthBlue);
    game.untilIdle();
    Dash.must.pitch(nimblismBlue).playAttack(autumnSTouchBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
  });

  it("Weave Ice Red does not recognize an erased Ice attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      weaveIceRed,
      winterSGraspRed,
      nimblismBlue,
    ]);
    expectFabCard(Dash, winterSGraspRed).notToHaveSupertype("Ice");

    Dash.play(weaveIceRed);
    game.untilIdle();
    Dash.must.pitch(nimblismBlue).playAttack(winterSGraspRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
  });

  it("Weave Ice Yellow does not recognize an erased Ice attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      weaveIceYellow,
      winterSGraspRed,
      nimblismBlue,
    ]);
    expectFabCard(Dash, winterSGraspRed).notToHaveSupertype("Ice");

    Dash.play(weaveIceYellow);
    game.untilIdle();
    Dash.must.pitch(nimblismBlue).playAttack(winterSGraspRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
  });

  it("Weave Ice Blue does not recognize an erased Ice attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([
      weaveIceBlue,
      winterSGraspRed,
      nimblismBlue,
    ]);
    expectFabCard(Dash, winterSGraspRed).notToHaveSupertype("Ice");

    Dash.play(weaveIceBlue);
    game.untilIdle();
    Dash.must.pitch(nimblismBlue).playAttack(winterSGraspRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
  });

  it("Weave Lightning Red does not recognize an erased Lightning attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([weaveLightningRed, fryRed]);
    expectFabCard(Dash, fryRed).notToHaveSupertype("Lightning");

    Dash.play(weaveLightningRed);
    game.untilIdle();
    Dash.playAttack(fryRed);

    expectCombat(game).toHaveAttackPower(3);
  });

  it("Weave Lightning Yellow does not recognize an erased Lightning attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([weaveLightningYellow, fryRed]);
    expectFabCard(Dash, fryRed).notToHaveSupertype("Lightning");

    Dash.play(weaveLightningYellow);
    game.untilIdle();
    Dash.playAttack(fryRed);

    expectCombat(game).toHaveAttackPower(3);
  });

  it("Weave Lightning Blue does not recognize an erased Lightning attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([weaveLightningBlue, fryRed]);
    expectFabCard(Dash, fryRed).notToHaveSupertype("Lightning");

    Dash.play(weaveLightningBlue);
    game.untilIdle();
    Dash.playAttack(fryRed);

    expectCombat(game).toHaveAttackPower(3);
  });

  it("Sizzle Red does not recognize an erased Lightning attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([sizzleRed, fryRed]);
    expectFabCard(Dash, fryRed).notToHaveSupertype("Lightning");

    Dash.play(sizzleRed);
    game.untilIdle();
    Dash.playAttack(fryRed);

    expectCombat(game).toHaveAttackPower(3);
  });

  it("Sizzle Yellow does not recognize an erased Lightning attack", () => {
    const { game, Dash } = startDashTurnAfterEraseFaceHits([sizzleYellow, fryRed]);
    expectFabCard(Dash, fryRed).notToHaveSupertype("Lightning");

    Dash.play(sizzleYellow);
    game.untilIdle();
    Dash.playAttack(fryRed);

    expectCombat(game).toHaveAttackPower(3);
  });

  it("a Pirate-dependent item does not recognize the erased hero's Pirate class", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [eraseFaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: gravyBones, hand: [clapEmInIronsBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Gravy = game.as(gravyBones);

    Briar.playAttack(eraseFaceRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Briar.endTurn();
    game.untilIdle({ ordering: "listed" });

    Gravy.play(clapEmInIronsBlue);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Gravy, gravyBones).toBeReady();
  });

  it("Suraya destroyed by ward cannot attack from the graveyard after Erase Face", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [eraseFaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: prismAwakenerOfSol,
        arena: [surayaArchangelOfKnowledge],
        soul: [heraldOfProtectionRed],
        hand: [nimblismBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Prism = game.as(prismAwakenerOfSol);

    Briar.playAttack(eraseFaceRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Briar.endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Prism, surayaArchangelOfKnowledge).toBeIn("graveyard");
    expect(Prism.expectActivationRejected(surayaArchangelOfKnowledge).errorCode).toBe(
      "invalid_activation_source",
    );
    expectFabCard(Prism, heraldOfProtectionRed).toBeIn("soul");
    expectFabPlayer(Briar).toHaveLife(20);
  });

  it("Outside Interference does not recognize an erased Reviled attack in inventory", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [eraseFaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [outsideInterferenceBlue],
        inventory: [tearDownTheIdolsRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(eraseFaceRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Briar.endTurn();
    game.untilIdle({ ordering: "listed" });

    Dash.activate(outsideInterferenceBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "maximum", ordering: "listed" });

    expectFabCard(Dash, outsideInterferenceBlue).toBeIn("graveyard");
    expect(Dash.zone("inventory")).toContain(tearDownTheIdolsRed.canonicalId);
    expect(Dash.zone("hand")).not.toContain(tearDownTheIdolsRed.canonicalId);
  });

  it("Brand with Cinderclaw can add Draconic while Erase Face is active", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [eraseFaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: fai,
        hand: [brandWithCinderclawRed, artOfTheDragonFireRed, nimblismBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Fai = game.as(fai);

    Briar.playAttack(eraseFaceRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Briar.endTurn();
    game.untilIdle({ ordering: "listed" });

    Fai.playAttack(brandWithCinderclawRed);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });
    Fai.playAttack(artOfTheDragonFireRed, {
      pitch: [nimblismBlue],
      stopAt: "on-attack",
    });
    Fai.targetRequired(Briar);
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectCombat(game).toHaveAttackSupertype("Draconic").toHaveAttackPower(5);
    expectFabPlayer(Briar).toHaveLife(15);
  });

  it("a recovered Phoenix Flame remains erased after its graveyard-to-hand reset", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [eraseFaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: fai,
        hand: [riseFromTheAshesRed],
        graveyard: [phoenixFlameRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Fai = game.as(fai);

    Briar.playAttack(eraseFaceRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Briar.endTurn();
    game.untilIdle({ ordering: "listed" });

    Fai.play(riseFromTheAshesRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expectFabCard(Fai, phoenixFlameRed).toBeIn("hand");
    Fai.playAttack(phoenixFlameRed);

    expectCombat(game).toHaveAttackPower(0).notToHaveAttackSupertype("Draconic");
  });

  it("class and talent return after the end of the affected hero's next turn", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [eraseFaceRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [lockedAndLoadedRed, zeroToSixtyRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(eraseFaceRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Briar.endTurn();
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, zeroToSixtyRed).notToHaveSupertype("Mechanologist");

    Dash.endTurn();
    game.untilIdle({ ordering: "listed" });
    Briar.endTurn();
    game.untilIdle({ ordering: "listed" });

    Dash.play(lockedAndLoadedRed);
    game.untilIdle({ ordering: "listed" });
    Dash.playAttack(zeroToSixtyRed);

    expectCombat(game).toHaveAttackSupertype("Mechanologist").toHaveAttackPower(7);
  });

  it("does not erase a Mechanologist item the affected hero controls but does not own", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [mischievousMeepsRed, systemResetYellow, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: briar,
        hand: [eraseFaceRed, nimblismBlue],
        arena: [hyperDriverRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(mischievousMeepsRed);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });
    expectFabCard(Dash, hyperDriverRed).toBeIn("arena");
    Dash.endTurn();
    game.untilIdle({ ordering: "listed" });

    Briar.playAttack(eraseFaceRed, { pitch: [nimblismBlue] });
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Briar.endTurn();
    game.untilIdle({ ordering: "listed" });

    Dash.play(systemResetYellow, { xValue: 1, pitch: [nimblismBlue] });
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: hyperDriverRed.canonicalId,
      ordering: "listed",
    });

    expectFabCard(Briar, hyperDriverRed).toBeIn("arena");
  });
});
