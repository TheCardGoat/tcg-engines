import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { torcOfVim } from "./torc-of-vim.ts";
import { bonebreakerBellowRed } from "../actions/bonebreaker-bellow.ts";
import { beastModeRed } from "../actions/beast-mode.ts";
import { packHuntYellow } from "../actions/pack-hunt.ts";
import { breakneckBatteryYellow } from "../actions/breakneck-battery.ts";
import { nimblismBlue } from "../actions/nimblism.ts";

/**
 * Torc of Vim (ARR004) — Brute Equipment - Chest, Battleworn.
 *
 * Printed: "Whenever you beat chest, you may destroy this. If you do, the
 * next Brute attack action card you play this turn costs {r}{r} less."
 */
describe("Torc of Vim (ARR004) AAA", () => {
  it("happy: beating chest destroys the torc and the next Brute attack is 2 cheaper", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        chest: [torcOfVim],
        hand: [bonebreakerBellowRed, beastModeRed, packHuntYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    // Beat chest (discard the 6{p} Beast Mode) as Bonebreaker's cost.
    Rhinar.play(bonebreakerBellowRed, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expectFabCard(Rhinar, torcOfVim).toBeIn("graveyard");

    // Pack Hunt costs 2 and the torc discount is 2 — nothing is spent.
    Rhinar.must.playAttack(packHuntYellow);
    game.advanceCombatTo("defend");
    // Bonebreaker +5 (beaten chest) on top of Pack Hunt's printed 5{p}.
    expectCombat(game).toHaveAttackPower(10);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveResourceCount(2);
  });

  it("boundary: declining the destroy keeps the torc and the discount", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        chest: [torcOfVim],
        hand: [bonebreakerBellowRed, beastModeRed, packHuntYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.play(bonebreakerBellowRed, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Rhinar, torcOfVim).toBeIn("chest");

    // Pack Hunt now costs its full {r}{r}.
    Rhinar.must.playAttack(packHuntYellow);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveResourceCount(0);
  });

  it("timing: the discount is spent by the next Brute attack — a second one pays full price", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        chest: [torcOfVim],
        hand: [
          bonebreakerBellowRed,
          beastModeRed,
          packHuntYellow,
          breakneckBatteryYellow,
          nimblismBlue,
        ],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.play(bonebreakerBellowRed, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Pack Hunt consumes the discount (costs 0).
    Rhinar.must.playAttack(packHuntYellow);
    game.helpers.resolveRestOfCombat();

    // Breakneck Battery pays its full {r}{r}.
    Rhinar.must.playAttack(breakneckBatteryYellow);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveResourceCount(0);
  });
});
