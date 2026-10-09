import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST19-004 Hina", () => {
  test.each(["leader", "character"])(
    "returns trash bottom then gives rested DON to %s once",
    (kind) => {
      const e = OnePieceTestEngine.create({
        character: ["ST19-004"],
        trash: ["ST02-002"],
        restedDon: 2,
      });
      const hina = e.findCardInZone("south", "character", "ST19-004"),
        paid = e.findCardInZone("south", "trash", "ST02-002");
      e.asSouth().activateMain(hina);
      e.asSouth().acceptOptional();
      e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
      const recipient = kind === "leader" ? e.leader("south") : hina;
      e.asSouth().chooseTargets(recipient);
      expect(e.getView("south").players.south.restedDon).toBe(1);
      expect(
        kind === "leader"
          ? e.getView("south").players.south.leader.attachedDon
          : e.getView("south").players.south.characters[0]?.attachedDon,
      ).toBe(1);
      expect(e.getState().players.south.deck.at(-1)).toBe(paid);
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: hina,
        trigger: "activateMain",
      });
    },
  );
  test.each([0, 1])("opponent turn cost gains four only with DON %s", (amount) => {
    const e = OnePieceTestEngine.create({ character: ["ST19-004"], activeDon: amount });
    const h = e.findCardInZone("south", "character", "ST19-004");
    if (amount) e.asSouth().attachDon(h, 1);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(4);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(amount ? 8 : 4);
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(4);
  });
  test("declines optional trash payment", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST19-004"],
      trash: ["ST02-002"],
      restedDon: 1,
    });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST19-004"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.trash).toHaveLength(1);
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
  test("empty trash cannot pay", () => {
    const e = OnePieceTestEngine.create({ character: ["ST19-004"], restedDon: 1 });
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", "ST19-004"),
      trigger: "activateMain",
    });
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
});
