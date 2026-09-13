import { describe, expect, it } from "vitest";
import { holdEmRed } from "@tcg/flesh-and-blood-cards/cards/actions/hold-em";
import { intoTheMuckRed } from "@tcg/flesh-and-blood-cards/cards/attack-reactions/into-the-muck";
import { browbeatBlue } from "@tcg/flesh-and-blood-cards/cards/actions/browbeat";
import { cintariSaber } from "@tcg/flesh-and-blood-cards/cards/weapons/cintari-saber";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { kassai } from "@tcg/flesh-and-blood-cards/cards/heroes/kassai";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { presentRuntime } from "./projection";
import { fabBoardTransfers } from "./transfers";

// Presentation contract: the authored effect is setup for the board transfer.
describe("FAB engine-backed board transfers", () => {
  it("moves an Into the Muck defender from the combat chain to the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [holdEmRed, intoTheMuckRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [browbeatBlue], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const attacker = game.as(kassai);
    const defender = game.as(dash);

    attacker.play(holdEmRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    attacker.activateAttack(cintariSaber, { stopAt: "on-attack" });
    attacker.accept();
    game.advanceUntil({ stopAt: "defend" });
    defender.defendWith(browbeatBlue);
    const defenderId = defender.findCardInZone("combatChain", browbeatBlue);
    game.toReaction("attacker");
    attacker.play(intoTheMuckRed);
    attacker.pass();
    const before = presentRuntime(game.getRuntime(), attacker.id);
    defender.pass();
    const after = presentRuntime(game.getRuntime(), attacker.id);

    const plan = fabBoardTransfers(before, after, "resolve-into-the-muck", attacker.id);

    expect(plan?.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "entityTransfer",
          entity: { kind: "entity", id: defenderId },
          from: { kind: "zone", id: `${defender.id}:combat-chain`, ownerId: defender.id },
          to: { kind: "zone", id: `${defender.id}:banished`, ownerId: defender.id },
          sourceFace: "public",
          destinationFace: "public",
        }),
      ]),
    );
  });
});
