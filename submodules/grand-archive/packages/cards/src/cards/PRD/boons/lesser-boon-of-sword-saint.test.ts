import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  deriveGrandArchiveNumericProperty,
  type GrandArchivePantheonPlayerSetup,
} from "@tcg/grand-archive-engine/runtime";
import { lesserBoonOfSwordSaint } from "./lesser-boon-of-sword-saint.ts";
import { greaterBoonOfHorses } from "../../PP1/boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../../PP1/tokens/pantheon-barrier.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { intricateLongbow } from "../../AMB/weapons/intricate-longbow.ts";
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
function material(game: GrandArchiveTestEngine, playerId: string) {
  for (let i = 0; i < 256; i++) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice") {
      if (wait.playerId === playerId) return;
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    } else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("No materialization");
}
/** @covers OSsRmNoETv-a1 @covers OSsRmNoETv-a2 */
describe("Lesser Boon of Sword Saint — Sword power and entry durability", () => {
  for (const sword of [false, true])
    it(`Sword=${sword}`, () => {
      const champion = enableAllTestElements(lineageTestChampion("Sword Boon", 0)),
        probe = sword ? trainingSword : intricateLongbow;
      const player = (id: string): GrandArchivePantheonPlayerSetup => ({
        id,
        name: id,
        startingChampionDefinitionId: champion.canonicalId,
        mainDeck: [{ definitionId: favorableWinds.canonicalId, count: 40 }],
        materialDeck: [
          { definitionId: champion.canonicalId, count: 1 },
          { definitionId: trainingSword.canonicalId, count: sword ? 2 : 1 },
          ...(!sword ? [{ definitionId: intricateLongbow.canonicalId, count: 1 }] : []),
        ],
        pantheon: {
          lesserBoonDefinitionId: lesserBoonOfSwordSaint.canonicalId,
          greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
          barrierDefinitionId: pantheonBarrier.canonicalId,
        },
      });
      const game = GrandArchiveTestEngine.start(
        [
          champion,
          ...(!sword ? [probe] : []),
          trainingSword,
          lesserBoonOfSwordSaint,
          greaterBoonOfHorses,
          pantheonBarrier,
          favorableWinds,
        ],
        {
          mode: "pantheon",
          randomSeed: 43,
          firstPlayerId: "player-one",
          players: [player("player-one"), player("player-two"), player("player-three")],
        },
        { validateDeckConstruction: false, skipPregameForTests: true },
      );
      const p = game.player("player-one"),
        q = game.player("player-two"),
        boon = p.card(lesserBoonOfSwordSaint, { zone: "pantheon" });
      material(game, p.id);
      const old = p.cards(trainingSword, { zone: "material-deck" })[0]!;
      p.materialize(old);
      passEffectsStack(game);
      advanceToMain(game, p.id);
      const power = (id: typeof old.objectId) =>
        deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      expect(power(old.objectId)).toBe(1);
      expect(game.state.objects[old.objectId]!.counters.durability).toBe(2);
      for (let i = 0; i < 3; i++) advanceToMain(game, p.id, game.state.turn.number);
      const pay = p
        .cards(favorableWinds, { zone: "hand" })
        .slice(0, 3)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() =>
        p.execute({ move: "bestow-boon", cardId: boon.objectId, reservePayment: pay.slice(0, 2) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.execute({ move: "bestow-boon", cardId: boon.objectId, reservePayment: pay });
      passEffectsStack(game);
      expect(power(old.objectId)).toBe(2);
      expect(game.state.objects[old.objectId]!.counters.durability).toBe(2);
      material(game, p.id);
      const entered = p.cards(probe, { zone: "material-deck" })[0]!;
      p.materialize(entered);
      passEffectsStack(game);
      expect(game.state.objects[entered.objectId]!.counters.durability).toBe(sword ? 3 : 4);
      expect(power(entered.objectId)).toBe(sword ? 2 : 1);
      advanceToMain(game, q.id);
      const [action, payment] = q.cards(favorableWinds, { zone: "hand" });
      q.activate(action!, { reservePayment: [{ kind: "card", cardId: payment!.objectId }] });
      passEffectsStack(game);
      material(game, q.id);
      const enemy = q.cards(probe, { zone: "material-deck" })[0]!;
      q.materialize(enemy);
      passEffectsStack(game);
      expect(game.state.objects[enemy.objectId]!.counters.durability).toBe(sword ? 2 : 4);
      expect(power(enemy.objectId)).toBe(1);
    });
});
