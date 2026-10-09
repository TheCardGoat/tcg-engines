import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("OP17 permanent clauses", () => {
  test.each(["yes", "no"])("Marco protects another Character: %s", (answer) => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP03-057"], activeDon: 4 },
      { character: ["OP17-015", "EB01-005"], hand: [] },
    );
    const target = e.findCardInZone("north", "character", "EB01-005");
    const marco = e.findCardInZone("north", "character", "OP17-015");
    e.asSouth().play("OP03-057");
    e.asSouth().chooseTargets(target);
    e.resolveDecision("effectRemovalReplacement", { optionId: answer }, "north");
    const v = e.getView("north");
    expect(v.players.north.characters.some((c) => c?.instanceId === target)).toBe(answer === "yes");
    expect(v.players.north.trash.some((c) => c.instanceId === marco)).toBe(answer === "yes");
  });
  test.each([0, 1, 2, 3])("Kyo pays two hand cards with %i available", (count) => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP03-057"], activeDon: 4 },
      {
        character: ["OP17-045", "EB01-005"],
        hand: ["EB01-005", "EB01-025", "OP15-107"].slice(0, count),
      },
    );
    const target = e.findCardInZone("north", "character", "EB01-005");
    const payment = e
      .getView("north")
      .players.north.hand.slice(0, 2)
      .map((c) => c.instanceId!);
    e.asSouth().play("OP03-057");
    e.asSouth().chooseTargets(target);
    if (count >= 2) {
      e.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "north");
      if (count > 2)
        e.resolveDecision("effectTrashFromHandSelection", { selectedIds: payment }, "north");
    }
    const v = e.getView("north");
    expect(v.players.north.characters.some((c) => c?.instanceId === target)).toBe(count >= 2);
    expect(v.players.north.hand).toHaveLength(count >= 2 ? count - 2 : count);
    expect(v.prompts).toHaveLength(0);
  });
  test.each([true, false])("Kaido Counter aura only on field: %s", (onField) => {
    const e = OnePieceTestEngine.create(
      {},
      {
        character: onField ? ["OP17-063"] : [],
        hand: onField ? ["OP17-045", "EB01-005"] : ["OP17-063", "OP17-045", "EB01-005"],
      },
    );
    const target = e.findCardInZone("north", "hand", "OP17-045");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    const step = e.pendingDecision("battleCounter", "north").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Counter choice");
    expect(step.candidates.find((c) => c.ref.id === target)?.legal).toBe(onField);
    if (!onField)
      expect(() =>
        e.resolveDecision("battleCounter", { selectedIds: [target] }, "north"),
      ).toThrow();
    if (onField) {
      e.resolveDecision("battleCounter", { selectedIds: [target] }, "north");
      expect(e.getView("north").players.north.lifeCount).toBe(4);
    }
  });
  test.each([[], ["OP17-045"], ["OP17-045", "EB01-005"]])(
    "Xebec Counter condition: %j",
    (...cards: string[]) => {
      const e = OnePieceTestEngine.create({}, { character: cards, hand: ["OP17-118", "EB01-005"] });
      const target = e.findCardInZone("north", "hand", "OP17-118");
      e.asSouth().attack(e.leader("south"), e.leader("north"));
      const step = e.pendingDecision("battleCounter", "north").steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected Counter choice");
      const qualifies = cards.length > 0 && !cards.includes("EB01-005");
      expect(step.candidates.find((c) => c.ref.id === target)?.legal).toBe(qualifies);
      if (!qualifies)
        expect(() =>
          e.resolveDecision("battleCounter", { selectedIds: [target] }, "north"),
        ).toThrow();
      if (qualifies) {
        e.resolveDecision("battleCounter", { selectedIds: [target] }, "north");
        e.asNorth().chooseCounter();
        expect(e.getView("north").players.north.lifeCount).toBe(4);
      }
    },
  );
  test.each([true, false])("Kaido K.O. stays bound to the negated target: %s", (select) => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-063"], activeDon: 10 },
      { character: ["EB01-005", "OP17-118"] },
    );
    const target = e.findCardInZone("north", "character", "EB01-005");
    e.asSouth().play("OP17-063");
    e.asSouth().activateMain("OP17-063");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectTargetSelection", { selectedIds: select ? [target] : [] }, "south");
    const v = e.getView("north");
    expect(v.players.north.trash.some((c) => c.instanceId === target)).toBe(select);
    expect(v.players.north.characters.some((c) => c?.cardId === "OP17-118")).toBe(true);
    expect(v.prompts).toHaveLength(0);
  });
  test.each([
    ["OP17-063", "OP17-063"],
    ["OP16-118", "OP17-063"],
    ["OP17-063", "OP16-118"],
  ])("Counter grants do not add together: %j", (...characters: string[]) => {
    const e = OnePieceTestEngine.create(
      { activeDon: 2 },
      { character: characters, hand: ["OP16-014"] },
    );
    e.asSouth().attachDon(e.leader("south"), characters.includes("OP16-118") ? 2 : 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseCounter("OP16-014");
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });

  test.each(["OP16-118", "OP17-063"])(
    "%s does not boost an unmatched printed +1000 Counter",
    (source) => {
      const e = OnePieceTestEngine.create(
        { activeDon: 1 },
        { character: [source], hand: ["EB01-005"] },
      );
      e.asSouth().attachDon(e.leader("south"), 1);
      e.asSouth().attack(e.leader("south"), e.leader("north"));
      e.asNorth().chooseCounter("EB01-005");
      expect(e.getView("north").players.north.lifeCount).toBe(3);
    },
  );
  test("OP17-063 can decline its optional DON cost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-063"], activeDon: 10 },
      { character: ["EB01-005"] },
    );
    e.asSouth().play("OP17-063");
    e.asSouth().activateMain("OP17-063");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.restedDon).toBe(10);
    expect(e.getView("north").players.north.characters.some((c) => c?.cardId === "EB01-005")).toBe(
      true,
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("OP17-015 can decline its optional On K.O. replay cost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP03-057"], activeDon: 4 },
      { character: ["OP17-015", "EB01-005"], hand: ["OP16-004"] },
    );
    e.asSouth().play("OP03-057");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "EB01-005"));
    e.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "north");
    e.asNorth().declineOptional();
    const v = e.getView("north");
    expect(v.players.north.trash.some((c) => c.cardId === "OP17-015")).toBe(true);
    expect(v.players.north.hand.map((c) => c.cardId)).toEqual(["OP16-004"]);
    expect(v.prompts).toHaveLength(0);
  });
});
