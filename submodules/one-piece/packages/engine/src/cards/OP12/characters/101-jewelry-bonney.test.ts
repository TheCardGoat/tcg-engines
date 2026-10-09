import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12JewelryBonney101, op12RoronoaZoro020 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-101 Jewelry Bonney", () => {
  test("rests itself and boosts an included Supernovas Leader through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12RoronoaZoro020,
      character: [op12JewelryBonney101],
      deck: [eb01Doma005, eb01Doma005, eb01Doma005],
    });
    const bonneyId = engine.findCardInZone("south", "character", op12JewelryBonney101);
    engine.activateEffect(bonneyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(6000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(6000);
    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12RoronoaZoro020,
      character: [op12JewelryBonney101],
      deck: [eb01Doma005, eb01Doma005, eb01Doma005],
    });
    const bonneyId = engine.findCardInZone("south", "character", op12JewelryBonney101);
    engine.activateEffect(bonneyId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test.each(["ST01-001", "ST04-001"])(
    "Life Trigger plays Bonney only with a Supernovas Leader: %s",
    (leader) => {
      const e = OnePieceTestEngine.create(
        { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
        { leaderCardId: leader, life: [op12JewelryBonney101] },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const id = e.findCardInZone("north", "life", op12JewelryBonney101);
      e.asSouth().attack(e.findCardInZone("south", "character", "EB01-018"), e.leader("north"));
      e.asNorth().activateLifeTrigger();
      const north = e.getView("north").players.north;
      expect(north.characters.some((c) => c?.instanceId === id)).toBe(leader === "ST01-001");
      expect(north.trash.some((c) => c.instanceId === id)).toBe(leader !== "ST01-001");
      expect(north.hand.map((c) => c.instanceId)).not.toContain(id);
    },
  );
});
