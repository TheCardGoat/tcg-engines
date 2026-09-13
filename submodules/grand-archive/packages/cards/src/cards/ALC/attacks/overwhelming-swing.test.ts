import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { overwhelmingSwing } from "./overwhelming-swing.ts";

function materialChampion(level: 1 | 2, classMatches: boolean) {
  const base = lineageTestChampion("Overwhelming", level);
  if (base.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  const championClass = classMatches ? "GUARDIAN" : "MAGE";
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        typeLine: {
          ...base.layout.face.typeLine,
          classes: [championClass],
          subtypes: [championClass],
        },
        elements: ["NORM", "FIRE"] as const,
      },
    },
  } satisfies GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;
}

function preventingChampion() {
  const base = lineageTestChampion("Preventing defender", 0);
  if (base.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        rulesText: "If damage would be dealt to this champion, prevent 3 of that damage.",
        abilities: [
          {
            id: "overwhelming-prevention-a1",
            kind: "static" as const,
            staticKind: "effects" as const,
            text: "If damage would be dealt to this champion, prevent 3 of that damage.",
            effects: [
              {
                kind: "replacement" as const,
                event: { name: "damage-dealt" as const, recipient: { kind: "source" as const } },
                operation: { kind: "prevent" as const, amount: 3 },
                duration: { kind: "while-source-in-functional-zone" as const },
              },
            ],
          },
        ],
      },
    },
  } satisfies GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;
}

/** @covers aebjvwbciz-a1 */
describe("Overwhelming Swing — restricted unpreventable combat damage", () => {
  for (const [level, classMatches, expectedDamage] of [
    [2, true, 5],
    [1, true, 2],
    [2, false, 2],
  ] as const) {
    it(`level=${level}, class match=${classMatches}, damage=${expectedDamage}`, () => {
      const starter = lineageTestChampion("Overwhelming", 0);
      const activeChampion = materialChampion(level, classMatches);
      const defender = preventingChampion();
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion: starter,
          lineage: level === 2 ? [lineageTestChampion("Overwhelming", 1)] : [],
          zones: {
            "material-deck": [activeChampion],
            memory: Array.from({ length: level }, () => woodlandSquirrels),
            hand: [overwhelmingSwing, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: defender,
          zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const attacker = player.card(starter);
      const target = opponent.card(defender);
      player.materialize(activeChampion);
      player.pass();
      opponent.pass();
      for (let step = 0; game.state.turn.phase !== "main" && step < 32; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      player.activate(overwhelmingSwing, {
        attackAttackerId: attacker.objectId,
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 6)
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      });
      expect(game.resolveStackUntilChoice()).toBe("decision");
      player.executeLegal(
        (candidate) =>
          candidate.command.move === "answer-decision" &&
          typeof candidate.command.answer === "object" &&
          candidate.command.answer !== null &&
          "attackerId" in candidate.command.answer &&
          candidate.command.answer.attackerId === attacker.objectId &&
          !("delegatePlayerId" in candidate.command.answer) &&
          "targetIds" in candidate.command.answer &&
          Array.isArray(candidate.command.answer.targetIds) &&
          candidate.command.answer.targetIds.includes(target.objectId),
        "declare Overwhelming Swing against the preventing champion",
      );
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(expectedDamage);
    });
  }
});
