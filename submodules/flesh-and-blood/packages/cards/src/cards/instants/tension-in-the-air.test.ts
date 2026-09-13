import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { cleansingLightBlue } from "../actions/cleansing-light.ts";
import { cleansingLightRed } from "../actions/cleansing-light.ts";
import { cleansingLightYellow } from "../actions/cleansing-light.ts";
import { snatchRed } from "../actions/snatch.ts";
import {
  tensionInTheAirBlue,
  tensionInTheAirRed,
  tensionInTheAirYellow,
} from "./tension-in-the-air.ts";

const variants = [
  {
    label: "Tension in the Air Red (APS013)",
    card: tensionInTheAirRed,
    amount: 4,
    destroyer: cleansingLightRed,
  },
  {
    label: "Tension in the Air Yellow (SUP205)",
    card: tensionInTheAirYellow,
    amount: 3,
    destroyer: cleansingLightYellow,
  },
  {
    label: "Tension in the Air Blue (APS025)",
    card: tensionInTheAirBlue,
    amount: 2,
    destroyer: cleansingLightBlue,
  },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, amount, destroyer }) => {
  it(`happy: leaving the arena gives the next attack +${amount}{p}`, () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [card],
        hand: [destroyer, snatchRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(destroyer);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: card.canonicalId });
    expectFabCard(Bravo, card).toBeIn("graveyard");

    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4 + amount);
  });

  it("boundary: the aura itself does not modify an attack while it remains", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [card], hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the bonus is consumed by the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [card],
        hand: [destroyer, snatchRed, snatchRed],
        resourcePoints: 4,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const snatches = Bravo.cardsIn("hand", snatchRed);

    Bravo.play(destroyer);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: card.canonicalId });
    Bravo.playAttack(snatches[0]!);
    expectCombat(game).toHaveAttackPower(4 + amount);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Bravo.playAttack(snatches[1]!);
    expectCombat(game).toHaveAttackPower(4);
  });
});
