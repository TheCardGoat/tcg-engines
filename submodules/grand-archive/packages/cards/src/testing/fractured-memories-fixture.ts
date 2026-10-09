import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { fracturedMemories } from "../cards/P25/masteries/fractured-memories.ts";
import { merlinMemoriteVassal } from "../cards/PTM/champions/merlin-memorite-vassal.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
/** Gain mastery through Merlin's materialization and entry effect before the test action. */
export function fracturedMemoriesFixture(
  hand: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
  definitions: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[] = [],
  materialDeck: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[] = [],
) {
  const starter = lineageTestChampion("Merlin", 0),
    merlin = enableAllTestElements(merlinMemoriteVassal),
    opponent = lineageTestChampion("Opponent", 0);
  const game = GrandArchiveTestEngine.startFixture({
    definitions: [fracturedMemories, ...definitions],
    phase: "materialize",
    playerOne: {
      champion: starter,
      zones: {
        "material-deck": [merlin, ...materialDeck],
        field: [giantTortoise],
        memory: [woodlandSquirrels],
        hand: [...hand, ...Array.from({ length: 20 }, () => woodlandSquirrels)],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: opponent,
      zones: {
        field: [giantTortoise],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  p.materialize(merlin);
  passEffectsStack(game);
  answerDecision(game, "resolve-optional-effect", false);
  passEffectsStack(game);
  advanceToMain(game, p.id);
  return {
    game,
    p,
    q,
    hero: p.card(starter),
    foe: q.card(opponent),
    pay: (n: number) =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, n)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
  };
}
