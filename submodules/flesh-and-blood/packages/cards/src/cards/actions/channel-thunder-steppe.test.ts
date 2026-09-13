import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { snatchRed } from "./snatch.ts";
import { channelThunderSteppeYellow } from "./channel-thunder-steppe.ts";

/**
 * Channel Thunder Steppe Yellow (ELE175) — Lightning Action Aura. Go again.
 *
 * Printed: Whenever you play an action card, you may pay {r}. If you do,
 * it gains go again.
 */

describe("Channel Thunder Steppe (ELE175) AAA", () => {
  it("pin: the channel go-again grant never lands (§5 engine/channel-ga-grant-inert)", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [channelThunderSteppeYellow, snatchRed],
        resourcePoints: 3, // 1 aura + 1 channel pay + spare
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    game.as(dash);

    Briar.play(channelThunderSteppeYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
    game.helpers.untilIdle({ ordering: "listed" });
    expectFabCard(Briar, channelThunderSteppeYellow).toBeIn("arena");

    // PIN: paying {r} on the played action never grants the go-again —
    // the channel pay ask answers but the refund never lands.
    Briar.play(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, ordering: "listed" }); // pay {r}
    expectFabPlayer(Briar).toHaveAP(0); // grant inert
  });

  it("boundary: declining leaves the action without go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [channelThunderSteppeYellow, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(channelThunderSteppeYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Briar.play(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
    expectFabPlayer(Briar).toHaveAP(0); // no go again
  });
});
