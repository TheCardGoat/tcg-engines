import { describe, expect, it } from "vitest";

import { projectDeckIdentityMembers } from "./metadata.js";

describe("projectDeckIdentityMembers", () => {
  it("uses all members of the first populated type and keeps card order", () => {
    const cards = projectDeckIdentityMembers([
      { type: "color", members: [] },
      { type: "legend", members: [{ cardId: "a" }] },
      { type: "legend", members: [{ cardId: "b" }, { cardId: "a" }] },
      { type: "legend-lineup", members: [{ cardId: "c" }] },
    ]);
    expect(cards.map((card) => card.cardId)).toEqual(["a", "b"]);
  });
});
