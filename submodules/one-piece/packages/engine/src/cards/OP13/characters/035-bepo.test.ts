import { describe, expect, test } from "vite-plus/test";
import { op13Bepo035 } from "../../../../../cards/src/cards/OP13/characters/035-bepo.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-035 Bepo", () => {
  test("at end of turn may choose to set this Character active", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op13Bepo035, rested: true }],
      restedDon: 1,
    });
    const bepoId = engine.findCardInZone("south", "character", op13Bepo035);

    engine.endTurn("south");
    expect(engine.pendingDecision("effectActionChoice", "south").actorId).toBe("south");
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === bepoId)?.rested).toBe(
      false,
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may instead set up to one rested DON!! active while leaving itself rested", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op13Bepo035, rested: true }],
      restedDon: 2,
    });
    const bepoId = engine.findCardInZone("south", "character", op13Bepo035);

    engine.endTurn("south");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    const donChoice = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    expect(donChoice).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === bepoId)?.rested).toBe(
      true,
    );
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
