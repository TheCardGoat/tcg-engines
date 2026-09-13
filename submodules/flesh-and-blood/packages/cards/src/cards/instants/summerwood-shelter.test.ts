import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { briar } from "../shared/test-recipients.ts";
import { autumnSTouchBlue } from "../actions/autumn-s-touch.ts";
import { summerwoodShelterBlue } from "./summerwood-shelter.ts";

describe("Summerwood Shelter family AAA", () => {
  it("happy: the blue printing gives a defending Earth action +2 defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: briar, hand: [autumnSTouchBlue, summerwoodShelterBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Briar.defendWith(autumnSTouchBlue);
    Dash.pass();
    Briar.play(summerwoodShelterBlue, {
      targetInstanceId: Briar.cardIn("combatChain", autumnSTouchBlue).instanceId,
    });
    game.passBoth();

    expectFabCard(Briar, autumnSTouchBlue).toHaveDefense(5);
    expectFabCard(Briar, summerwoodShelterBlue).toBeIn("graveyard");
  });

  it("boundary: a defending Generic action is not a legal target", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: briar, hand: [snatchRed, summerwoodShelterBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Briar.defendWith(snatchRed);
    Dash.pass();

    expectFabUnplayable(() =>
      Briar.play(summerwoodShelterBlue, {
        targetInstanceId: Briar.cardIn("combatChain", snatchRed).instanceId,
      }),
    );
    game.passBoth();
    expectFabCard(Briar, snatchRed).toHaveDefense(2);
    expectFabCard(Briar, summerwoodShelterBlue).toBeIn("hand");
  });

  it("timing: the +2 defense lasts through the damage step", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: briar, hand: [autumnSTouchBlue, summerwoodShelterBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Briar.defendWith(autumnSTouchBlue);
    Dash.pass();
    Briar.play(summerwoodShelterBlue, {
      targetInstanceId: Briar.cardIn("combatChain", autumnSTouchBlue).instanceId,
    });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Briar).toHaveLife(20);
  });
});
