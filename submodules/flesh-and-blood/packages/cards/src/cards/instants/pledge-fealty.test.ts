import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dromai } from "../heroes/dromai.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { pledgeFealtyRed } from "./pledge-fealty.ts";

/**
 * Pledge Fealty (Red) (FNG020) — Draconic Instant.
 *
 * Printed: "Create a Fealty token."
 *
 * Mode B (fab-rules): CR 1.10/2.4 (an Instant may be played any time its
 * controller has priority and does not consume an action point), CR 8.6.x
 * glossary (Fealty — a Draconic token aura with an instant destroy-ability
 * and an end-phase trigger; modeled as catalog token CIN028). Behavior
 * constraints: playing Pledge Fealty creates exactly one Fealty token under
 * the caster's control; the token is a token-aura object (token:fealty), not
 * a catalog card; instants resolve at instant speed even mid-combat and
 * provide no block value.
 */

describe("Pledge Fealty (Red) (FNG020) AAA", () => {
  it("happy: casting the instant creates one Fealty token and spends no action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [pledgeFealtyRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(pledgeFealtyRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 1);
    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 1); // token-aura identity
    // Instants never consume action points.
    expectFabPlayer(Dromai).toHaveAP(1);
    expectFabCard(Dromai, pledgeFealtyRed).toBeIn("graveyard");
  });

  it("boundary: a second Pledge Fealty the same turn stacks a second Fealty token", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [pledgeFealtyRed, pledgeFealtyRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(pledgeFealtyRed);
    game.helpers.resolveUntilIdle();
    Dromai.play(pledgeFealtyRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 2);
    expectFabPlayer(Dromai).toHaveAP(1); // still free
  });

  it("timing: cast in the reaction window the token appears at instant speed and blocks nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dromai,
        life: 20,
        hand: [pledgeFealtyRed],
        deck: 6,
      },
    );
    const Dash = game.as(dash);
    const Dromai = game.as(dromai);

    // AHA015 idiom: reach the reaction window, hand priority to the
    // defender, and cast the instant there (instants are playable in the
    // reaction window — CR 1.10/7.4).
    Dash.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    Dash.pass();

    Dromai.play(pledgeFealtyRed);
    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 1);

    game.passBoth();
    game.helpers.resolveRestOfCombat();

    // An instant is not a block — the attack still lands in full, and the
    // Fealty survives the closed link.
    expectFabPlayer(Dromai).toHaveLife(16);
    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 1);
  });
});
