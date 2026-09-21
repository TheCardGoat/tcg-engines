import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sinspeakerGloombladeRed } from "../actions/sinspeaker-gloomblade.ts";
import { runechantOfWrathYellow as runechantOfWrath } from "./runechant-of-wrath.ts";

// Own-aura behavior follows the captured IAR157 text. The opponent-aura
// scenario preserves existing behavior; its usurp payment eligibility still
// needs an independently captured official ruling before card acceptance.
describe("Runechant of Wrath overpower and object reset", () => {
  it.each(["own", "opponent"] as const)(
    "%s aura: overpower rejects two action defenders and resets after combat",
    (owner) => {
      const game = FabTestEngine.start(
        {
          hero: chane,
          hand: [sinspeakerGloombladeRed],
          arena: owner === "own" ? [runechantOfWrath] : [],
          deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        {
          hero: dash,
          life: 20,
          hand: [snatchRed, nimblismBlue],
          arena: owner === "opponent" ? [runechantOfWrath] : [],
          deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        FAB_MANUAL_HARNESS,
      );
      const Chane = game.as(chane);
      const Dash = game.as(dash);
      Chane.playAttack(sinspeakerGloombladeRed);
      expectCombat(game).toHaveAttackPower(4);
      expectFabCard(owner === "own" ? Chane : Dash, runechantOfWrath).toBeIn("graveyard");

      expect(Dash.expectBlockRejected([snatchRed, nimblismBlue]).errorCode).toBe("overpower");
      expectFabCard(Dash, snatchRed).toBeIn("hand");
      expectFabCard(Dash, Dash.cardIn("hand", nimblismBlue)).toBeIn("hand");
      Dash.defendWith(snatchRed);
      game.closeCombat({ optionals: "throw", ordering: "listed" });
      expectFabPlayer(Dash).toHaveLife(18);
      expectFabCard(Chane, sinspeakerGloombladeRed)
        .toBeIn("graveyard")
        .notToHaveKeyword("overpower");
      expectCombat(game).toBeClosed();
    },
  );

  it("without an aura: two action defenders are legal and the attack has only printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [sinspeakerGloombladeRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        life: 20,
        hand: [snatchRed, nimblismBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);
    Chane.playAttack(sinspeakerGloombladeRed);
    expectCombat(game).toHaveAttackPower(2).notToHaveKeyword("overpower");
    Dash.defendWith(snatchRed, nimblismBlue);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Chane, sinspeakerGloombladeRed).toBeIn("graveyard").notToHaveKeyword("overpower");
    expectCombat(game).toBeClosed();
  });
});
