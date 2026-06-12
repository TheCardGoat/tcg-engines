import { describe, expect, it } from "bun:test";

import { evaluateOptionalResolutionPolicy } from "./resolve-policy-inventory.js";

describe("evaluateOptionalResolutionPolicy", () => {
  it("does not match a policy when required ability metadata is missing", () => {
    expect(
      evaluateOptionalResolutionPolicy({
        actorHandCardIds: [],
        actorHandSize: 5,
        actorUninkableHandCount: 0,
        allActorHandCardsUninkable: false,
        sourceDefinitionId: "qUy",
      }),
    ).toBeUndefined();
  });

  it("matches a policy when the required ability name is present", () => {
    expect(
      evaluateOptionalResolutionPolicy({
        abilityName: "DRASTIC MEASURES",
        actorHandCardIds: [],
        actorHandSize: 5,
        actorUninkableHandCount: 0,
        allActorHandCardsUninkable: false,
        sourceDefinitionId: "qUy",
      }),
    ).toEqual({
      accept: false,
      id: "doc-bold-knight:drastic-measures",
      reason: "keep-larger-inkable-hand",
    });
  });
});
