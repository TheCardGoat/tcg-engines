import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { boneMassRed } from "./bone-mass.ts";
import { restlessClericRed } from "./restless-cleric.ts";
import { snatchRed } from "./snatch.ts";

describe("Bone Mass AAA", () => {
  it("happy: discarding a zombie gives the next attack +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [boneMassRed, restlessClericRed, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(malice);

    player.play(boneMassRed);
    game.advanceUntil({
      stopAt: "defend",
      optionals: "accept",
      entityTargets: "maximum",
    });
    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(player, restlessClericRed).toBeIn("graveyard");
    game.closeCombat();
    expectFabPlayer(player).toHaveAP(1);

    player.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: declining the discard leaves the next attack at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [boneMassRed, restlessClericRed, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(malice);

    player.play(boneMassRed);
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    expectFabCard(player, restlessClericRed).toBeIn("hand");
    game.closeCombat();
    expectFabPlayer(player).toHaveAP(1);

    player.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
