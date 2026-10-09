import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST07-008 Charlotte Pudding", () => {
  test.each(["self", "opponent"])(
    "privately inspects %s top Life and places it on bottom",
    (owner) => {
      const e = OnePieceTestEngine.create(
        { hand: ["ST07-008"], activeDon: 2, life: ["ST07-002", "ST07-006"] },
        { life: ["ST07-014", "ST07-012"] },
      );
      const seat = owner === "self" ? "south" : "north";
      const top = e.getView("judge").players[seat].life[0]?.instanceId;
      e.asSouth().play("ST07-008");
      e.resolveDecision("effectLookAtLifeOwner", { optionId: owner }, "south");
      expect(e.pendingDecision("effectLookAtLifePosition", "south").message).toContain(
        owner === "self" ? "Charlotte Anana" : "Pekoms",
      );
      expect(e.getView("north").decisions).toHaveLength(0);
      e.resolveDecision("effectLookAtLifePosition", { optionId: "bottom" }, "south");
      expect(e.getView("judge").players[seat].life.at(-1)?.instanceId).toBe(top);
      expect(e.getView("south").players[seat].lifeCount).toBe(2);
    },
  );
  test("skips looking without changing Life order", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST07-008"],
      activeDon: 2,
      life: ["ST07-002", "ST07-006"],
    });
    const before = e.getView("judge").players.south.life.map((c) => c?.instanceId);
    e.asSouth().play("ST07-008");
    e.resolveDecision("effectLookAtLifeOwner", { optionId: "skip" }, "south");
    expect(e.getView("judge").players.south.life.map((c) => c?.instanceId)).toEqual(before);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
