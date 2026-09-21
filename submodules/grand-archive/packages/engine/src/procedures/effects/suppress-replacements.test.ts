import { poisonousBreezecap, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";
import { observeGrandArchiveCommittedEvent } from "../../kernel/observed-events.ts";

function fixtureCard(
  id: string,
  type: "ACTION" | "CHAMPION" | "ITEM",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["SPIRIT"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}
const champion = fixtureCard("suppress-replacement-champion", "CHAMPION");
const ordinary = fixtureCard("suppress-replacement-item", "ITEM");
const action = fixtureCard("suppress-replacement-action", "ACTION", [
  {
    id: "suppressFixture-a1",
    kind: "card-resolution",
    text: "Suppress each item you control. Put a buff counter on each item suppressed this way.",
    effect: {
      kind: "sequence",
      effects: [
        {
          kind: "keyword-action",
          action: "suppress",
          subject: {
            kind: "each",
            collection: {
              zones: ["field"],
              player: "controller",
              filter: { kind: "type", oneOf: ["ITEM"] },
            },
          },
          bindResultAs: "suppressed",
        },
        {
          kind: "add-counter",
          subject: { kind: "bound", binding: "suppressed" },
          counter: "buff",
          amount: 1,
        },
      ],
    },
  },
]);
function settle(game: GrandArchiveTestEngine) {
  for (let i = 0; i < 64 && game.state.stack.length && !game.state.decision; i++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
}
describe("Suppression replacement admission", () => {
  for (const sacrificeFirst of [false, true])
    it(`resumes each object independently and binds only actual suppressions, sacrifice first=${sacrificeFirst}`, () => {
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [poisonousBreezecap, poisonousBreezecap, ordinary],
            hand: [action],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { memory: [woodlandSquirrels, woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        caps = p.cards(poisonousBreezecap),
        item = p.card(ordinary);
      p.activate(action);
      settle(game);
      for (const accept of [sacrificeFirst, !sacrificeFirst]) {
        const decision = game.state.decision;
        if (!decision || decision.kind !== "choose-replacement")
          throw new Error("Expected optional suppression replacement");
        expect(decision.playerId).toBe(p.id);
        p.execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: accept,
        });
        settle(game);
      }
      expect(game.state.decision).toBeNull();
      const sacrificed = caps[sacrificeFirst ? 0 : 1]!,
        suppressed = caps[sacrificeFirst ? 1 : 0]!;
      expect(game.state.objects[sacrificed.objectId]!.zone).toBe("graveyard");
      expect(game.state.objects[sacrificed.objectId]!.counters.buff ?? 0).toBe(0);
      for (const object of [suppressed, item]) {
        expect(game.state.objects[object.objectId]!.zone).toBe("banishment");
        expect(game.state.objects[object.objectId]!.counters.buff).toBe(1);
      }
      expect(game.state.delayedTriggers).toHaveLength(2);
      expect(q.zone("memory")).toHaveLength(1);
      const observations = game.state.eventHistory
        .flatMap(observeGrandArchiveCommittedEvent)
        .filter((e) => e.name === "keyword-action-performed" && e.keywordAction === "suppress");
      expect(observations.map((e) => e.subjectId).sort()).toEqual(
        [suppressed.objectId, item.objectId].sort(),
      );
    });
});
