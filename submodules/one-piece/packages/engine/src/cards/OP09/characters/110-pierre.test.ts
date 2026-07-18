import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op09Pierre110 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

function resolvePierreDiscard(engine: OnePieceTestEngine, seat: "south" | "north") {
  const trash = engine.pendingDecision("effectTrashFromHandSelection", seat).steps[0];
  if (trash?.kind !== "selectEntity") throw new Error("Expected Pierre's discard choice.");
  const selectedIds = trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id);
  engine.resolveDecision("effectTrashFromHandSelection", { selectedIds }, seat);
  return selectedIds;
}

describe("OP09-110 Pierre", () => {
  test("On Play draws two and trashes two chosen cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Pierre110, eb01Doma005],
      deck: [eb01Fourtricks025, eb01Doma005, eb01MountainGod018],
      activeDon: op09Pierre110.cost,
    });
    engine.playCard(op09Pierre110, "south");
    const selectedIds = resolvePierreDiscard(engine, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(selectedIds),
    );
  });

  test("Life Trigger plays Pierre, then resolves its On Play effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op09Pierre110],
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const pierreId = engine.findCardInZone("north", "life", op09Pierre110);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    resolvePierreDiscard(engine, "north");
    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(pierreId);
  });
});
