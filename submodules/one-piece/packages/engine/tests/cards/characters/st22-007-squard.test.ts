import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST22-007 Squard", () => {
  test.each(["leader", "character"])(
    "matching reveal gives rested DON to %s without drawing",
    (kind) => {
      const e = OnePieceTestEngine.create({
        character: ["ST22-007"],
        restedDon: 1,
        deck: ["OP01-033", "ST02-002"],
      });
      const s = e.findCardInZone("south", "character", "ST22-007"),
        top = e.findCardInZone("south", "deck", "OP01-033");
      e.asSouth().activateMain(s);
      e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
      e.asSouth().chooseTargets(kind === "leader" ? e.leader("south") : s);
      expect(e.getView("south").players.south.restedDon).toBe(0);
      expect(
        kind === "leader"
          ? e.getView("south").players.south.leader.attachedDon
          : e.getView("south").players.south.characters[0]?.attachedDon,
      ).toBe(1);
      expect(e.getView("judge").players.south.deckTop?.instanceId).toBe(top);
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: s,
        trigger: "activateMain",
      });
    },
  );
  test("declines optional DON grant after reveal and spends once per turn", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST22-007"],
      restedDon: 1,
      deck: ["OP01-033", "ST02-002"],
    });
    const s = e.findCardInZone("south", "character", "ST22-007");
    e.asSouth().activateMain(s);
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(1);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: s,
      trigger: "activateMain",
    });
  });
  test.each(["OP01-033", "ST02-002"])(
    "zero rested DON or mismatching %s still completes and spends activation",
    (top) => {
      const e = OnePieceTestEngine.create({
        character: ["ST22-007"],
        restedDon: top === "ST02-002" ? 1 : 0,
        deck: [top, "ST02-012"],
      });
      const s = e.findCardInZone("south", "character", "ST22-007");
      e.asSouth().activateMain(s);
      expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
      expect(e.getView("south").players.south.restedDon).toBe(top === "ST02-002" ? 1 : 0);
      expect(e.getView("south").prompts).toHaveLength(0);
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: s,
        trigger: "activateMain",
      });
    },
  );
});
