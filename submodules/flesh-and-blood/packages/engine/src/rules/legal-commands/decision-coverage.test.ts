import { describe, expect, it } from "vite-plus/test";
import { zapRed } from "../../../../cards/src/cards/actions/zap.ts";
import { blazeFiremind } from "../../../../cards/src/cards/heroes/blaze-firemind.ts";
import { rhinarRecklessRampage } from "../../../../cards/src/cards/heroes/rhinar-reckless-rampage.ts";
import { expectFabCard, expectFabPlayer, expectWait } from "../../testing/fluent-assert.ts";
import { FAB_MANUAL_HARNESS } from "../../testing/harness-config.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { listLegalCommands } from "./index.ts";

describe("legal decision candidates", () => {
  it("offers Blaze's non-minimum X that actually enables the held spell", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        heroState: { energyCounters: 3 },
        hand: [zapRed],
        deck: [],
        actionPoints: 0,
        resourcePoints: 0,
      },
      { hero: rhinarRecklessRampage, hand: [], deck: [] },
      FAB_MANUAL_HARNESS,
    );
    const blaze = game.as(blazeFiremind);
    blaze.activate(blazeFiremind);
    expectWait(game).toHaveDecision("numeric");
    // Owns the enumeration contract: the policy must be able to choose X=3.
    expect(
      listLegalCommands(game.getRuntime(), blaze.id).map((command) => command.payload.answer),
    ).toContainEqual({ kind: "numeric", value: 3 });
    blaze.chooseNumeric(3);
    blaze.target(zapRed);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(blaze, blazeFiremind).toHaveCounters(0, "energy");
    expectFabCard(blaze, zapRed).toBeIn("banished");
    blaze.play(zapRed, { from: "banished", target: game.as(rhinarRecklessRampage).id });
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(game.as(rhinarRecklessRampage)).toHaveLife(37);
  });
});
