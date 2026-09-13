import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dromai } from "../heroes/dromai.ts";
import { dash } from "../heroes/dash.ts";
import { ash } from "../tokens/ash.ts";
import { ouvia } from "./ouvia.ts";
import { invokeOuviaRed } from "../actions/invoke-ouvia.ts";

/**
 * Ouvia (UPR014) — "At the start of your turn or when Ouvia enters the arena,
 * transform up to 1 ash you control into an Aether Ashwing."
 *
 * Two printed triggers on one card: a1 (start-phase — the row's clause family)
 * and a2 (Ouvia entering the arena). a1 is proven in both directions plus the
 * up-to-1 boundary (transformed Ashwings seat under their token id
 * `token:aether-ashwing`). a2 is reachable only through Invoke Ouvia, which
 * FIX-5 re-encoded as a flip-layout Invocation (UPR017 golden): the resolving
 * Invoke transforms an ash into the Ouvia back face, seating the ally and
 * firing her enter-arena trigger — proven below in both directions.
 */

describe("Ouvia (UPR014) AAA", () => {
  it("happy: at the start of your turn an ash transforms into an Aether Ashwing", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: dromai, arena: [ouvia, ash], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    const Dash = game.as(dash);

    Dash.endTurn();
    Dromai.pass();
    Dash.pass();

    const transform = Dromai.expectDecision("entity-target");
    expect(transform.label).toContain("Ouvia");
    Dromai.chooseTargets(Dromai.cardIn("arena", ash));

    expect(Dromai.zone("arena")).toContain("token:aether-ashwing");
    expect(Dromai.zone("arena")).not.toContain(ash.canonicalId);
    expect(Dromai.zone("arena")).toContain(ouvia.canonicalId);
  });

  it("boundary: the start-of-turn transform moves up to 1 ash — a second ash remains", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: dromai, arena: [ouvia, ash, ash], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    const Dash = game.as(dash);

    Dash.endTurn();
    Dromai.pass();
    Dash.pass();

    const transform = Dromai.expectDecision("entity-target");
    expect(transform.candidates).toHaveLength(2);
    Dromai.chooseTargets(Dromai.cardsIn("arena", ash)[0]!);

    expect(Dromai.zone("arena")).toContain("token:aether-ashwing");
    expect(Dromai.cardsIn("arena", ash)).toHaveLength(1);
    expect(Dromai.zone("arena")).toContain(ouvia.canonicalId);
  });

  it("timing: Ouvia does not transform ash at the opponent's start of turn", () => {
    const game = FabTestEngine.start(
      { hero: dromai, arena: [ouvia, ash], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.endTurn();

    // Dash's turn has started; a1 is a start-of-CONTROLLER'S-turn trigger.
    expectFabCard(Dromai, ash).toBeIn("arena");
    expect(Dromai.zone("arena")).not.toContain("token:aether-ashwing");
  });

  it("happy: Invoke Ouvia seats the ally and her enter-arena trigger transforms another ash", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [invokeOuviaRed],
        arena: [ash, ash],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    const Dash = game.as(dash);

    // The transform target is declared while the Invocation is on the stack;
    // with two ashes the choice is named explicitly (first ash becomes Ouvia).
    const [firstAsh, secondAsh] = Dromai.cardsIn("arena", ash);
    Dromai.play(invokeOuviaRed, { targetInstanceId: firstAsh!.instanceId });

    Dromai.pass();
    Dash.pass();

    // The first ash became Ouvia — the flipped Invocation card itself is the
    // ally seated in the arena (UPR017 flip idiom).
    expect(Dromai.zone("arena")).toContain(invokeOuviaRed.canonicalId);
    expect(Dromai.cardsIn("arena", ash)).toHaveLength(1);

    // a2 fires on the ally entering the arena: up to 1 ash transforms. The
    // trigger's decision pends behind the post-resolution priority flow, so
    // advance explicitly to it.
    game.advanceToDecision(Dromai, "entity-target");
    const enterArena = Dromai.expectDecision("entity-target");
    expect(enterArena.label).toContain("Ouvia");
    Dromai.chooseTargets(secondAsh!);

    expect(Dromai.zone("arena")).toContain("token:aether-ashwing");
    expect(Dromai.cardsIn("arena", ash)).toHaveLength(0);
    // 1 - 1 (play) + 1 (go again) = 1.
    expectFabPlayer(Dromai).toHaveAP(1);
  });

  it("boundary: with no ash under your control the Invoke cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [invokeOuviaRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    expect(() => Dromai.play(invokeOuviaRed)).toThrow();
    expectFabCard(Dromai, invokeOuviaRed).toBeIn("hand");
  });
});
