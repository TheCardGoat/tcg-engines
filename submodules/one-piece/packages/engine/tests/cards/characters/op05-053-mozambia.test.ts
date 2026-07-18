import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05Hina050, op05Mozambia053 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function mozambiaPower(engine: OnePieceTestEngine) {
  const id = engine.findCardInZone("south", "character", op05Mozambia053);
  return engine.getView("south").players.south.characters.find((card) => card?.instanceId === id)
    ?.power;
}

describe("OP05-053 Mozambia", () => {
  test("gains +2000 only once from effect draws on its controller's turn, then resets", () => {
    const engine = OnePieceTestEngine.create({
      character: [op05Mozambia053],
      hand: [op05Hina050, op05Hina050],
      deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: 6,
    });

    engine.playCard(op05Hina050, "south");
    expect(mozambiaPower(engine)).toBe(4000);
    engine.playCard(op05Hina050, "south");
    expect(mozambiaPower(engine)).toBe(4000);

    engine.endTurn("south");
    expect(mozambiaPower(engine)).toBe(2000);
    engine.endTurn("north");
    expect(mozambiaPower(engine)).toBe(2000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not gain power when the opponent draws by an effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Mozambia053] },
      { hand: [op05Hina050], deck: [eb01Doma005], activeDon: 3 },
      { firstPlayer: "south", activeSeat: "north" },
    );

    engine.playCard(op05Hina050, "north");
    expect(mozambiaPower(engine)).toBe(2000);
  });
});
