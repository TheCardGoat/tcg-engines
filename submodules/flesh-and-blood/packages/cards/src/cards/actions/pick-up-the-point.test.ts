import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { arakni } from "../heroes/arakni.ts";
import { dash } from "../heroes/dash.ts";
import { hunterSKlaive } from "../weapons/hunter-s-klaive.ts";
import { pickUpThePointRed } from "./pick-up-the-point.ts";

describe("Pick Up the Point family AAA", () => {
  it("happy: when this attacks you may retrieve a dagger from the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [pickUpThePointRed],
        graveyard: [hunterSKlaive],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.playAttack(pickUpThePointRed, { stopAt: "on-attack" });
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Arakni, hunterSKlaive).toBeIn("hand");
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("boundary: declining retrieve leaves the dagger in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [pickUpThePointRed],
        graveyard: [hunterSKlaive],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.playAttack(pickUpThePointRed, { stopAt: "on-attack" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Arakni, hunterSKlaive).toBeIn("graveyard");
  });

  it("timing: go again refunds after the attack resolves", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [pickUpThePointRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(pickUpThePointRed);
    expectFabPlayer(Arakni).toHaveAP(0);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Arakni).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });
});
