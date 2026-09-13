import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { channelMountIsenBlue } from "./channel-mount-isen.ts";
import { drowningDireRed } from "./drowning-dire.ts";
import { snatchRed } from "./snatch.ts";
import { fearlessConfrontationBlue } from "./fearless-confrontation.ts";

describe("Fearless Confrontation (MPG128) AAA", () => {
  it("happy: discard this as an instant to give the attack -1 and strip dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [channelMountIsenBlue, drowningDireRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [fearlessConfrontationBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(channelMountIsenBlue);
    game.helpers.resolveUntilIdle();
    Briar.play(drowningDireRed);
    game.passBoth();
    expect(game.combat()?.activeLink?.keywords).toContain("dominate");
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.helpers.passPriorityTo(Dash);
    Dash.activate(fearlessConfrontationBlue);
    game.passBoth();

    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("dominate");
    expectFabCard(Dash, fearlessConfrontationBlue).toBeIn("graveyard");
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: cannot activate the instant with no attack on the chain", () => {
    const game = FabTestEngine.start(
      { hero: briar, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [fearlessConfrontationBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).activate(fearlessConfrontationBlue)).toThrow();
    expectFabCard(game.as(dash), fearlessConfrontationBlue).toBeIn("hand");
  });

  it("timing: a non-dominate attack still loses 1 power", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [fearlessConfrontationBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(snatchRed);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.passPriorityTo(Dash);
    Dash.activate(fearlessConfrontationBlue);
    game.passBoth();

    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("dominate");
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(17);
  });
});
