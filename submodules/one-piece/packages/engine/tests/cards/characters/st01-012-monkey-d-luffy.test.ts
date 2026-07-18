import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op04Mr4Babe071,
  op05DonquixoteRosinante022,
  st01MonkeyDLuffy012,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST01-012 Monkey.D.Luffy", () => {
  test("prevents an opposing Leader from activating Blocker during its attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: st01MonkeyDLuffy012, attachedDon: 2, playedOnTurn: 0 }] },
      {
        leaderCardId: op05DonquixoteRosinante022,
        character: [{ card: eb01Doma005, rested: true }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", st01MonkeyDLuffy012);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, targetId, "south");

    expect(() => engine.pendingDecision("battleBlocker", "north")).toThrow();
    expect(engine.getView("north").players.north.leader.rested).toBe(false);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("keeps Blocker locked when an opposing Character gains it later in the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: st01MonkeyDLuffy012, attachedDon: 2, playedOnTurn: 0 }] },
      { character: [op04Mr4Babe071], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", st01MonkeyDLuffy012);
    const mr4Id = engine.findCardInZone("north", "character", op04Mr4Babe071);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(0);
    expect(view.players.north.characters.find((card) => card?.instanceId === mr4Id)?.rested).toBe(
      false,
    );
    expect(() => engine.pendingDecision("battleBlocker", "north")).toThrow();
    expect(view.players.north.lifeCount).toBe(lifeBefore - 1);
    expect(view.prompts).toHaveLength(0);
  });
});
