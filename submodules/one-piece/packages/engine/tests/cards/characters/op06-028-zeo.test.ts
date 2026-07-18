import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op06HodyJones020, op06Zeo028 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-028 Zeo", () => {
  test("activates a rested DON!!, gains power, and takes Life with its required Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        character: [{ card: op06Zeo028, attachedDon: 1, playedOnTurn: 0 }],
        life: [eb01Doma005],
        restedDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zeoId = engine.findCardInZone("south", "character", op06Zeo028);
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);

    engine.declareAttack(zeoId, engine.leader("north"), "south");
    const donChoice = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    expect(donChoice).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0, lifeCount: 0 });
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.south.characters.find((card) => card?.instanceId === zeoId)?.power).toBe(
      5000,
    );
  });

  test("still takes Life when zero rested DON!! are set active", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        character: [{ card: op06Zeo028, attachedDon: 1, playedOnTurn: 0 }],
        life: [eb01Doma005],
        restedDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zeoId = engine.findCardInZone("south", "character", op06Zeo028);
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);

    engine.declareAttack(zeoId, engine.leader("north"), "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1, lifeCount: 0 });
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.south.characters.find((card) => card?.instanceId === zeoId)?.power).toBe(
      5000,
    );
  });

  test("does nothing when the Leader lacks New Fish-Man Pirates", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op06Zeo028, attachedDon: 1, playedOnTurn: 0 }],
        life: [eb01Doma005],
        restedDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zeoId = engine.findCardInZone("south", "character", op06Zeo028);

    engine.declareAttack(zeoId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1, lifeCount: 1 });
    expect(view.players.south.characters.find((card) => card?.instanceId === zeoId)?.power).toBe(
      4000,
    );
  });
});
