import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op04Koza006 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-006 Koza", () => {
  test("pays the active-Leader power cost and keeps +2000 until the start of its next turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Koza006, playedOnTurn: 0 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kozaId = engine.findCardInZone("south", "character", op04Koza006);

    engine.declareAttack(kozaId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(0);
    expect(view.players.south.characters.find((card) => card?.instanceId === kozaId)?.power).toBe(
      5000,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.characters.find((card) => card?.instanceId === kozaId)?.power).toBe(
      5000,
    );

    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === kozaId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without changing its Leader or Character power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Koza006, playedOnTurn: 0 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kozaId = engine.findCardInZone("south", "character", op04Koza006);

    engine.declareAttack(kozaId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.characters.find((card) => card?.instanceId === kozaId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the effect after its Leader has attacked and is no longer active", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Koza006, playedOnTurn: 0 }] },
      { character: [{ card: eb01MountainGod018, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kozaId = engine.findCardInZone("south", "character", op04Koza006);
    const opposingCharacterId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(engine.leader("south"), opposingCharacterId, "south");
    engine.declareAttack(kozaId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.rested).toBe(true);
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.characters.find((card) => card?.instanceId === kozaId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
