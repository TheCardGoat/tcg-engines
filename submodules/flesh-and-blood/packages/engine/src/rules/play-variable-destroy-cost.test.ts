import { describe, expect, it } from "vitest";

import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../index.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { dash } from "./fixtures.ts";
import { copper } from "../../../cards/src/cards/tokens/copper.ts";
import { gold } from "../../../cards/src/cards/tokens/gold.ts";
import { raiseAnArmyYellow } from "../../../cards/src/cards/actions/raise-an-army.ts";
import { kassaiOfTheGoldenSand } from "../../../cards/src/cards/heroes/kassai-of-the-golden-sand.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function restore(
  game: ReturnType<typeof FabTestEngine.start>,
): ReturnType<typeof FabTestEngine.start> {
  const state = game.getState();
  return FabTestEngine.fromState(
    restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    ),
  );
}

describe("variable destroy additional play costs", () => {
  it("restores both declaration boundaries and pays the exact persisted objects atomically", () => {
    let game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [raiseAnArmyYellow],
        arena: [gold, gold, copper],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    let Kassai = game.as(kassaiOfTheGoldenSand);

    // Arrange — suspend at X declaration, restore, then suspend again after X
    // at the exact object declaration boundary and restore a second time.
    Kassai.exec({
      move: "begin-play",
      payload: { instanceId: Kassai.findCardInZone("hand", raiseAnArmyYellow) },
    });
    expect(game.getState().decision).toMatchObject({ kind: "numeric", min: 0, max: 2 });
    game = restore(game);
    Kassai = game.as(kassaiOfTheGoldenSand);
    game.answerDecision(Kassai.id, { kind: "numeric", value: 2 });
    expect(game.getState().decision).toMatchObject({
      kind: "entity-target",
      min: 2,
      max: 2,
      continuation: { kind: "play-cost-target" },
    });
    game = restore(game);
    Kassai = game.as(kassaiOfTheGoldenSand);

    // Act — pay with the two exact Gold after restore and resolve normally.
    Kassai.chooseTargets(...Kassai.cardsIn("arena", gold));
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    game.passBoth();

    // Assert — Copper cannot substitute, both declared Gold left together,
    // and connected X created exactly two result tokens.
    expect(Kassai.cardsIn("arena", gold)).toHaveLength(0);
    expect(Kassai.cardsIn("arena", copper)).toHaveLength(1);
    expect(
      Kassai.zone("arena").filter((identity) => identity === "token:cintari-sellsword"),
    ).toHaveLength(2);
    expect(Kassai.zone("graveyard")).toContain(raiseAnArmyYellow.canonicalId);
  });
});
