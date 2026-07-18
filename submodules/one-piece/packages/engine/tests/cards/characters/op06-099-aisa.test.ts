import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op06Aisa099 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-099 Aisa", () => {
  test("privately looks at and moves either player's top Life card to the bottom", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Aisa099],
        life: [eb01Doma005, eb01Fourtricks025],
        activeDon: op06Aisa099.cost,
      },
      { life: [eb01Fourtricks025, eb01Doma005] },
    );
    const opposingTopLifeId = engine.getState().players.north.life[0]!;
    const ownDeckCountBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op06Aisa099, "south");
    const owner = engine.pendingDecision("effectLookAtLifeOwner", "south").steps[0];
    expect(owner?.kind).toBe("chooseOption");
    if (owner?.kind !== "chooseOption") throw new Error("Expected Aisa's Life owner choice.");
    expect(owner.options.map((option) => option.id)).toEqual(["skip", "self", "opponent"]);
    engine.resolveDecision("effectLookAtLifeOwner", { optionId: "opponent" }, "south");

    expect(engine.pendingDecision("effectLookAtLifePosition", "south").message).toContain(
      eb01Fourtricks025.name,
    );
    expect(JSON.stringify(engine.getView("north").decisions)).not.toContain(eb01Fourtricks025.name);
    engine.resolveDecision("effectLookAtLifePosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.north.life.at(-1)).toBe(opposingTopLifeId);
    expect(engine.getView("south").players.south.deckCount).toBe(ownDeckCountBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
