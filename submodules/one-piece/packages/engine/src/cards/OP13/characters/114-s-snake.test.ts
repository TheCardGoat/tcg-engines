import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op13SSnake114 } from "../../../../../cards/src/cards/OP13/characters/114-s-snake.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-114 S-Snake", () => {
  test("pays the top-Life face-up cost for an On Play power reduction that expires", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13SSnake114],
        life: [eb01Doma005],
        activeDon: op13SSnake114.cost,
      },
      { character: [eb01Doma005] },
    );
    const firstTargetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13SSnake114, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstTargetId] }, "south");
    expect(engine.getView("south").players.south.life[0]).toMatchObject({ hidden: false });

    let view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === firstTargetId)?.power,
    ).toBe((eb01Doma005.power ?? 0) - 2000);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === firstTargetId)?.power,
    ).toBe(eb01Doma005.power);
    expect(view.prompts).toHaveLength(0);
  });

  test("When Attacking may pay the same Life cost for a selected opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13SSnake114, playedOnTurn: 0 }],
        life: [eb01Doma005],
      },
      { character: [eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const snakeId = engine.findCardInZone("south", "character", op13SSnake114);
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.declareAttack(snakeId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.life[0]).toMatchObject({ hidden: false });
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      (eb01Fourtricks025.power ?? 0) - 2000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the top-Life cost and On Play reduction", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13SSnake114],
        life: [eb01Doma005],
        activeDon: op13SSnake114.cost,
      },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13SSnake114, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.life[0]).toMatchObject({ hidden: true });
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger trashes a selected hand card and plays the resolving physical S-Snake", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op13SSnake114], hand: [eb01Doma005, eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op13SSnake114);
    const paymentId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "north").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected S-Snake's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });
});
