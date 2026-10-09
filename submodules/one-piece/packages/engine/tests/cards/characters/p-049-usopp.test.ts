import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-049 Usopp", () => {
  test.each(["top", "bottom"])("privately orders all five at %s across a snapshot", (end) => {
    let e = OnePieceTestEngine.create({
      hand: ["P-049"],
      activeDon: 2,
      deck: ["ST02-002", "ST02-006", "ST02-012", "ST01-011", "ST01-006", "ST14-012"],
    });
    const original = e.getState().players.south.deck.slice();
    e.asSouth().play("P-049");
    const p = e.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    if (p?.kind !== "orderItems") throw Error("order");
    const ids = p.candidates.map((c) => c.ref.id).reverse();
    expect(ids).toEqual(original.slice(0, 5).reverse());
    expect(
      e.getView("north").decisions.some((d) => d.steps.some((s) => s.kind === "orderItems")),
    ).toBe(false);
    e.asSouth().orderCards("effectRearrangeDeckOrder", ids);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectRearrangeDeckPosition", { optionId: end }, "south");
    expect(e.getState().players.south.deck).toEqual(
      end === "top" ? [...ids, original[5]] : [original[5], ...ids],
    );
    expect(e.getView("south").players.south.deckCount).toBe(6);
  });
  test("looks at a short deck without causing empty-deck defeat", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-049"],
      activeDon: 2,
      deck: ["ST02-002", "ST02-006"],
    });
    e.asSouth().play("P-049");
    const p = e.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    if (p?.kind !== "orderItems") throw Error("order");
    expect(p.candidates).toHaveLength(2);
    e.asSouth().orderCards(
      "effectRearrangeDeckOrder",
      p.candidates.map((c) => c.ref.id),
    );
    e.resolveDecision("effectRearrangeDeckPosition", { optionId: "top" }, "south");
    expect(e.getView("south").status).toBe("active");
  });
});
