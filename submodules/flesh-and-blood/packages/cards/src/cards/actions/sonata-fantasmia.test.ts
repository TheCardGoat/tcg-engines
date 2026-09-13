import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { sonataFantasmiaBlue } from "./sonata-fantasmia.ts";

/**
 * Sonata Fantasmia (Blue) (EVO242) — Viserai Specialization, Runeblade Action.
 *
 * Printed: "Create X Runechant tokens. If X is 6 or greater, target hero
 * discards 3 random cards."
 *
 * Mode B (fab-rules): CR 5.1.3a (the variable cost X is declared when playing
 * the card; card-text references to X read that declared value), CR 1.12.2
 * (declaration process), CR 8.6.3 (Runechant token), CR 4.2.2b/9.1.2 (a
 * random discard from hand). Behavior constraints: exactly X Runechants are
 * created under Viserai's control when the action resolves; the discard
 * clause is a separate resolution ability gated on the SAME declared X — it
 * fires only at X ≥ 6, is aimed at a chosen hero, and discards 3 cards at
 * random from that hero's hand; X binds per play.
 *
 * PINNED MISBEHAVIOR (plan §5, EVO242 row, W3-I): at X ≥ 6 the "discards 3
 * random cards" clause only moves 2 of the 3 picked cards. The sampler
 * (rules/proposals/shared.ts objectTargets random path) picks 3 distinct
 * instances without replacement, but only two discard movements take effect
 * on an all-same-name hand — observed deterministically with the engine's
 * seeded RNG (hand 3 → 1, graveyard +2). Printed rules require the full 3.
 * The Runechant creation, X binding, and threshold gate are all correct and
 * asserted green below; flip the discard counts when the movement loss is
 * fixed.
 *
 * PINNED COST MODEL (plan §5, EVO242 cost row): the printed cost is XX —
 * "The cost to play this is twice the value of X (e.g. X+X)" (Bright Lights
 * — Round the Table release note). The module carries no `cost` field and
 * the engine charges 1×X, so the X=6 declaration below is payable with 6
 * resources where printed rules require 12. The 1×X charge is pinned as the
 * current engine behavior; flip both assertions (declaration rejected at
 * 6 RP; payable at 12) when multi-X costs are modeled (CR 5.1.3a).
 */

describe("Sonata Fantasmia (Blue) (EVO242) AAA", () => {
  it("PINNED (§5 EVO242): X=6 creates 6 Runechants but the 3-random discard only moves 2 cards", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sonataFantasmiaBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(sonataFantasmiaBlue, { xValue: 6, target: Dash.id });
    game.helpers.resolveUntilIdle();

    // Correct and green: X Runechants, card resolved. PINNED COST MODEL
    // (§5): the engine charges 1×X (6) — printed cost XX requires 12 — so
    // this X=6 declaration is payable with 6 resources only under the
    // current cost model.
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 6);
    expectFabPlayer(Viserai).toHaveResourceCount(0); // PINNED (§5 cost): printed would reject at 6 RP
    expectFabCard(Viserai, sonataFantasmiaBlue).toBeIn("graveyard");
    // PINNED: printed rules empty an exactly-3-card hand (3 discards). The
    // engine moves only 2 of the 3 sampled cards — one pick is lost.
    expectFabPlayer(Dash).toHaveHandCount(1); // PINNED: should be 0
    expect(
      Dash.zone("graveyard").filter((id) => id === brutalAssaultBlue.canonicalId),
    ).toHaveLength(2); // PINNED: should be 3
  });

  it("boundary: X=5 (just under the threshold) creates 5 Runechants and discards nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sonataFantasmiaBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(sonataFantasmiaBlue, { xValue: 5, target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 5);
    expectFabPlayer(Dash).toHaveHandCount(3); // X < 6: the discard never fires
    expectFabCard(Viserai, sonataFantasmiaBlue).toBeIn("graveyard");
  });

  it("timing: two Sonatas in one turn each bind their own X and stack Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sonataFantasmiaBlue, sonataFantasmiaBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(sonataFantasmiaBlue, { xValue: 1, target: Dash.id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);

    // The second play declares an independent X=2 — still far under 6. This
    // is the SECOND Runeblade card played this turn and a non-attack action
    // was played before it, so Viserai's printed hero passive adds 1 extra
    // Runechant (ARC076-a1): 1 + (2 + 1) = 4.
    Viserai.play(sonataFantasmiaBlue, { xValue: 2, target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 4);
    expectFabPlayer(Viserai).toHaveResourceCount(0);
    expectFabPlayer(Dash).toHaveHandCount(3);
  });
});
