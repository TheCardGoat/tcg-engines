import { describe, expect, it } from "vitest";
import { expectFabCard, expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { regurgitatingSlogRed } from "./regurgitating-slog.ts";
import { rawhideRumbleRed } from "./rawhide-rumble.ts";

describe("Rawhide Rumble (HVY023) AAA", () => {
  it("happy: after beating chest this turn, attacking a hero intimidates them", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rawhideRumbleRed, regurgitatingSlogRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const slogId = Bravo.findCardInZone("hand", regurgitatingSlogRed);

    Bravo.playAttack(rawhideRumbleRed, {
      beatChest: true,
      beatChestInstanceId: slogId,
    });

    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("banished");
    expectFabCard(Dash, brutalAssaultBlue).toBeFaceDown();
  });

  it("boundary: without beating chest this turn, attacking does not intimidate", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [rawhideRumbleRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );

    game.as(bravo).playAttack(rawhideRumbleRed);

    expectFabPlayer(game.as(dash)).toHaveHandCount(1);
    expect(game.as(dash).zone("banished")).toHaveLength(0);
  });

  it("timing: the intimidated card returns to hand at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rawhideRumbleRed, regurgitatingSlogRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const slogId = Bravo.findCardInZone("hand", regurgitatingSlogRed);

    Bravo.playAttack(rawhideRumbleRed, {
      beatChest: true,
      beatChestInstanceId: slogId,
    });
    game.closeCombat({ optionals: "decline" });
    Bravo.endTurn();
    game.untilIdle({ optionals: "decline" });

    expect(Dash.zone("banished")).toHaveLength(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("hand");
  });
});
