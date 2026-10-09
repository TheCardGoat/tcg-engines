import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op11Ishilly025 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-025 Ishilly", () => {
  test("on the opponent's attack, rests its costs and gives a chosen own card +1000 this battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11Ishilly025],
        hand: [eb01Doma005],
        activeDon: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ishillyId = engine.findCardInZone("south", "character", op11Ishilly025);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Ishilly's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      ishillyId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(6000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ishillyId)?.rested,
    ).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(engine.pendingDecision("battleCounter", "south").actorId).toBe("south");
  });
  test("may decline the compound rest cost without battle power or DON payment", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP11-025"], activeDon: 1 },
      {},
      { activeSeat: "north" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.lifeCount).toBe(3);
  });
});
