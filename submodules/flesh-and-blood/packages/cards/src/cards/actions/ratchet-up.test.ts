import { brutalAssaultBlue } from "./brutal-assault.ts";
import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { cerebellumProcessorBlue } from "./cerebellum-processor.ts";
import { nimblismBlue } from "./nimblism.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { ratchetUpRed, ratchetUpYellow, ratchetUpBlue } from "./ratchet-up.ts";

// Printed galvanize gives +2 defense; CR3.0.9 resets it in the graveyard.
for (const [color, card] of [
  ["Red", ratchetUpRed],
  ["Yellow", ratchetUpYellow],
  ["Blue", ratchetUpBlue],
] as const) {
  describe(`Ratchet Up ${color} galvanize`, () => {
    for (const mode of ["accept", "decline", "no-item"] as const) {
      it(`${mode}: exact defense during combat and reset after combat`, () => {
        const game = FabTestEngine.start(
          {
            hero: bravo,
            hand: [snatchRed],
            deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
          },
          {
            hero: dash,
            life: 20,
            hand: [card],
            arena: mode === "no-item" ? [] : [cerebellumProcessorBlue],
            deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
          },
          FAB_MANUAL_HARNESS,
        );
        const Dash = game.as(dash);
        game.as(bravo).playAttack(snatchRed);
        Dash.defendWith(card);
        if (mode !== "no-item") {
          game.advanceToDecision(Dash, "boolean");
          if (mode === "accept") Dash.accept();
          else Dash.decline();
        }
        game.advanceUntil({ stopAt: "reaction", optionals: "throw" });
        expectFabCard(Dash, card).toHaveDefense(mode === "accept" ? 4 : 2);
        if (mode !== "no-item")
          expectFabCard(Dash, cerebellumProcessorBlue).toBeIn(
            mode === "accept" ? "graveyard" : "arena",
          );
        game.closeCombat({ optionals: "throw" });
        expectFabPlayer(Dash).toHaveLife(mode === "accept" ? 20 : 18);
        expectFabCard(Dash, card).toBeIn("graveyard").toHaveDefense(2);
        expectCombat(game).toBeClosed();
        expectWait(game).notToHaveDecision();
      });
    }
  });
}

describe("Ratchet Up no destroyed-item history", () => {
  it("timing: without a destroyed item this turn the attack is printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ratchetUpRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 1,
      },
      {
        hero: bravo,
        life: 20,
        hand: [brutalAssaultBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).playAttack(ratchetUpRed, { stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.as(bravo).defendWith(brutalAssaultBlue);
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });
    expectFabCard(game.as(bravo), brutalAssaultBlue).toHaveDefense(3);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(game.as(bravo)).toHaveLife(18);
    expectCombat(game).toBeClosed();
  });
});
