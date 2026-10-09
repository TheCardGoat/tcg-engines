import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

test.each([true, false])(
  "Sentomaru pays2 DON and shuffles, with Pacifista available=%s",
  (available) => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: getCard("ST03-007"), attachedDon: 1 }],
      activeDon: 2,
      deck: available ? ["ST03-012", "ST03-002", "ST03-006"] : ["ST03-002", "ST03-006"],
    });
    const source = engine.findCardInZone("south", "character", "ST03-007");
    engine.activateEffect(source, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    if (available) {
      const target = engine.findCardInZone("south", "deck", "ST03-012");
      const choice = engine.pendingDecision("effectPlaySelection", "south").steps[0];
      if (choice?.kind !== "selectEntity") throw new Error("Expected a Pacifista choice.");
      expect(choice.candidates.map((card) => card.ref.id)).toEqual([target]);
      engine.resolveDecision("effectPlaySelection", { selectedIds: [target] }, "south");
      expect(
        engine
          .getView("south")
          .players.south.characters.some((card) => card?.instanceId === target),
      ).toBe(true);
    }
    expect(engine.getView("south").players.south.activeDon).toBe(0);
    expect(
      engine.getView("south").logs.some((log) => log.message.includes("shuffles their deck")),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  },
);
test("Sentomaru cannot activate without its attached DON", () => {
  const engine = OnePieceTestEngine.create({
    character: ["ST03-007"],
    activeDon: 2,
    deck: ["ST03-012", "ST03-002"],
  });
  engine.expectFailure({
    type: "activateEffect",
    seat: "south",
    sourceInstanceId: engine.findCardInZone("south", "character", "ST03-007"),
    trigger: "activateMain",
  });
  expect(engine.getView("south").players.south.activeDon).toBe(2);
});

test("may decline optional Sentomaru payment without resting DON or playing a card", () => {
  const engine = OnePieceTestEngine.create({
    character: [{ card: getCard("ST03-007"), attachedDon: 1 }],
    activeDon: 2,
    deck: ["ST03-012", "ST03-002"],
  });
  engine.activateEffect(
    engine.findCardInZone("south", "character", "ST03-007"),
    "activateMain",
    "south",
  );
  engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
  expect(engine.getView("south").players.south.activeDon).toBe(2);
  expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
  expect(engine.getView("south").players.south.deckCount).toBe(2);
  expect(engine.getView("south").prompts).toHaveLength(0);
});
