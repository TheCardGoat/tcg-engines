import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { heavenSClawsRed } from "../actions/heaven-s-claws.ts";
import { briar } from "../shared/test-recipients.ts";
import { lightningPressBlue, lightningPressRed, lightningPressYellow } from "./lightning-press.ts";

const variants = [
  { label: "Lightning Press Red (ELE183)", card: lightningPressRed, amount: 3 },
  { label: "Lightning Press Yellow (ELE184)", card: lightningPressYellow, amount: 2 },
  { label: "Lightning Press Blue (ELE185)", card: lightningPressBlue, amount: 1 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, amount }) => {
  it(`happy: a cost-1 attack action gains +${amount} power`, () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [heavenSClawsRed, card],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(heavenSClawsRed);
    game.toReaction("attacker");
    Briar.play(card, { targetInstanceId: Briar.ref(heavenSClawsRed).instanceId });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5 + amount);
    expectFabCard(Briar, card).toBeIn("graveyard");
  });

  it("boundary: a cost-2 attack action is not a legal recipient", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [brutalAssaultBlue, card],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");

    expectFabUnplayable(() =>
      Briar.play(card, { targetInstanceId: Briar.ref(brutalAssaultBlue).instanceId }),
    );
    expectCombat(game).toHaveAttackPower(4);
  });
});
