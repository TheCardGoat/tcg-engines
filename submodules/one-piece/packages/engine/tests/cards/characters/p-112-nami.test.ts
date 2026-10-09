import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("p-112-nami", () => {
  test("namedNami Leader receives DON and effectplays cost2 excludingcost3", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP03-040",
      hand: ["P-112", "P-018", "P-012"],
      activeDon: 5,
    });
    e.asSouth().play("P-112");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([
      e.findCardInZone("south", "hand", "P-018"),
    ]);
    e.asSouth().choosePlay("P-018");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
    expect(e.getView("south").players.south.characters[1]?.cardId).toBe("P-018");
  });
  test("declines optional DON and play", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP03-040",
      hand: ["P-112", "P-018"],
      activeDon: 5,
    });
    e.asSouth().play("P-112");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    e.asSouth().chooseNoPlay();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
  });
  test("wrong Leader suppresses both actions", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-112", "P-018"], activeDon: 5 });
    e.asSouth().play("P-112");
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
  });
  test("skips DON but still plays eligible Character", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP03-040",
      hand: ["P-112", "P-018"],
      activeDon: 5,
    });
    e.asSouth().play("P-112");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    e.asSouth().choosePlay("P-018");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
    expect(e.getView("south").players.south.characters[1]?.cardId).toBe("P-018");
  });
});
