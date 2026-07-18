import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op06Perona093 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-093 Perona", () => {
  test("at five opposing hand cards, lets that opponent choose the discarded card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06Perona093], activeDon: op06Perona093.cost },
      {
        hand: [eb01Doma005, eb01Doma005, eb01Fourtricks025, eb01Fourtricks025, eb01MountainGod018],
      },
    );
    const opposingHandIds = engine
      .getView("north")
      .players.north.hand.map((card) => card.instanceId);

    engine.playCard(op06Perona093, "south");
    const choice = engine.pendingDecision("effectActionChoice", "south").steps[0];
    expect(choice?.kind).toBe("chooseOption");
    if (choice?.kind !== "chooseOption") throw new Error("Expected Perona's printed choice.");
    expect(choice.options.map((option) => option.label)).toEqual(["trashFromHand", "modifyCost"]);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") throw new Error("Expected Perona's opponent discard.");
    expect(discard.candidates.map((candidate) => candidate.ref.id)).toEqual(opposingHandIds);
    const discardedId = opposingHandIds[2]!;
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "north");

    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      discardedId,
    );
    expect(engine.getView("north").players.north.handCount).toBe(4);
  });

  test("chooses an opponent Character to lose 3 cost for this turn only", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06Perona093], activeDon: op06Perona093.cost },
      {
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [eb01MountainGod018],
      },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op06Perona093, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Perona's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(eb01MountainGod018.cost - 3);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(eb01MountainGod018.cost);
  });

  test("below five opposing hand cards, offers no choice", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06Perona093], activeDon: op06Perona093.cost },
      { hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005] },
    );

    engine.playCard(op06Perona093, "south");

    expect(engine.getView("south").players.north.handCount).toBe(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
