import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { dash } from "../heroes/dash.ts";
import { starlightStriders } from "./starlight-striders.ts";
import { snatchRed } from "../actions/snatch.ts";
import { auricShardsBlue } from "../instants/auric-shards.ts";

/**
 * Starlight Striders (AST006) — Lightning Runeblade Equipment - Legs.
 *
 * Printed: "When this defends, you may reveal an instant card from your hand.
 * If you do, create an Embodiment of Lightning token. Blade Break"
 *
 * Distinct clause vs. its cycle: the Striders pay for their token with a
 * revealed Instant on defense (Veil holos auras, Touch untaps Aphrodias).
 */
describe("Starlight Striders (AST006) AAA", () => {
  it("happy: defending with the striders and revealing an instant mints an Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: zyggyStarlight,
        legs: [starlightStriders],
        hand: [auricShardsBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Zyggy.defendWith(starlightStriders);
    // Reveal an instant from hand.
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(Zyggy).toHaveTokenCount("embodiment-of-lightning", 1);
    // Blade Break: the striders are destroyed after defending.
    expectFabCard(Zyggy, starlightStriders).toBeIn("graveyard");
    // 4{p} snatch minus the striders' 1{d} leaves 3 damage.
    expectFabPlayer(Zyggy).toHaveLife(17);
  });

  it("boundary: declining the reveal creates no token — and Blade Break still claims the legs", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: zyggyStarlight,
        legs: [starlightStriders],
        hand: [auricShardsBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Zyggy.defendWith(starlightStriders);
    // Decline the reveal.
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Zyggy).toHaveTokenCount("embodiment-of-lightning", 0);
    expectFabCard(Zyggy, starlightStriders).toBeIn("graveyard");
    expectFabPlayer(Zyggy).toHaveLife(17);
  });
});
