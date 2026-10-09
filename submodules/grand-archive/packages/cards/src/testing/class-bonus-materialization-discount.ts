import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

export function proveClassBonusMaterializationDiscount(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  linked = false,
): void {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "memory") throw new Error("Expected memory cost");
  const printedCost = face.cost.amount;
  if (typeof printedCost !== "number") throw new Error("Expected fixed memory cost");
  for (const championClass of ["SPIRIT" as const, ...face.typeLine.classes])
    for (let memory = 0; memory <= printedCost + 1; memory++)
      it(`class=${championClass}, available memory=${memory}: pays exact materialization cost`, () => {
        const base = createClassBonusTestChampion(card, true, "activation-discount");
        const baseFace = requireSingleFace(base);
        const champion = enableAllTestElements({
          ...base,
          layout: {
            kind: "single-faced",
            face: {
              ...baseFace,
              typeLine: {
                ...baseFace.typeLine,
                classes: [championClass],
                subtypes: [championClass],
              },
            },
          },
        });
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              "material-deck": [card],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
              field: linked ? [woodlandSquirrels] : [],
              memory: Array.from({ length: memory }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: enableAllTestElements(
              createClassBonusTestChampion(card, true, "floating-memory"),
            ),
            zones: { memory: [woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const ownMemory = p.zone("memory"),
          opponentMemory = q.zone("memory");
        const host = linked ? p.card(woodlandSquirrels, { zone: "field" }) : undefined;
        const declaration = host ? { targets: { "intrinsic-link-target": [host.objectId] } } : {};
        const cost = printedCost - (championClass === "SPIRIT" ? 0 : 1);
        if (memory < cost) {
          const before = game.state;
          expect(() => p.materialize(card, declaration)).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        p.materialize(card, declaration);
        expect(p.zone("memory")).toHaveLength(memory - cost);
        expect(p.zone("banishment")).toHaveLength(cost);
        for (const paid of p.zone("banishment"))
          expect(ownMemory.map((c) => c.objectId)).toContain(paid.objectId);
        expect(q.zone("memory")).toEqual(opponentMemory);
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        const materialized = p.card(card, { zone: "field" });
        if (host) expect(game.state.objects[materialized.objectId]?.hostId).toBe(host.objectId);
        expect(p.zone("material-deck")).toHaveLength(0);
      });
}
