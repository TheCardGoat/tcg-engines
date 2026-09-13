import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { projectFabViewerState } from "@tcg/flesh-and-blood-engine/runtime";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { talisharTheLostPrince } from "./talishar-the-lost-prince.ts";

describe("Talishar, the Lost Prince (CRU177) AAA", () => {
  it("projects each reversible pitch while an activation payment is still open", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [talisharTheLostPrince],
        hand: [sinkBelowRed, sinkBelowRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const pitched = Bravo.cardsIn("hand", sinkBelowRed)[0]!;

    Bravo.activate(talisharTheLostPrince);
    Bravo.pitchFirst();

    expect(game.getState().decision).toMatchObject({ kind: "payment", amount: 1 });
    const view = projectFabViewerState(game.getState(), {
      role: "player",
      actorId: Bravo.id,
    });
    expect(view.players[Bravo.id]!.zones.pitch).toContain(pitched.instanceId);
    expect(view.players[Bravo.id]!.zones.hand).not.toContain(pitched.instanceId);
    expect(view.players[Bravo.id]!.resourcePoints).toBe(1);
  });

  it("happy: paying 2{r} attacks for 4 and puts a rust counter on this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [talisharTheLostPrince],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(talisharTheLostPrince);

    expectCombat(game).toBeOpen().toHaveAttackPower(4);
    expectFabCard(Bravo, talisharTheLostPrince).toHaveCounters(1, "rust");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: the attack is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [talisharTheLostPrince],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(talisharTheLostPrince);
    game.helpers.resolveRestOfCombat();
    Bravo.expectActivationRejected(talisharTheLostPrince);
    expectFabCard(Bravo, talisharTheLostPrince).toHaveCounters(1, "rust");
  });

  it("timing: 3 rust counters destroy this at the beginning of your end phase", () => {
    const three = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [{ card: talisharTheLostPrince, state: { namedCounters: { rust: 3 } } }],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    three.as(bravo).endTurn();
    three.helpers.resolveUntilIdle();
    expectFabCard(three.as(bravo), talisharTheLostPrince).toBeIn("graveyard");

    const two = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [{ card: talisharTheLostPrince, state: { namedCounters: { rust: 2 } } }],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    two.as(bravo).endTurn();
    two.helpers.resolveUntilIdle();
    expectFabCard(two.as(bravo), talisharTheLostPrince).toBeIn("weapon1");
    expectFabCard(two.as(bravo), talisharTheLostPrince).toHaveCounters(2, "rust");
  });
});
