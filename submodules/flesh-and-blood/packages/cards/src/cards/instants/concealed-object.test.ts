import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { kayoUnderhandedCheat } from "../heroes/kayo-underhanded-cheat.ts";
import { concealedObjectBlue } from "./concealed-object.ts";

// Module fixed (FIX-5, plan §5): the a2 tap "Instant - {t}: Target attack gets
// +1{p}" was authored `declared: "on-stack"` with `zones: ["combat-chain"]` —
// an attack is on the stack only while unresolved (never yet on the chain)
// and on the chain only after (never on the stack), so the candidate scan was
// empty at every moment and the activation was rejected outright. Re-encoded
// as an on-stack scan over the stack itself, the tap now targets an attack
// played in response (targets declared on activation, CR 1.8.5/5.1.4) and
// boosts it +1{p} through resolution, proven end-to-end below. a1 entry (boo
// event per SUP063) and a3 end-phase self-destroy stay green.
describe("Concealed Object (SUP097) AAA", () => {
  it("happy: enters the arena as a cost-0 instant item (boo event per SUP063)", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [concealedObjectBlue, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.must.play(concealedObjectBlue);
    game.helpers.resolveUntilIdle(); // drains the boo trigger layers

    expectFabCard(Kayo, concealedObjectBlue).toBeIn("arena");
    expectFabCard(Kayo, concealedObjectBlue).toBeReady(); // untapped, unspent {t}
  });

  it("happy: tap in response to an attack - the target attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [concealedObjectBlue, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);
    const Dash = game.as(dash);

    Kayo.must.play(concealedObjectBlue);
    game.helpers.resolveUntilIdle();

    Kayo.play(snatchRed, { target: Dash.id }); // 4{p} attack, unresolved on the stack
    Kayo.activate(concealedObjectBlue); // instant-speed tap targets it (CR 1.8.5)
    expectFabCard(Kayo, concealedObjectBlue).toBeTapped(); // {t} spent

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(15); // 4 + 1 unblocked
  });

  it("happy: tap during the reaction step - the chain-link attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [concealedObjectBlue, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);
    const Dash = game.as(dash);

    Kayo.must.play(concealedObjectBlue);
    game.helpers.resolveUntilIdle();

    // The attack has left the stack: it is the active chain-link attack in
    // the reaction step. Printed "Target attack" has no zone restriction, so
    // the tap must still find it (CRU083's on-stack + combat-chain idiom).
    Kayo.play(snatchRed, { target: Dash.id });
    game.advanceCombatTo("reaction");
    Kayo.activate(concealedObjectBlue);
    expectFabCard(Kayo, concealedObjectBlue).toBeTapped();

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(15); // 4 + 1 unblocked
  });

  it("boundary: no attack to target - the activation is rejected and the {t} is kept", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [concealedObjectBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.must.play(concealedObjectBlue);
    game.helpers.resolveUntilIdle();

    // No attack is on the stack: the printed "Target attack" has no candidate,
    // so the tap activation is rejected outright and the item stays ready.
    expect(() => Kayo.activate(concealedObjectBlue)).toThrow(
      /Required activation targets are unavailable/,
    );
    expectFabCard(Kayo, concealedObjectBlue).toBeReady();
  });

  it("timing: at the beginning of your end phase it destroys itself", () => {
    const game = FabTestEngine.start(
      { hero: kayoUnderhandedCheat, hand: [concealedObjectBlue], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.must.play(concealedObjectBlue);
    game.passBoth();
    expectFabCard(Kayo, concealedObjectBlue).toBeIn("arena");

    Kayo.endTurn();
    game.helpers.untilIdle();

    expectFabCard(Kayo, concealedObjectBlue).toBeIn("graveyard");
  });
});
