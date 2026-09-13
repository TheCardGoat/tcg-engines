import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { frailty } from "../tokens/frailty.ts";
import { inertia } from "../tokens/inertia.ts";
import { infectiousHostRed } from "./infectious-host.ts";

describe("Infectious Host (OUT192) AAA", () => {
  it("happy: controlling Frailty creates a Frailty under the attacked hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [infectiousHostRed],
        arena: [frailty],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(infectiousHostRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });

    expect(Bravo.zone("arena")).toContain("token:frailty");
    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("boundary: without a matching token it creates nothing", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [infectiousHostRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(infectiousHostRed);
    game.closeCombat({ optionals: "decline" });

    expect(Bravo.zone("arena")).not.toContain("token:frailty");
    expect(Bravo.zone("arena")).not.toContain("token:inertia");
    expect(Bravo.zone("arena")).not.toContain("token:bloodrot-pox");
  });

  it("timing: controlling Inertia repeats the create under the attacked hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [infectiousHostRed],
        arena: [inertia],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(infectiousHostRed);
    game.closeCombat({ optionals: "decline" });

    expect(Bravo.zone("arena")).toContain("token:inertia");
    expect(Bravo.zone("arena")).not.toContain("token:frailty");
  });
});
