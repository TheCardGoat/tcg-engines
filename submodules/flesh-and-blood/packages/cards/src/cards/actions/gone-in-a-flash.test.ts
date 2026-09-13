import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blinkBlue } from "../instants/blink.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { goneInAFlashRed } from "./gone-in-a-flash.ts";

describe("Gone in a Flash (ROS076) AAA", () => {
  it("happy: the next instant this chain link may return this to its owner's hand", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [goneInAFlashRed, blinkBlue], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(goneInAFlashRed);
    game.advanceCombatTo("reaction");
    Oscilio.must.playInstant(blinkBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Oscilio, goneInAFlashRed).toBeIn("hand");
    expect(game.combat()).toBeNull();
  });

  it("boundary: without an instant this chain link, this stays on the chain and hits", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [goneInAFlashRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(goneInAFlashRed);
    expect(
      game
        .getView({ role: "player", actorId: Oscilio.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabCard(Oscilio, goneInAFlashRed).toBeIn("graveyard");
    expect(
      game
        .getView({ role: "player", actorId: Oscilio.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(false);
  });

  it("boundary: declining the return leaves this on the chain to hit", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [goneInAFlashRed, blinkBlue], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(goneInAFlashRed);
    game.advanceCombatTo("reaction");
    Oscilio.must.playInstant(blinkBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Oscilio, goneInAFlashRed).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: an opponent's instant neither triggers nor consumes the delayed effect", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [goneInAFlashRed, blinkBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [blinkBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.attackWith(goneInAFlashRed);
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Dash);
    Dash.must.playInstant(blinkBlue);
    game.passBoth();

    expectFabCard(Oscilio, goneInAFlashRed).toBeIn("combatChain");
    expect(
      game
        .getView({ role: "player", actorId: Oscilio.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(true);

    game.helpers.passPriorityTo(Oscilio);
    Oscilio.must.playInstant(blinkBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Oscilio, goneInAFlashRed).toBeIn("hand");
    expect(
      game
        .getView({ role: "player", actorId: Oscilio.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(false);
  });
});
