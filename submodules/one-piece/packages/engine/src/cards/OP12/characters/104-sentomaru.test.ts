import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op12Sentomaru104 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-104 Sentomaru", () => {
  test("its Life Trigger K.O.s an opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      { life: [op12Sentomaru104] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });
});
