import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { markOfTheBeastYellow } from "./mark-of-the-beast.ts";
import { embalmYellow } from "./embalm.ts";

/**
 * Embalm Yellow (PEN193) — Shadow Action. Blood Debt.
 *
 * Printed: You may play this from your banished zone. If you do, it gets
 * go again.
 * Put an attack action card with blood debt from your graveyard on the
 * bottom of your deck.
 */

describe("Embalm (PEN193) AAA", () => {
  it("happy: from banishment it gains go again and bottoms a blood-debt attack", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        banished: [embalmYellow],
        graveyard: [markOfTheBeastYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(embalmYellow, { from: "banished" });
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: markOfTheBeastYellow.canonicalId,
    });

    // From-banished play grants go again: the action point is refunded.
    expectFabPlayer(Chane).toHaveAP(1);
    expect(Chane.zone("deck")[0]).toBe(markOfTheBeastYellow.canonicalId); // bottomed
    expectFabCard(Chane, embalmYellow).toBeIn("graveyard");
  });

  it("pin: the go-again grant also applies from hand (§5 engine/from-banished-go-again-ungated)", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [embalmYellow],
        graveyard: [markOfTheBeastYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(embalmYellow);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: markOfTheBeastYellow.canonicalId,
    });

    // PIN: printed go again only rides the from-banished play — the
    // refund also happens from hand (grant ungated).
    expectFabPlayer(Chane).toHaveAP(1); // refunded — should not be
    expect(Chane.zone("deck")[0]).toBe(markOfTheBeastYellow.canonicalId);
  });
});
