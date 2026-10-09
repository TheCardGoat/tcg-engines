import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-041 Wang Zhi", () => {
  test("pays a hand card and lets the opponent order all their base-cost-one Characters", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-041", "EB01-025"], activeDon: 4 },
      { character: ["EB01-005", "OP01-006", "OP15-107"], deck: ["EB01-025"] },
    );
    const doma = e.findCardInZone("north", "character", "EB01-005");
    const otama = e.findCardInZone("north", "character", "OP01-006");
    e.playCard("OP17-041");
    e.acceptLeadingOptional("south");
    e.pendingDecision("effectReturnToDeckOwnerOrder", "north");
    e.resolveDecision("effectReturnToDeckOwnerOrder", { selectedIds: [otama, doma] }, "north");
    expect(
      e
        .getView("south")
        .players.north.characters.filter(Boolean)
        .map((c) => c?.cardId),
    ).toEqual(["OP15-107"]);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("EB01-025");
    e.endTurn("south");
    e.endTurn("north");
    e.endTurn("south");
    expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(otama);
    expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).not.toContain(doma);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("declines the payment and later blocks an attack", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP17-041", "OP17-005"], activeDon: 4 }, {});
    e.playCard("OP17-041");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const wang = e.findCardInZone("south", "character", "OP17-041");
    e.endTurn("south");
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("battleBlocker", { selectedIds: [wang] }, "south");
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(
      e.getView("south").players.south.characters.some((c) => c?.instanceId === wang && c.rested),
    ).toBe(true);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("OP17-005");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
