import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Marco (OP17-015) cost=5 power=6000 counter=1000
describe("OP17-015 Marco", () => {
  test("FAQ: sacrifices itself once when it and another Character are simultaneously K.O.'d", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST04-001", hand: ["OP01-094"], activeDon: 10 },
      { character: ["OP17-015", "EB01-005"], hand: [] },
    );
    const marco = e.findCardInZone("north", "character", "OP17-015"),
      doma = e.findCardInZone("north", "character", "EB01-005");
    e.playCard("OP01-094");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toEqual([marco]);
    expect(
      e
        .getView("north")
        .players.north.characters.filter(Boolean)
        .map((c) => c?.instanceId),
    ).toEqual([doma]);
    expect(e.getView("north").prompts).toHaveLength(0);
  });

  test.each([true, false])(
    "On K.O. revival with payable inclusive Whitebeard hand cost accepted=%s",
    (accept) => {
      const e = OnePieceTestEngine.create(
        { character: [{ cardId: "OP17-015", rested: true }], hand: ["EB01-005", "ST02-002"] },
        { character: ["OP16-003"] },
        { activeSeat: "north", firstPlayer: "south" },
      );
      const marco = e.findCardInZone("south", "character", "OP17-015");
      const payment = e.findCardInZone("south", "hand", "EB01-005");
      e.asNorth().attack("OP16-003", "OP17-015");
      e.asSouth().chooseCounter();
      if (accept) e.asSouth().acceptOptional();
      else e.asSouth().declineOptional();
      const after = e.getView("south").players.south;
      expect(after.characters.some((c) => c?.instanceId === marco)).toBe(accept);
      expect(after.trash.some((c) => c.instanceId === marco)).toBe(!accept);
      expect(after.trash.some((c) => c.instanceId === payment)).toBe(accept);
      expect(after.hand.map((c) => c.cardId)).toEqual(
        accept ? ["ST02-002"] : ["EB01-005", "ST02-002"],
      );
      if (accept) expect(after.characters.find((c) => c?.instanceId === marco)?.rested).toBe(false);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});
