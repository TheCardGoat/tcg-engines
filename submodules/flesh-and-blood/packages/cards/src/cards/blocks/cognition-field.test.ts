import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { cerebellumProcessorBlue } from "../actions/cerebellum-processor.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { cognitionFieldRed, cognitionFieldYellow, cognitionFieldBlue } from "./cognition-field.ts";

// Printed galvanize gives +2 defense; CR3.0.9 resets it in the graveyard.
for (const [color, card, baseDefense, boostedDefense, acceptedLife, declinedLife] of [
  ["Red", cognitionFieldRed, 3, 5, 20, 19],
  ["Yellow", cognitionFieldYellow, 2, 4, 20, 18],
  ["Blue", cognitionFieldBlue, 1, 3, 19, 17],
] as const) {
  describe(`Cognition Field ${color} galvanize`, () => {
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
        expectFabCard(Dash, card).toHaveDefense(mode === "accept" ? boostedDefense : baseDefense);
        if (mode !== "no-item")
          expectFabCard(Dash, cerebellumProcessorBlue).toBeIn(
            mode === "accept" ? "graveyard" : "arena",
          );
        game.closeCombat({ optionals: "throw" });
        expectFabPlayer(Dash).toHaveLife(mode === "accept" ? acceptedLife : declinedLife);
        expectFabCard(Dash, card).toBeIn("graveyard").toHaveDefense(baseDefense);
        expectCombat(game).toBeClosed();
        expectWait(game).notToHaveDecision();
      });
    }
  });
}
