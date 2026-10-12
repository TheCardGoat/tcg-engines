import { expect, test } from "vite-plus/test";
import { cardDestination } from "./card-destination";
test("reveal-only selection stays in its current zone", () => {
  expect(cardDestination([{ type: "revealCards", target: { type: "selected" } }])).toEqual({
    label: { key: "Current zone · reveal only" },
    confirmText: { key: "Reveal card" },
    staysInZone: true,
  });
});
test("revealing before a printed transfer describes that separate destination", () => {
  expect(
    cardDestination([
      { type: "revealCards", target: { type: "selected" } },
      { type: "returnToHand", target: { type: "selected" } },
    ])?.label.key,
  ).toBe("Hand");
});
test("counter transfers do not become card transfers", () => {
  expect(cardDestination([{ type: "draw", controller: "friendly", amount: 1 }])).toBeUndefined();
});
