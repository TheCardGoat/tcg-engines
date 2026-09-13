import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { hamstringShotRed } from "./hamstring-shot.ts";

describe("Hamstring Shot (ARC060) AAA", () => {
  it("happy: a hit makes the defending hero's first next-turn attack cost an extra {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: hamstringShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(hamstringShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(15);

    Azalea.endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabUnplayable(() => Dash.playAttack(snatchRed));
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });

  it("boundary: a miss does not tax the defending hero's next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: hamstringShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
        life: 20,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(hamstringShotRed, { from: "arsenal" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(20);

    Azalea.endTurn();
    game.untilIdle({ optionals: "decline" });

    Dash.playAttack(snatchRed);
    expectCombat(game).toBeOpen().toHaveAttackPower(4);
  });

  it("timing: paying 1{r} plays the taxed first attack", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: hamstringShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, resourcePoints: 0, deck: 6 },
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(hamstringShotRed, { from: "arsenal" });
    game.closeCombat({ optionals: "decline" });
    Azalea.endTurn();
    game.untilIdle({ optionals: "decline" });

    Dash.playAttack(snatchRed);
    expectCombat(game).toBeOpen().toHaveAttackPower(4);
  });

  it("regression: defending with Hamstring Shot does not tax the defender's next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        hand: [hamstringShotRed, snatchRed],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    Dash.playAttack(snatchRed);
    Azalea.defendWith(hamstringShotRed);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Azalea).toHaveLife(19);

    Dash.endTurn();
    game.untilIdle({ optionals: "decline" });

    Azalea.playAttack(snatchRed);
    expectCombat(game).toBeOpen().toHaveAttackPower(4);
  });
});
