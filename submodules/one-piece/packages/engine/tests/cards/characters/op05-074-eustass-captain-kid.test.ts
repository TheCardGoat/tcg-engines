import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01PageOne112, op05EustassCaptainKid074 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe('OP05-074 Eustass"Captain"Kid', () => {
  test("blocks an attack through the public Blocker decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05EustassCaptainKid074] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kidId = engine.findCardInZone("south", "character", op05EustassCaptainKid074);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Kid's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(kidId);
    engine.resolveDecision("battleBlocker", { selectedIds: [kidId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(kidId);
    expect(view.prompts).toHaveLength(0);
  });

  test("during its turn replaces one returned DON!! as active only once", () => {
    const engine = OnePieceTestEngine.create({
      character: [op05EustassCaptainKid074, op01PageOne112, op01PageOne112],
      activeDon: 2,
      donDeckCount: 2,
    });
    const pageOnes = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === op01PageOne112.id)
      .flatMap((card) => (card ? [card.instanceId] : []));
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(pageOnes[0]!, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Kid's active DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 2,
      restedDon: 0,
      donDeckCount: donDeckBefore,
    });

    engine.activateEffect(pageOnes[1]!, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: 1,
      restedDon: 0,
      donDeckCount: donDeckBefore + 1,
    });
    expect(view.prompts).toHaveLength(0);
  });
});
