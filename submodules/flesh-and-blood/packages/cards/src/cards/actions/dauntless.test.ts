import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { unmovableRed } from "../defense-reactions/unmovable.ts";
import { dauntlessRed } from "./dauntless.ts";

function openDauntlessWeaponAttack(
  defenderResources: number,
  defenderHand: readonly (typeof unmovableRed)[],
) {
  const game = FabTestEngine.start(
    {
      hero: dorinthea,
      hand: [dauntlessRed],
      weapon1: [dawnblade],
      resourcePoints: 2,
      actionPoints: 1,
      deck: 6,
    },
    {
      hero: dash,
      hand: defenderHand,
      resourcePoints: defenderResources,
      life: 20,
      deck: 6,
    },
    FAB_MANUAL_HARNESS,
  );
  const Dori = game.as(dorinthea);
  const Dash = game.as(dash);
  Dori.play(dauntlessRed);
  game.helpers.resolveUntilIdle({ optionalBoolean: false });
  Dori.activate(dawnblade);
  game.passBoth();
  game.advanceCombatTo("reaction");
  if (Dori.hasPriority()) Dori.pass();
  return { game, Dori, Dash };
}

describe("dauntless family AAA", () => {
  it("happy: the next weapon attack this turn gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [dauntlessRed],
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(dauntlessRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Dori, dauntlessRed).toBeIn("graveyard");
    expectFabPlayer(Dori).toHaveAP(1);

    Dori.activate(dawnblade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("boundary: without Dauntless, Dawnblade attacks at printed 3", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activate(dawnblade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  it("timing: the next defense reaction the defending hero plays costs an additional {r}", () => {
    const short = openDauntlessWeaponAttack(3, [unmovableRed]);
    const shortId = short.Dash.findCardInZone("hand", unmovableRed);
    expect(
      short.Dash.expectFailure({
        move: "begin-play",
        payload: { instanceId: shortId },
      }).errorCode,
    ).toBe("insufficient_resources");

    const paid = openDauntlessWeaponAttack(4, [unmovableRed]);
    paid.Dash.play(unmovableRed);
    paid.game.passBoth();
    expectFabCard(paid.Dash, unmovableRed).toBeIn("combatChain");
  });
});
