import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op03Boodle050 } from "../../../../../cards/src/cards/characters/op03-050-boodle.ts";
import { op15Jango026 } from "../../../../../cards/src/cards/characters/op15-026-jango.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-026 Jango", () => {
  test("[On Play] reveals an East Blue card from the top 3 and orders the remainder to the bottom", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Jango026], activeDon: 1, deck: [op03Boodle050, eb01Doma005, eb01Fourtricks025] },
      {},
    );
    const boodleId = engine.findCardInZone("south", "deck", op03Boodle050);

    engine.playCard(op15Jango026);

    const reveal = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected Jango's reveal choice.");
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).toContain(boodleId);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [boodleId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      {
        selectedIds: [
          engine.findCardInZone("south", "deck", eb01Doma005),
          engine.findCardInZone("south", "deck", eb01Fourtricks025),
        ],
      },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      boodleId,
    );
    expect(engine.getView("south").players.south.deckCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] trashes this Character to move one opponent rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Jango026], activeDon: 2 },
      { character: [eb01Doma005], restedDon: 2 },
    );
    const jangoId = engine.findCardInZone("south", "character", op15Jango026);
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(jangoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the rested DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    // The lone eligible Character is selected automatically.
    const north = engine.getView("south").players.north;
    expect(north.restedDon).toBe(1);
    expect(north.characters.find((card) => card?.instanceId === domaId)?.attachedDon).toBe(1);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      jangoId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-026", rested: false }], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const donBefore =
      engine.getView("south").players.south.activeDon +
      engine.getView("south").players.south.restedDon;

    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP15-026"),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.activeDon +
        engine.getView("south").players.south.restedDon,
    ).toBe(donBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
