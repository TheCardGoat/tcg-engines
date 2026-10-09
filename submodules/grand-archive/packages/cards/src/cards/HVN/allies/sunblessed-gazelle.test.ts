import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  type GrandArchivePantheonPlayerSetup,
  deriveGrandArchiveNumericProperty,
} from "@tcg/grand-archive-engine/runtime";
import { sunblessedGazelle } from "./sunblessed-gazelle.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { greaterBoonOfHorses } from "../../PP1/boons/greater-boon-of-horses.ts";
import { lesserBoonOfApollo } from "../../PP1/boons/lesser-boon-of-apollo.ts";
import { pantheonBarrier } from "../../PP1/tokens/pantheon-barrier.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 4ilomec3u3-a3 */
describe("Sunblessed Gazelle", () => {
  it("tracks the highest opposing influence as different opponents spend their hands", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(sunblessedGazelle, true, "activation-discount"),
    );
    const player = (id: string): GrandArchivePantheonPlayerSetup => ({
      id,
      name: id,
      startingChampionDefinitionId: champion.canonicalId,
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      mainDeck: [
        {
          definitionId:
            id === "player-one" ? sunblessedGazelle.canonicalId : woodlandSquirrels.canonicalId,
          count: 20,
        },
      ],
      pantheon: {
        lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
        greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
        barrierDefinitionId: pantheonBarrier.canonicalId,
      },
    });
    const game = GrandArchiveTestEngine.start(
      [
        champion,
        sunblessedGazelle,
        woodlandSquirrels,
        lesserBoonOfApollo,
        greaterBoonOfHorses,
        pantheonBarrier,
      ],
      {
        mode: "pantheon",
        firstPlayerId: "player-one",
        randomSeed: 22,
        players: [player("player-one"), player("player-two"), player("player-three")],
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p = game.player("player-one"),
      q = game.player("player-two"),
      r = game.player("player-three");
    for (let round = 0; round < 3; round++) advanceToMain(game, p.id, game.state.turn.number);
    const [source, ...payments] = p.cards(sunblessedGazelle, { zone: "hand" });
    if (!source) throw new Error("Expected a drawn Gazelle");
    p.activate(source, {
      reservePayment: payments.slice(0, 2).map((ref) => ({ kind: "card", cardId: ref.objectId })),
    });
    passEffectsStack(game);
    const influence = (id: string) =>
      game.player(id).zone("hand").length + game.player(id).zone("memory").length;
    const check = () =>
      expect(
        deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "life", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        }),
      ).toBe(1 + Math.max(influence(q.id), influence(r.id)));
    check();
    for (const opponent of [q, r]) {
      advanceToMain(game, opponent.id);
      check();
      for (const card of opponent.cards(woodlandSquirrels, { zone: "hand" })) {
        opponent.activate(card);
        passEffectsStack(game);
        check();
      }
    }
    expect(influence(q.id)).toBe(0);
    expect(influence(r.id)).toBe(0);
    expect(influence(p.id)).toBeGreaterThan(0);
    check();
  });
});
