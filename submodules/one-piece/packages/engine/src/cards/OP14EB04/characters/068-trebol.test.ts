import { op02Hydra090, op02Magellan085, op04DonquixoteDoflamingo019 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Trebol068 } from "../../../../../cards/src/cards/OP14EB04/characters/068-trebol.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function playMagellanAndReturnOpponentDon(engine: OnePieceTestEngine) {
  engine.playCard(op02Magellan085, "north");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
  const cost = engine.pendingDecision("effectCostReturnDon", "north").steps[0];
  if (cost?.kind !== "payCost") throw new Error("Expected Magellan's DON return cost.");
  engine.resolveDecision(
    "effectCostReturnDon",
    { selectedIds: [cost.candidates[0]!.ref.id] },
    "north",
  );
}

describe("OP14-068 Trebol", () => {
  test("on the opponent's turn an included Donquixote Pirates Leader may replace one returned DON rested only once", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04DonquixoteDoflamingo019,
        character: [op14eb04Trebol068],
        activeDon: 1,
        donDeckCount: 1,
      },
      {
        hand: [op02Magellan085, op02Magellan085],
        activeDon: op02Magellan085.cost * 2 + 2,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );

    playMagellanAndReturnOpponentDon(engine);
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Trebol's rested DON choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({ restedDon: 1, donDeckCount: 1 });

    playMagellanAndReturnOpponentDon(engine);

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 0, donDeckCount: 2 });
    expect(view.prompts).toHaveLength(0);
  });

  test("does not add DON when its controller returns DON during its own turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04DonquixoteDoflamingo019,
      hand: [op02Hydra090],
      character: [op14eb04Trebol068],
      activeDon: op02Hydra090.cost + 1,
      donDeckCount: 1,
    });
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op02Hydra090, "south");
    const cost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Hydra's DON return cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [cost.candidates[0]!.ref.id] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });
});
