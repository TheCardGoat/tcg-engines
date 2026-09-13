import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { briar } from "../heroes/briar.ts";
import { scepterOfPain } from "./scepter-of-pain.ts";

/**
 * Scepter of Pain (DTD210) — printed:
 * "Once per Turn Action - {r}{r}: Deal 1 arcane damage to any opposing target.
 * Create a Runechant token for each damage dealt this way."
 *
 * Mode B (fab-rules): CR 1.13.1 the Action activated ability costs one action
 * point; CR 5.2 the {r}{r} resource cost is paid at activation; "Once per
 * Turn" (CR glossary) allows a single use per turn even with resources and
 * action points to spare, and the window resets at the start of each turn;
 * the arcane damage may target any opposing hero or permanent, and each point
 * of damage dealt this way creates one Runechant token.
 */
describe("Scepter of Pain (DTD210) AAA", () => {
  it("happy: pay {r}{r} and an action point to deal 1 arcane to the opposing hero and mint one Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [scepterOfPain],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.activate(scepterOfPain);
    game.passBoth();

    expect(Dash.life()).toBe(19);
    expect(Briar.zone("arena").filter((id) => id === "token:runechant")).toHaveLength(1);
    expectFabPlayer(Briar).toHaveResourceCount(0);
    expectFabPlayer(Briar).toHaveAP(0);
  });

  it("boundary: once-per-turn blocks a second activation even with {r}{r} and an action point left", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [scepterOfPain],
        hand: [],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.activate(scepterOfPain);
    game.passBoth();
    expect(Dash.life()).toBe(19);

    // 2{r} and 1 action point remain, but the once-per-turn limit refuses.
    Briar.expectActivationRejected(scepterOfPain);
    expect(Dash.life()).toBe(19);
    expect(Briar.zone("arena").filter((id) => id === "token:runechant")).toHaveLength(1);
    expectFabPlayer(Briar).toHaveResourceCount(2);
  });

  it("timing: the once-per-turn window resets on the next turn's activation", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [scepterOfPain],
        hand: [heartOfFyendalBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.activate(scepterOfPain);
    game.passBoth();
    expect(Dash.life()).toBe(19);
    expect(Briar.zone("arena").filter((id) => id === "token:runechant")).toHaveLength(1);

    // Turn passes; the limit resets and the turn-start action point returns.
    game.helpers.passPriorityTo(Briar);
    Briar.endTurn();
    game.as(dash).endTurn();

    // No banked resources this turn: the blue pitch funds the {r}{r} cost.
    Briar.activate(scepterOfPain);
    game.helpers.resolveUntilIdle({ paymentCanonicalId: heartOfFyendalBlue.canonicalId });

    expectFabCard(Briar, heartOfFyendalBlue).toBeIn("pitch");
    expect(Dash.life()).toBe(18);
    expect(Briar.zone("arena").filter((id) => id === "token:runechant")).toHaveLength(2);
    expectFabPlayer(Briar).toHaveAP(0);
  });
});
