import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "../../../../testing/index.ts";
import { dash } from "../../../../../../cards/src/cards/heroes/dash.ts";
import { viseraiTheForsaken } from "../../../../../../cards/src/cards/heroes/viserai-the-forsaken.ts";
import { PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID } from "../../../../../../cards/src/runtime-registry.ts";

const viseraiForsakenPhysical = PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID.get(
  viseraiTheForsaken.canonicalId,
)!;
import { envelopInDarknessRed } from "../../../../../../cards/src/cards/actions/envelop-in-darkness.ts";
import { snatchRed } from "../../../../../../cards/src/cards/actions/snatch.ts";
import { nimblismBlue } from "../../../../../../cards/src/cards/actions/nimblism.ts";

describe("keyword: traverse", () => {
  it("UST notes: traversing flips the hero, keeps life, and keeps the Marked condition", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiForsakenPhysical,
        hand: [envelopInDarknessRed, envelopInDarknessRed, envelopInDarknessRed],
        resourcePoints: 3,
        actionPoints: 1,
        life: 33,
        marked: true,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiForsakenPhysical);

    Viserai.play(envelopInDarknessRed);
    game.untilIdle();
    Viserai.play(envelopInDarknessRed);
    game.untilIdle();
    Viserai.play(envelopInDarknessRed);
    game.untilIdle();

    expectFabPlayer(Viserai).toHaveLife(33).toBeMarked().toHaveTokenCount("runechant", 3);
    expectFabCard(Viserai, viseraiForsakenPhysical).toHaveName("Viserai, Usurper");
  });

  it("UST notes boundary: creating fewer than 3 Runechants this turn does not traverse", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiForsakenPhysical,
        hand: [envelopInDarknessRed, envelopInDarknessRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 33,
        deck: [snatchRed, nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiForsakenPhysical);

    Viserai.play(envelopInDarknessRed);
    game.untilIdle();
    Viserai.play(envelopInDarknessRed);
    game.untilIdle();

    expectFabPlayer(Viserai).toHaveLife(33);
    expectFabCard(Viserai, viseraiForsakenPhysical).notToHaveSupertype("Demon");
  });
});
