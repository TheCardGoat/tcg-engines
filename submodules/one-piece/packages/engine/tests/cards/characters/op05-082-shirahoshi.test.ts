import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Shirahoshi082,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function payShirahoshiCost(engine: OnePieceTestEngine, submittedOrder: string[]) {
  const shirahoshiId = engine.findCardInZone("south", "character", op05Shirahoshi082);
  engine.activateEffect(shirahoshiId, "activateMain", "south");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
  expect(cost?.kind).toBe("payCost");
  if (cost?.kind !== "payCost") throw new Error("Expected Shirahoshi's ordered trash cost.");
  expect(cost).toMatchObject({ min: 2, max: 2 });
  engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: submittedOrder }, "south");
  return shirahoshiId;
}

describe("OP05-082 Shirahoshi", () => {
  test("rests, orders two trash cards, then makes an opponent with six cards discard one", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op05Shirahoshi082],
        trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      {
        hand: [
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
      },
    );
    const trashIds = [...engine.getState().players.south.trash];
    const submittedOrder = [trashIds[2]!, trashIds[0]!];
    const shirahoshiId = payShirahoshiCost(engine, submittedOrder);

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north");
    expect(discard.actorId).toBe("north");
    const step = discard.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected the opponent's discard choice.");
    expect(step).toMatchObject({ min: 1, max: 1 });
    const discardedId = step.candidates[1]!.ref.id;
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "north");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === shirahoshiId)?.rested,
    ).toBe(true);
    expect(view.players.north).toMatchObject({ handCount: 5 });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(engine.getState().players.south.deck.slice(-2)).toEqual(submittedOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("can still pay and return trash when the opponent has only five hand cards", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Shirahoshi082], trash: [eb01Doma005, eb01Fourtricks025] },
      {
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      },
    );
    const trashIds = [...engine.getState().players.south.trash];

    const shirahoshiId = payShirahoshiCost(engine, trashIds);

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === shirahoshiId)?.rested,
    ).toBe(true);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.players.north).toMatchObject({ handCount: 5 });
    expect(view.players.north.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
