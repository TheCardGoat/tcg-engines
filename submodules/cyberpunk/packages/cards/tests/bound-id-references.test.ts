import { describe, expect, it } from "vite-plus/test";
import type { Ability } from "@tcg/cyberpunk-types";

import { structuredCards } from "../src/index.ts";

/**
 * Ability authoring lets you declare a binding once and reference it many times:
 *
 *   bindings: [{ id: "selectedUnit", target: { ... } }]
 *   ...later in effects/costs/conditions/trigger:
 *   { selector: "bound", id: "selectedUnit" }
 *
 * The two strings must match. The engine resolves bound references at runtime
 * and silently returns an empty target set if the id is unknown — typos
 * don't throw, they just no-op the ability. This test catches that drift
 * statically by walking every ability and verifying every reference resolves.
 */

interface BoundRef {
  cardSlug: string;
  abilityIndex: number;
  abilityText: string;
  refId: string;
  declaredIds: string[];
}

/**
 * Walk an arbitrary value tree and yield every `{ selector: "bound", id: string }`
 * occurrence. The shape is unambiguous: a binding *declaration* (`{ id, target }`
 * inside `Ability.bindings`) has no `selector` field, so generic walking can't
 * confuse the two.
 */
function* findBoundRefs(node: unknown): Generator<string> {
  if (node === null || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const item of node) yield* findBoundRefs(item);
    return;
  }
  const obj = node as Record<string, unknown>;
  if (obj["selector"] === "bound" && typeof obj["id"] === "string") {
    yield obj["id"];
  }
  for (const value of Object.values(obj)) yield* findBoundRefs(value);
}

function collectAbilityBoundRefs(
  ability: Ability,
  cardSlug: string,
  abilityIndex: number,
): BoundRef[] {
  const declaredIds = ability.bindings?.map((b) => b.id) ?? [];

  const refs: BoundRef[] = [];
  for (const refId of findBoundRefs({
    trigger: ability.trigger,
    costs: ability.costs,
    conditions: ability.conditions,
    effects: ability.effects,
  })) {
    refs.push({
      cardSlug,
      abilityIndex,
      abilityText: ability.text,
      refId,
      declaredIds,
    });
  }
  return refs;
}

describe("bound-id reference integrity", () => {
  it('every `selector: "bound"` reference resolves to a declared binding in the same ability', () => {
    const unresolved: BoundRef[] = [];
    for (const card of structuredCards) {
      const abilities = card.abilities as Ability[];
      for (const [i, ability] of abilities.entries()) {
        const refs = collectAbilityBoundRefs(ability, card.slug, i);
        for (const ref of refs) {
          if (!ref.declaredIds.includes(ref.refId)) unresolved.push(ref);
        }
      }
    }
    expect(unresolved).toEqual([]);
  });

  it("every declared binding is referenced at least once", () => {
    const orphaned: Array<{
      cardSlug: string;
      abilityIndex: number;
      bindingId: string;
    }> = [];
    for (const card of structuredCards) {
      const abilities = card.abilities as Ability[];
      for (const [i, ability] of abilities.entries()) {
        if (!ability.bindings || ability.bindings.length === 0) continue;
        const referenced = new Set(
          findBoundRefs({
            trigger: ability.trigger,
            costs: ability.costs,
            conditions: ability.conditions,
            effects: ability.effects,
          }),
        );
        for (const binding of ability.bindings) {
          if (!referenced.has(binding.id)) {
            orphaned.push({ cardSlug: card.slug, abilityIndex: i, bindingId: binding.id });
          }
        }
      }
    }
    expect(orphaned).toEqual([]);
  });
});
