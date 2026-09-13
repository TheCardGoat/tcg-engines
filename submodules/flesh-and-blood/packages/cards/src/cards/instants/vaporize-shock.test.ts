import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { stingOfSorceryBlue } from "../actions/sting-of-sorcery.ts";
import { sigilOfProtectionYellow } from "../actions/sigil-of-protection.ts";
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
      { hero: briar, hand: [vaporizeShockYellow], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arena: [stingOfSorceryBlue], deck: 6 },
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
    Briar.target(stingOfSorceryBlue);
    Briar.target();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, stingOfSorceryBlue).toBeIn("graveyard");
    expectFabCard(Briar, vaporizeShockYellow).toBeIn("graveyard");
  });

  it("boundary: Vaporize with X=0 cannot destroy a cost-1 aura", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [vaporizeShockYellow], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arena: [sigilOfProtectionYellow], deck: 6 },
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
  });

  it("timing: after Shock, Vaporize can destroy an aura token instead of a permanent", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [vaporizeShockYellow], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arena: [might], deck: 6 },
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
    Briar.target();
    Briar.target(might);

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
    expectFabCard(Briar, vaporizeShockYellow).toBeIn("graveyard");
  });
});
