import { describe, expect, it } from "vite-plus/test";

import { playerIdsForWho } from "./helpers.ts";
import type { FabEvalContext } from "../rules-view.ts";

const context = {
  controllerId: "p1",
  facts: {
    playerIds: ["p1", "p2"],
    heroRefs: {
      p1: { instanceId: "h1", incarnation: 0 },
      p2: { instanceId: "h2", incarnation: 0 },
    },
    combat: { attackingPlayerId: "p1", defendingPlayerId: "p2" },
  },
  bindings: { strings: { "iteration-subject": "p2" } },
} as unknown as FabEvalContext;

describe("playerIdsForWho", () => {
  it("maps controller/self to the controller seat, not the word", () => {
    expect(playerIdsForWho("controller", context)).toEqual(["p1"]);
    expect(playerIdsForWho("self", context)).toEqual(["p1"]);
  });

  it("maps opponent and each to seats, not the word", () => {
    expect(playerIdsForWho("opponent", context)).toEqual(["p2"]);
    expect(playerIdsForWho("each", context)).toEqual(["p1", "p2"]);
  });

  it("uses seated playerIds even when a seat has no hero object", () => {
    const noHero = {
      ...context,
      facts: {
        ...context.facts,
        playerIds: ["p1", "p2"],
        heroRefs: { p1: { instanceId: "h1", incarnation: 0 } },
      },
    } as unknown as FabEvalContext;
    expect(playerIdsForWho("opponent", noHero)).toEqual(["p2"]);
    expect(playerIdsForWho("each", noHero)).toEqual(["p1", "p2"]);
  });

  it("fails closed for unimplemented words instead of defaulting to opponent", () => {
    expect(playerIdsForWho("winner", context)).toEqual([]);
  });

  it("maps defending-hero and attacking-hero from combat facts", () => {
    expect(playerIdsForWho("defending-hero", context)).toEqual(["p2"]);
    expect(playerIdsForWho("attacking-hero", context)).toEqual(["p1"]);
  });

  it("maps target-controller from the stamped string binding", () => {
    const withTarget = {
      ...context,
      bindings: { strings: { "target-controller": "p2" } },
    } as unknown as FabEvalContext;
    expect(playerIdsForWho("target-controller", context)).toEqual([]);
    expect(playerIdsForWho("target-controller", withTarget)).toEqual(["p2"]);
  });
});
