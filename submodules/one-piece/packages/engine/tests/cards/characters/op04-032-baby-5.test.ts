import { describe, expect, test } from "vite-plus/test";
import { op04Baby5032 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-032 Baby 5", () => {
  test("at the end of its turn may trash itself and set up to 2 rested DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op04Baby5032, playedOnTurn: 0 }],
      restedDon: 3,
    });
    const baby5Id = engine.findCardInZone("south", "character", op04Baby5032);

    engine.endTurn("south");

    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const refresh = engine.pendingDecision("effectSetActiveDon", "south");
    expect(refresh.actorId).toBe("south");
    const step = refresh.steps[0];
    expect(step?.kind).toBe("chooseOption");
    if (step?.kind !== "chooseOption") throw new Error("Expected Baby 5's DON!! count.");
    expect(step.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === baby5Id)).toBe(false);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(baby5Id);
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 1 });
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the self-trash cost and choose to set zero DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op04Baby5032, playedOnTurn: 0 }],
      restedDon: 2,
    });
    const baby5Id = engine.findCardInZone("south", "character", op04Baby5032);

    engine.endTurn("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(baby5Id);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing itself or changing DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op04Baby5032, playedOnTurn: 0 }],
      restedDon: 2,
    });
    const baby5Id = engine.findCardInZone("south", "character", op04Baby5032);

    engine.endTurn("south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === baby5Id)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(baby5Id);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
  });
});
