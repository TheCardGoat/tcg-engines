import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { barnacleYellow } from "./barnacle.ts";
import { nimblismBlue } from "./nimblism.ts";
import { jitteryBonesRed } from "./jittery-bones.ts";

describe("Jittery Bones family AAA", () => {
  it("happy: discarding a watery-grave card when this attacks grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [jitteryBonesRed, barnacleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(jitteryBonesRed);
    game.advanceToDecision(Gravy, "boolean");
    Gravy.chooseBoolean(true);
    const choice = Gravy.expectDecision("effect-resolution");
    game.answerDecision(Gravy.id, {
      kind: "effect-resolution",
      optionId: choice.options[0]!.id,
    });
    Gravy.chooseTargets(barnacleYellow);

    expect(game.combat()?.activeLink?.keywords ?? []).toContain("go-again");
    expectFabCard(Gravy, barnacleYellow).toBeIn("graveyard");
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Gravy).toHaveAP(1);
  });

  it("boundary: discarding a card without watery grave does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [jitteryBonesRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(jitteryBonesRed);
    game.advanceToDecision(Gravy, "boolean");
    Gravy.chooseBoolean(true);
    const choice = Gravy.expectDecision("effect-resolution");
    game.answerDecision(Gravy.id, {
      kind: "effect-resolution",
      optionId: choice.options[0]!.id,
    });
    Gravy.chooseTargets(nimblismBlue);

    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    expectFabCard(Gravy, nimblismBlue).toBeIn("graveyard");
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Gravy).toHaveAP(0);
  });

  it("timing: destroying the top card of the deck with watery grave grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [jitteryBonesRed],
        actionPoints: 1,
        deck: [
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          barnacleYellow,
        ],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(jitteryBonesRed);
    game.advanceToDecision(Gravy, "boolean");
    Gravy.chooseBoolean(true);
    const choice = Gravy.expectDecision("effect-resolution");
    // The empty hand hides the discard arm, so the destroy arm is the sole
    // published option; select it by its stable id.
    const destroyArm = choice.options.find((option) => option.id === "option-1");
    game.answerDecision(Gravy.id, {
      kind: "effect-resolution",
      optionId: destroyArm!.id,
    });

    expect(game.combat()?.activeLink?.keywords ?? []).toContain("go-again");
    expectFabCard(Gravy, barnacleYellow).toBeIn("graveyard");
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Gravy).toHaveAP(1);
  });
});
