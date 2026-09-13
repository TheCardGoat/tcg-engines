import { describe, expect, it } from "vitest";
import type { FabCardDefinitionInput } from "./cards.ts";
import { registerFabCardDefinition } from "./cards.ts";

function definitionWithTrigger(event: unknown): FabCardDefinitionInput {
  return {
    canonicalId: "trigger-admission-fixture",
    name: "Trigger Admission Fixture",
    types: ["Action"],
    abilities: [
      {
        id: "fixture-a1",
        kind: "static",
        staticKind: "triggered",
        trigger: { kind: "event", event },
        resolution: {
          kind: "effect",
          effect: { type: "draw", count: 1, player: "controller" },
        },
      } as never,
    ],
  };
}

describe("FAB trigger-program runtime admission", () => {
  it("admits an event-specific plural observation", () => {
    expect(() =>
      registerFabCardDefinition(
        definitionWithTrigger({
          name: "fuse",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-objects",
            selector: "revealed-cards",
            relationship: { kind: "controller", player: "ability-controller" },
            quantifier: "all",
          },
        }),
      ),
    ).not.toThrow();
  });

  it.each([
    [
      "wrong event constraint",
      {
        name: "draw",
        actor: { kind: "any" },
        observes: { kind: "none" },
        damageType: "arcane",
      },
      "draw does not support constraint damageType",
    ],
    [
      "wrong selector",
      {
        name: "draw",
        actor: { kind: "any" },
        observes: {
          kind: "event-object",
          selector: "damage-source",
          relationship: { kind: "any" },
        },
      },
      "draw does not expose damage-source",
    ],
    [
      "wrong plural selector",
      {
        name: "fuse",
        actor: { kind: "any" },
        observes: {
          kind: "event-objects",
          selector: "fused-card",
          relationship: { kind: "any" },
          quantifier: "any",
        },
      },
      "fuse does not expose fused-card as a event-objects selector",
    ],
    [
      "wrong actor relationship",
      {
        name: "attack",
        actor: { kind: "player", player: "owner" },
        observes: { kind: "none" },
      },
      "unsupported relative player owner",
    ],
  ])("rejects %s", (_label, event, reason) => {
    expect(() => registerFabCardDefinition(definitionWithTrigger(event))).toThrow(reason);
  });
});
