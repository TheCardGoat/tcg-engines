import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Shanks120 } from "@tcg/op-cards";
import { op10BasilHawkins109 } from "../../../../../cards/src/cards/OP10/characters/109-basil-hawkins.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-109 Basil Hawkins", () => {
  test("on K.O. trashes the opponent's top Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10BasilHawkins109, rested: true }] },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }], life: [eb01Doma005] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hawkinsId = engine.findCardInZone("south", "character", op10BasilHawkins109);
    const lifeId = engine.findCardInZone("north", "life", eb01Doma005);
    engine.declareAttack(
      engine.findCardInZone("north", "character", op01Shanks120),
      hawkinsId,
      "north",
    );
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      lifeId,
    );
  });
});
