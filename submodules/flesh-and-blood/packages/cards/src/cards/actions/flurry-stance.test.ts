import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { nimblismBlue } from "./nimblism.ts";
import { flurryStanceRed } from "./flurry-stance.ts";

function pitchWhilePaying(game: FabTestEngine, Fang: ReturnType<FabTestEngine["as"]>): void {
  for (let i = 0; i < 4; i += 1) {
    const wait = game.waitState();
    if (wait.kind !== "decision" || wait.decision.kind !== "payment") return;
    const copies = Fang.cardsIn("hand", nimblismBlue);
    game.answerDecision(Fang.id, {
      kind: "payment",
      instanceIds: [copies[0]!.instanceId],
    });
  }
}

describe("Flurry Stance (HNT126) AAA", () => {
  it("happy: at the start of your turn destroy this then you may attack with each dagger an additional time", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: fang,
        arena: [flurryStanceRed],
        weapon1: [nerveScalpel],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    game.as(dash).endTurn();
    // CR 5.2.3c: the start-of-turn grant is not a decision — a full decline
    // pass must still lift each dagger's limit.
    game.untilIdle({ optionals: "decline" });
    expectFabCard(Fang, flurryStanceRed).toBeIn("graveyard");

    Fang.activate(nerveScalpel);
    pitchWhilePaying(game, Fang);
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat({ optionals: "decline" });

    Fang.activate(nerveScalpel);
    pitchWhilePaying(game, Fang);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toBeOpen();
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: fang, arena: [flurryStanceRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(fang).endTurn();
    game.untilIdle();
    expectFabCard(game.as(fang), flurryStanceRed).toBeIn("arena");
  });
});
