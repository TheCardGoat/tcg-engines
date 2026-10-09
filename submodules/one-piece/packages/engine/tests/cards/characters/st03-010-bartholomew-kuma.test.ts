import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

test.each(["top", "bottom"] as const)(
  "Kuma privately orders the whole group at the %s",
  (position) => {
    const engine = OnePieceTestEngine.create({
      hand: ["ST03-010"],
      activeDon: 2,
      deck: ["ST03-002", "ST03-006", "ST03-011", "ST03-012"],
    });
    const ordered = ["ST03-011", "ST03-006", "ST03-002"].map((id) =>
      engine.findCardInZone("south", "deck", id),
    );
    const fourth = engine.findCardInZone("south", "deck", "ST03-012");
    engine.playCard("ST03-010");
    expect(engine.getView("north").decisions).toHaveLength(0);
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: ordered }, "south");
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: position }, "south");
    // Exact private order has no public-view field.
    expect(engine.getState().players.south.deck).toEqual(
      position === "top" ? [...ordered, fourth] : [fourth, ...ordered],
    );
  },
);
test("Kuma Life Trigger plays it and resolves its On Play with a short deck", () => {
  const engine = OnePieceTestEngine.create(
    { character: [{ card: getCard("EB01-018"), playedOnTurn: 0 }] },
    { life: ["ST03-010"], deck: ["ST03-002", "ST03-006"] },
    { firstPlayer: "north", activeSeat: "south" },
  );
  engine.declareAttack(
    engine.findCardInZone("south", "character", "EB01-018"),
    engine.leader("north"),
    "south",
  );
  engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
  const order = ["ST03-006", "ST03-002"].map((id) => engine.findCardInZone("north", "deck", id));
  engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: order }, "north");
  engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "top" }, "north");
  expect(
    engine.getView("north").players.north.characters.some((card) => card?.cardId === "ST03-010"),
  ).toBe(true);
  expect(engine.getView("north").players.north.activeDon).toBe(0);
  expect(engine.getView("north").status).toBe("active");
});
