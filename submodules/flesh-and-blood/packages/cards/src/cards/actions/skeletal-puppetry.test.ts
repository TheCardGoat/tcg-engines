import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { oystenHeartOfGoldYellow } from "./oysten-heart-of-gold.ts";
import { restlessClericRed } from "./restless-cleric.ts";
import { skeletalPuppetryRed, skeletalPuppetryYellow } from "./skeletal-puppetry.ts";
import { snatchRed } from "./snatch.ts";

describe("Skeletal Puppetry AAA", () => {
  it("happy: discarding an ally pays the cost and the next ally attack gets +3{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [skeletalPuppetryRed, restlessClericRed],
        arena: [oystenHeartOfGoldYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(skeletalPuppetryRed, { modeIds: ["pay"] });
    game.untilIdle({ entityTargets: "maximum" });
    expectFabCard(Gravy, restlessClericRed).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveAP(1);

    Gravy.activateAttack(oystenHeartOfGoldYellow);
    expectCombat(game).toHaveAttackPower(6).toHaveKeyword("go-again");
  });

  it("boundary: without an ally or resources the card cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [skeletalPuppetryRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    expectFabUnplayable(() => Gravy.play(skeletalPuppetryRed));
    expectFabCard(Gravy, skeletalPuppetryRed).toBeIn("hand");
  });

  it("boundary: a non-ally attack does not consume the +3{p} latch", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [skeletalPuppetryRed, restlessClericRed, snatchRed],
        arena: [oystenHeartOfGoldYellow],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(skeletalPuppetryRed, { modeIds: ["pay"] });
    game.untilIdle({ entityTargets: "maximum" });
    Gravy.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    Gravy.activateAttack(oystenHeartOfGoldYellow);
    expectCombat(game).toHaveAttackPower(6).toHaveKeyword("go-again");
  });

  it("happy: yellow grants the printed +2{p} rather than the red +3", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [skeletalPuppetryYellow, restlessClericRed],
        arena: [oystenHeartOfGoldYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(skeletalPuppetryYellow, { modeIds: ["pay"] });
    game.untilIdle({ entityTargets: "maximum" });

    Gravy.activateAttack(oystenHeartOfGoldYellow);
    expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
  });
});
