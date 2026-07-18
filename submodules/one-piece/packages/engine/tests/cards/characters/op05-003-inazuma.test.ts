import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Inazuma003,
  op13GumGumSnakeShot039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-003 Inazuma", () => {
  test("does not count itself as the required 7000-power Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05Inazuma003], activeDon: 6 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op05Inazuma003, "south");
    const inazumaId = engine.findCardInZone("south", "character", op05Inazuma003);
    engine.attachDon(inazumaId, 3, "south");

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: inazumaId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
  });

  test("gains Rush when another 7000-power Character appears later", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05Inazuma003, eb01MountainGod018], activeDon: 8 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op05Inazuma003, "south");
    const inazumaId = engine.findCardInZone("south", "character", op05Inazuma003);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: inazumaId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    engine.playCard(eb01MountainGod018, "south");
    engine.declareAttack(inazumaId, engine.leader("north"), "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === inazumaId)?.rested,
    ).toBe(true);
  });

  test("an already-declared attack continues after the supporting Character leaves", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05Inazuma003],
        character: [{ card: eb01Fourtricks025, rested: true, attachedDon: 2 }],
        activeDon: 5,
      },
      {
        hand: [op13GumGumSnakeShot039],
        life: [eb01Doma005, eb01MountainGod018],
        deck: [eb01Doma005, eb01MountainGod018],
        activeDon: op13GumGumSnakeShot039.cost,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const supportId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const eventId = engine.findCardInZone("north", "hand", op13GumGumSnakeShot039);

    engine.playCard(op05Inazuma003, "south");
    const inazumaId = engine.findCardInZone("south", "character", op05Inazuma003);
    engine.attachDon(inazumaId, 2, "south");
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(inazumaId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [supportId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(supportId);
    expect(view.players.north.lifeCount).toBe(lifeBefore - 1);
    expect(view.prompts).toHaveLength(0);
  });
});
