/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: keyword:legendary
 * Representative card: packages/cards/src/cards/resources/eye-of-ophidia.ts
 * Canonical id: N77hdGp96fNQnzc79hqN9
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { baseHasKeyword, toFabCardDefinition } from "../../../../index.ts";
import { eyeOfOphidiaBlue } from "../../../fixtures.ts";

describe("keyword: legendary", () => {
  it("AAA — Arrange: real Eye of Ophidia (legendary resource); Act: inspect keyword registration; Assert: legendary meta-keyword registers on the production card definition", () => {
    expect(baseHasKeyword(toFabCardDefinition(eyeOfOphidiaBlue), "legendary")).toBe(true);
  });
});
