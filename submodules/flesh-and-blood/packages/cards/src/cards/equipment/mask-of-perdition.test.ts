import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { infectRed } from "../actions/infect.ts";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { snatchRed } from "../actions/snatch.ts";
import { maskOfPerdition } from "./mask-of-perdition.ts";

describe("Mask of Perdition (DYN118) AAA", () => {
  it("happy: AR destroy grants the Assassin AAC on-hit banish top", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        head: [maskOfPerdition],
        hand: [infectRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.playAttack(infectRed);
    game.toReaction("attacker");
    Arakni.activate(maskOfPerdition);
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargets: "minimum",
      ordering: "listed",
    });
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Arakni, maskOfPerdition).toBeIn("graveyard");
    expectFabCard(Dash, snatchRed).toBeBanished();
  });

  it("boundary: fewer than two Silver cannot re-equip from the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: arakni,
        graveyard: [maskOfPerdition],
        arena: [fabToken("silver")],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(game.as(arakni), maskOfPerdition).toBeIn("graveyard");
  });

  it("timing: start of turn may destroy two Silver to equip this from the GY", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: arakni,
        graveyard: [maskOfPerdition],
        arena: [fabToken("silver"), fabToken("silver")],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Arakni, maskOfPerdition).toBeIn("head");
  });
});
