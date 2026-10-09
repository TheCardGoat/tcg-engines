import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveClass,
} from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  type GrandArchivePantheonPlayerSetup,
  deriveGrandArchiveCharacteristics,
} from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
import { favorableWinds } from "../cards/DOA/actions/favorable-winds.ts";
import { greaterBoonOfHorses } from "../cards/PP1/boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../cards/PP1/tokens/pantheon-barrier.ts";

export function proveClassBoon(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  addedClass: GrandArchiveClass,
): void {
  it(`requires base level one, then adds ${addedClass} only to its controller's champion`, () => {
    const starter = enableAllTestElements(lineageTestChampion("Boon Fixture", 0)),
      levelOne = enableAllTestElements(lineageTestChampion("Boon Fixture", 1));
    const player = (id: string): GrandArchivePantheonPlayerSetup => ({
      id,
      name: id,
      startingChampionDefinitionId: starter.canonicalId,
      mainDeck: [{ definitionId: favorableWinds.canonicalId, count: 15 }],
      materialDeck: [
        { definitionId: starter.canonicalId, count: 1 },
        { definitionId: levelOne.canonicalId, count: 1 },
      ],
      pantheon: {
        lesserBoonDefinitionId: card.canonicalId,
        greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
        barrierDefinitionId: pantheonBarrier.canonicalId,
      },
    });
    const game = GrandArchiveTestEngine.start(
      [starter, levelOne, card, greaterBoonOfHorses, pantheonBarrier, favorableWinds],
      {
        mode: "pantheon",
        randomSeed: 43,
        firstPlayerId: "player-one",
        players: [player("player-one"), player("player-two"), player("player-three")],
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p = game.player("player-one"),
      boon = p.card(card, { zone: "pantheon" });
    const classes = (playerId: string) => {
      const player = game.player(playerId),
        hero = player.card(starter, { zone: "field" });
      return deriveGrandArchiveCharacteristics(game.state.objects[hero.objectId]!, {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      }).classes;
    };
    expect(classes(p.id)).toEqual(["SPIRIT"]);
    const before = game.state;
    expect(() => p.execute({ move: "bestow-boon", cardId: boon.objectId })).toThrow();
    expect(game.state).toEqual(before);
    // The minimal initializer skips opening draws; take two normal draw phases.
    advanceToMain(game, p.id, game.state.turn.number);
    advanceToMain(game, p.id, game.state.turn.number);
    const [ally, payment] = p.cards(favorableWinds, { zone: "hand" });
    p.activate(ally!, { reservePayment: [{ kind: "card", cardId: payment!.objectId }] });
    passEffectsStack(game);
    for (let step = 0; step < 128; step++) {
      const wait = game.waitState();
      if (wait.kind === "materialization-choice" && wait.playerId === p.id) break;
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind} before materialization`);
    }
    p.materialize(levelOne);
    passEffectsStack(game);
    advanceToMain(game, p.id);
    expect(classes(p.id)).toEqual(["SPIRIT"]);
    p.execute({ move: "bestow-boon", cardId: boon.objectId });
    passEffectsStack(game);
    expect(game.state.objects[boon.objectId]!.facing).toBe("face-up");
    expect(classes(p.id)).toEqual(expect.arrayContaining(["SPIRIT", addedClass]));
    expect(classes(p.id)).toHaveLength(2);
    expect(classes("player-two")).toEqual(["SPIRIT"]);
    expect(classes("player-three")).toEqual(["SPIRIT"]);
  });
}
