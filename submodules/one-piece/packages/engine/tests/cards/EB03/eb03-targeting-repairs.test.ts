import { describe, expect, test } from "vite-plus/test";
import { eb02NicoRobin036 } from "../../../../cards/src/cards/EB02/characters/036-nico-robin.ts";
import { eb03Alvida021 } from "../../../../cards/src/cards/EB03/characters/021-alvida.ts";
import { eb03Isuka022 } from "../../../../cards/src/cards/EB03/characters/022-isuka.ts";
import { eb03NefeltariVivi024 } from "../../../../cards/src/cards/EB03/characters/024-nefeltari-vivi.ts";
import { op13Higuma013 } from "../../../../cards/src/cards/OP13/characters/013-higuma.ts";
import { op13Otama043 } from "../../../../cards/src/cards/OP13/characters/043-otama.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

function pendingPrompt(engine: OnePieceTestEngine, intent: string) {
  return engine
    .getState()
    .promptQueue.find(
      (prompt) => prompt.status === "pending" && prompt.resolutionContext?.intent === intent,
    );
}

function resolveTarget(engine: OnePieceTestEngine, targetId: string) {
  const prompt = pendingPrompt(engine, "effectTargetSelection");
  expect(prompt).toBeDefined();
  engine.exec({
    type: "resolvePrompt",
    seat: "south",
    promptId: prompt!.id,
    selectedIds: [targetId],
  });
}

function resolvePlaySelection(engine: OnePieceTestEngine, targetId: string) {
  const prompt = pendingPrompt(engine, "effectPlaySelection");
  expect(prompt).toBeDefined();
  engine.exec({
    type: "resolvePrompt",
    seat: "south",
    promptId: prompt!.id,
    selectedIds: [targetId],
  });
}

describe("EB03 targeting repairs", () => {
  test("Alvida can bottom-deck its controller's cost-3 Character with its second target", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Alvida021, op13Otama043],
        character: [op13Higuma013],
        activeDon: eb03Alvida021.cost,
      },
      { character: [op13Higuma013] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ownTargetId = engine.findCardInZone("south", "character", op13Higuma013);
    const opposingTargetId = engine.findCardInZone("north", "character", op13Higuma013);

    engine.playCard(eb03Alvida021);
    const optionalPrompt = pendingPrompt(engine, "effectOptional");
    expect(optionalPrompt).toBeDefined();
    engine.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: optionalPrompt!.id,
      optionId: "yes",
    });
    resolveTarget(engine, opposingTargetId);
    resolveTarget(engine, ownTargetId);

    expect(engine.getState().players.south.deck).toContain(ownTargetId);
  });

  test("Isuka can bottom-deck its controller's cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Isuka022],
        character: [op13Otama043],
        activeDon: eb03Isuka022.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("south", "character", op13Otama043);

    engine.playCard(eb03Isuka022);
    resolveTarget(engine, targetId);

    expect(engine.findCardInZone("south", "deck", op13Otama043)).toBe(targetId);
  });

  test("Vivi plays a Straw Hat Crew Character from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03NefeltariVivi024, eb02NicoRobin036],
        activeDon: eb03NefeltariVivi024.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const robinId = engine.findCardInZone("south", "hand", eb02NicoRobin036);

    engine.playCard(eb03NefeltariVivi024);
    resolvePlaySelection(engine, robinId);

    expect(engine.findCardInZone("south", "character", eb02NicoRobin036)).toBe(robinId);
  });
});
