import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST05-005 Carina", () => {
  test.each([
    [0, 1, 1, 1],
    [0, 1, 3, 2],
    [1, 1, 3, 0],
  ])(
    "pays FILM card before comparing field DON self=%s opponent=%s deck=%s",
    (own, theirs, deck, added) => {
      const e = OnePieceTestEngine.create(
        {
          character: ["ST05-005"],
          hand: ["ST05-002", "ST05-003", "ST04-012"],
          activeDon: own,
          donDeckCount: deck,
        },
        { activeDon: theirs },
      );
      const carina = e.findCardInZone("south", "character", "ST05-005");
      const film = e.findCardInZone("south", "hand", "ST05-002");
      const film2 = e.findCardInZone("south", "hand", "ST05-003");
      e.asSouth().activateMain(carina);
      e.asSouth().acceptOptional();
      const step = e.pendingDecision("effectCostTrashFromHand", "south").steps[0];
      if (step?.kind !== "payCost") throw Error("payment");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([film, film2]);
      e.resolveDecision("effectCostTrashFromHand", { selectedIds: [film] }, "south");
      expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(film);
      expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
      expect(e.getView("south").players.south).toMatchObject({
        activeDon: own,
        restedDon: added,
        donDeckCount: deck - added,
      });
      expect(e.getView("south").prompts).toHaveLength(0);
      const repeat = e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: carina,
        trigger: "activateMain",
      });
      expect(repeat.reason).toBe("This effect has already been used this turn.");
    },
  );
  test("decline keeps Character active and retains hand payment", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST05-005"], hand: ["ST05-002"] },
      { activeDon: 1 },
    );
    const c = e.findCardInZone("south", "character", "ST05-005");
    e.asSouth().activateMain(c);
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.hand).toHaveLength(1);
    e.asSouth().activateMain(c);
    e.asSouth().declineOptional();
  });
  test("non-FILM hand card cannot pay", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST05-005"], hand: ["ST04-012"] },
      { activeDon: 1 },
    );
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", "ST05-005"),
      trigger: "activateMain",
    });
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
