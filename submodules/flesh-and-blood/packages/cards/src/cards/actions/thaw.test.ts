import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { hypothermiaBlue } from "./hypothermia.ts";
import { thawRed } from "./thaw.ts";

const thawModeId = (modeId: string): string =>
  `${thawRed.canonicalId}:whileInGraveyardAtStartTurnBanishChooseNumber1DestroyFrostbiteDestroy:${modeId}`;

/**
 * Thaw (UPR086) — while this is in your graveyard, at the start of your turn
 * you may banish it and choose 1: destroy target Frostbite, destroy target
 * Ice affliction, or unfreeze target frozen card.
 *
 * CR 6.6.6a: modes and targets are declared as the triggered-layer is added.
 * Optional `additionalCost: banish-self` is the printed "you may banish it"
 * (`packages/engine/src/kernel/trigger-declaration.ts`). Decline drops the
 * pending layer. Accept banishes Thaw; the chosen mode still resolves because
 * the GY trigger-state is not re-checked at resolution.
 *
 * Ice affliction seed: Bravo plays Hypothermia (Affliction enters under the
 * opponent). Frostbite and Hypothermia self-destroy at their controller's end
 * phase, so a start-of-setup token dies before Thaw's first collected start
 * phase. Planting on Bravo's turn leaves the affliction live at Blaze's start.
 */

function startThawWithHypothermia() {
  const game = FabTestEngine.start(
    { hero: blazeFiremind, graveyard: [thawRed], deck: 4, intellect: 0 },
    { hero: bravo, hand: [hypothermiaBlue], actionPoints: 1, deck: 4 },
    FAB_MANUAL_HARNESS,
  );
  const Blaze = game.as(blazeFiremind);
  const Bravo = game.as(bravo);

  Blaze.endTurn();
  Bravo.play(hypothermiaBlue);
  game.untilIdle();
  Bravo.endTurn();

  return { game, Blaze };
}

describe("Thaw (UPR086) AAA", () => {
  it("happy: paying the banish additional cost destroys Hypothermia", () => {
    const { game, Blaze } = startThawWithHypothermia();

    expect(Blaze.zone("arena")).toContain(hypothermiaBlue.canonicalId);
    Blaze.expectDecision("option");
    Blaze.choose(thawModeId("destroyIceAffliction"));
    Blaze.expectDecision("boolean");
    Blaze.accept();
    game.untilIdle({ entityTargets: "minimum", optionals: "accept" });

    expectFabCard(Blaze, thawRed).toBeBanished();
    expect(Blaze.zone("arena")).not.toContain(hypothermiaBlue.canonicalId);
  });

  it("boundary: declining the self-banish leaves Thaw in the graveyard and spares Hypothermia", () => {
    const { Blaze } = startThawWithHypothermia();

    Blaze.choose(thawModeId("destroyIceAffliction"));
    Blaze.expectDecision("boolean");
    Blaze.decline();

    expectFabCard(Blaze, thawRed).toBeIn("graveyard");
    expect(Blaze.zone("arena")).toContain(hypothermiaBlue.canonicalId);
  });

  it("timing: a mode with no legal target ceases the layer (CR 6.6.6a) and does not banish Thaw", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, graveyard: [thawRed], deck: 4, intellect: 0 },
      { hero: bravo, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.endTurn();
    game.as(bravo).endTurn();
    Blaze.expectDecision("option");
    Blaze.choose(thawModeId("destroyFrostbite"));

    expectFabCard(Blaze, thawRed).toBeIn("graveyard");
  });
});
