import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { captainSCallBlue, captainSCallRed, captainSCallYellow } from "./captain-s-call.ts";

const variants = [
  { label: "red", card: captainSCallRed },
  { label: "yellow", card: captainSCallYellow },
  { label: "blue", card: captainSCallBlue },
] as const;

describe.each(variants)("Captain's Call $label AAA", ({ card }) => {
  it("happy: the selected mode buffs a matching attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [card, woundingBlowBlue], actionPoints: 2, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(card, { modeIds: [`${card.canonicalId}:chooseMode:empower`] });
    game.helpers.resolveUntilIdle();
    Dash.playAttack(woundingBlowBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the chosen go-again mode refunds its action point", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [card], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(card, { modeIds: [`${card.canonicalId}:chooseMode:selfGoAgain`] });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
