import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { stingOfSorceryBlue } from "../actions/sting-of-sorcery.ts";
import { sigilOfProtectionYellow } from "../actions/sigil-of-protection.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { might } from "../tokens/might.ts";
import { vaporizeShockYellow } from "./vaporize-shock.ts";

/**
 * Vaporize // Shock (ROS011) — Runeblade Instant // Lightning Instant.
 *
 * Printed:
 *   Vaporize: Destroy an aura permanent with cost X or less and/or up to X
 *   aura tokens, where X is the total arcane damage you've dealt to opposing
 *   heroes this turn.
 *   Shock: Deal 1 arcane damage to any target.
 */

describe("Vaporize // Shock (ROS011) AAA", () => {
  it("happy: melded Shock deals 1 arcane then Vaporize destroys a cost-0 aura", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [vaporizeShockYellow],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        life: 20,
        arena: [stingOfSorceryBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(vaporizeShockYellow, {
      playMethod: { kind: "meld" },
      targetInstanceId: Dash.ref(dash).instanceId,
    });
    game.passBoth();
    game.passBoth();
    Briar.targetRequired(stingOfSorceryBlue);
    Briar.target();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, stingOfSorceryBlue).toBeIn("graveyard");
    expectFabCard(Briar, vaporizeShockYellow).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  it("boundary: Vaporize with X=0 cannot destroy a cost-1 aura", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [vaporizeShockYellow],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        life: 20,
        arena: [sigilOfProtectionYellow],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(vaporizeShockYellow, { playMethod: { kind: "face", face: "left" } });
    game.passBoth();
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, sigilOfProtectionYellow).toBeIn("arena");
    expectFabCard(Briar, vaporizeShockYellow).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  it("timing: after Shock, Vaporize can destroy an aura token instead of a permanent", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [vaporizeShockYellow],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        life: 20,
        arena: [might],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(vaporizeShockYellow, {
      playMethod: { kind: "meld" },
      targetInstanceId: Dash.ref(dash).instanceId,
    });
    game.passBoth();
    game.passBoth();
    Briar.targetRequired(might);

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
    expectFabCard(Briar, vaporizeShockYellow).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });
});

for (const destroyToken of [true, false]) {
  it(`Vaporize destroys the aura and independently chooses token destruction: ${destroyToken}`, () => {
    const padding = () => [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue];
    const game = FabTestEngine.start(
      { hero: briar, hand: [vaporizeShockYellow], resourcePoints: 0, deck: padding() },
      { hero: dash, hand: [], life: 20, arena: [stingOfSorceryBlue, might], deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);
    Briar.play(vaporizeShockYellow, {
      playMethod: { kind: "meld" },
      targetInstanceId: Dash.ref(dash).instanceId,
    });
    game.passBoth();
    game.passBoth();
    Briar.targetRequired(stingOfSorceryBlue);
    if (destroyToken) Briar.targetRequired(might);
    else Briar.targetRequired();
    expectFabPlayer(Dash)
      .toHaveLife(19)
      .toHaveTokenCount("might", destroyToken ? 0 : 1);
    expectFabCard(Dash, stingOfSorceryBlue).toBeIn("graveyard");
    expectFabCard(Briar, vaporizeShockYellow).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });
}

it("Vaporize cannot use Shock damage dealt to its own hero", () => {
  const padding = () => [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue];
  const game = FabTestEngine.start(
    { hero: briar, hand: [vaporizeShockYellow], life: 20, resourcePoints: 0, deck: padding() },
    { hero: dash, hand: [], life: 20, arena: [might], deck: padding() },
    FAB_MANUAL_HARNESS,
  );
  const Briar = game.as(briar);
  const Dash = game.as(dash);
  Briar.play(vaporizeShockYellow, {
    playMethod: { kind: "meld" },
    targetInstanceId: Briar.ref(briar).instanceId,
  });
  game.passBoth();
  game.passBoth();
  // The zero-card selection cannot remove the token.
  expectWait(game).toHaveTargetRange(0, 0);
  Briar.targetRequired();
  expectWait(game).toBeIdle();
  expectFabPlayer(Briar).toHaveLife(19);
  expectFabPlayer(Dash).toHaveLife(20).toHaveTokenCount("might", 1);
  expectFabCard(Briar, vaporizeShockYellow).toBeIn("graveyard");
});
