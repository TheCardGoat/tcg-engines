import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultYellow } from "../actions/brutal-assault.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { crowdControlRed, crowdControlYellow, crowdControlBlue } from "./crowd-control.ts";

for (const [color, card, baseDefense, paidDefense, paidLife, unpaidLife] of [
  ["Red", crowdControlRed, 4, 5, 20, 19],
  ["Yellow", crowdControlYellow, 3, 4, 19, 18],
  ["Blue", crowdControlBlue, 2, 3, 18, 17],
] as const) {
  describe(`Crowd Control ${color} one opposing hero`, () => {
    for (const mode of ["accept", "decline", "unaffordable"] as const) {
      it(`${mode}: payment changes combat defense only for this object`, () => {
        const game = FabTestEngine.start(
          {
            hero: dash,
            hand: [brutalAssaultYellow],
            resourcePoints: 2,
            deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
          },
          {
            hero: bravo,
            life: 20,
            hand: [card],
            resourcePoints: mode === "unaffordable" ? 2 : 3,
            deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
          },
          FAB_MANUAL_HARNESS,
        );
        const Bravo = game.as(bravo);
        game.as(dash).playAttack(brutalAssaultYellow);
        Bravo.defendWith(card);
        if (mode !== "unaffordable") {
          game.advanceToDecision(Bravo, "boolean");
          if (mode === "accept") Bravo.accept();
          else Bravo.decline();
        }
        game.advanceUntil({ stopAt: "reaction", optionals: "throw" });
        expectFabCard(Bravo, card).toHaveDefense(mode === "accept" ? paidDefense : baseDefense);
        expectFabPlayer(Bravo).toHaveResourceCount(
          mode === "accept" ? 0 : mode === "decline" ? 3 : 2,
        );
        game.closeCombat({ optionals: "throw" });
        expectFabPlayer(Bravo).toHaveLife(mode === "accept" ? paidLife : unpaidLife);
        expectFabCard(Bravo, card).toBeIn("graveyard").toHaveDefense(baseDefense);
        expectCombat(game).toBeClosed();
        expectWait(game).notToHaveDecision();
      });
    }
  });
}
