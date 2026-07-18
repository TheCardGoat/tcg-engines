import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03Arlong022,
  op03CharlotteLinlin077,
  op03CharlotteLinlin114,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-114 Charlotte Linlin", () => {
  test("with an included Big Mom Pirates Leader type, chooses both top-Life movements", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03CharlotteLinlin077,
        hand: [op03CharlotteLinlin114],
        deck: [eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
        life: [eb01Doma005],
        activeDon: op03CharlotteLinlin114.cost,
      },
      { life: [eb01Fourtricks025, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ownDeckTopId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const opposingLifeTopId = engine.findCardInZone("north", "life", eb01Fourtricks025);

    engine.playCard(op03CharlotteLinlin114, "south");

    const addLifeDecision = engine.pendingDecision("effectAddToLifeFromDeck", "south");
    expect(addLifeDecision.actorId).toBe("south");
    const addLife = addLifeDecision.steps[0];
    expect(addLife?.kind).toBe("chooseOption");
    if (addLife?.kind !== "chooseOption") throw new Error("Expected Linlin's add-Life choice.");
    expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const removeLifeDecision = engine.pendingDecision("effectRemoveFromLifeCount", "south");
    expect(removeLifeDecision.actorId).toBe("south");
    const removeLife = removeLifeDecision.steps[0];
    expect(removeLife?.kind).toBe("chooseOption");
    if (removeLife?.kind !== "chooseOption")
      throw new Error("Expected Linlin's trash-Life choice.");
    expect(removeLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");

    const view = engine.getView("south");
    // Life is hidden from players; identity at its destination is the narrow state boundary.
    expect(engine.getState().players.south.life[0]).toBe(ownDeckTopId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(opposingLifeTopId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may choose zero for both Life movements", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03CharlotteLinlin077,
        hand: [op03CharlotteLinlin114],
        deck: [eb01MountainGod018, eb01Doma005],
        life: [eb01Doma005],
        activeDon: op03CharlotteLinlin114.cost,
      },
      { life: [eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op03CharlotteLinlin114, "south");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "0" }, "south");
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ lifeCount: 1, deckCount: 2 });
    expect(view.players.north).toMatchObject({ lifeCount: 1 });
    expect(view.players.north.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer either Life action without a Big Mom Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Arlong022,
        hand: [op03CharlotteLinlin114],
        deck: [eb01MountainGod018, eb01Doma005],
        life: [eb01Doma005],
        activeDon: op03CharlotteLinlin114.cost,
      },
      { life: [eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op03CharlotteLinlin114, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ lifeCount: 1, deckCount: 2 });
    expect(view.players.north).toMatchObject({ lifeCount: 1 });
    expect(view.players.north.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
