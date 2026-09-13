import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { baubleOfAbundance } from "../../DEMO22/items/bauble-of-abundance.ts";
import { platedBullet } from "../../P24/items/plated-bullet.ts";
import { tasershot } from "../../P24/items/tasershot.ts";
import { slateWhetstone } from "../../P24/items/slate-whetstone.ts";
import { freezingRound } from "../items/freezing-round.ts";
import { supplyDrone } from "./supply-drone.ts";

// A typed cost-boundary fixture isolates the printed zero-memory restriction.
// Catalog Bullet regalia currently use zero memory; this is not a coverage claim for another card.
const oneMemoryBullet: typeof platedBullet = {
  ...platedBullet,
  canonicalId: "supply-drone-one-memory-bullet",
  slug: "supply-drone-one-memory-bullet",
  layout: {
    kind: "single-faced",
    face: {
      ...(platedBullet.layout.kind === "single-faced"
        ? platedBullet.layout.face
        : platedBullet.layout.defaultFace),
      id: "supply-drone-one-memory-bullet:face:default",
      catalogId: "supply-drone-one-memory-bullet",
      name: "One-memory Bullet fixture",
      cost: { kind: "memory", amount: 1 },
      rulesText: "",
      abilities: [],
    },
  },
};

/** @covers ljyevpmu6g-a1 */
describe("Supply Drone — recollection materialization", () => {
  it("materializes a Bullet after the regular materialization was already used", () => {
    const champion = createClassBonusTestChampion(supplyDrone, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          field: [supplyDrone],
          "material-deck": [baubleOfAbundance, platedBullet, tasershot],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.materialize(baubleOfAbundance);
    passEffectsStack(game);
    expect(player.cards(baubleOfAbundance, { zone: "field" })).toHaveLength(1);
    for (let step = 0; game.state.turn.phase !== "recollection" && step < 16; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    expect(game.state.turn.phase).toBe("recollection");
    passEffectsStack(game);
    const bullet = player.card(platedBullet, { zone: "material-deck" });
    answerDecision(game, "resolve-effect-choice", [bullet.objectId]);
    answerDecision(game, "announce-effect-materialization", {});
    expect(game.state.stack.at(-1)).toMatchObject({
      kind: "materialization",
      cardId: bullet.objectId,
      materializationContext: "effect-instruction",
    });
    passEffectsStack(game);
    expect(player.cards(baubleOfAbundance, { zone: "field" })).toHaveLength(1);
    expect(player.cards(platedBullet, { zone: "field" })).toEqual([bullet]);
    expect(player.cards(tasershot, { zone: "material-deck" })).toHaveLength(1);
    expect(player.zone("memory")).toHaveLength(0);
  });
  for (const classBonus of [false, true]) {
    for (const available of [false, true]) {
      it(`Class Bonus=${classBonus}, eligible Bullets=${available}`, () => {
        const champion = createClassBonusTestChampion(
          supplyDrone,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [supplyDrone],
              hand: [platedBullet, freezingRound],
              graveyard: [platedBullet],
              memory: [woodlandSquirrels],
              "material-deck": [
                baubleOfAbundance,
                slateWhetstone,
                oneMemoryBullet,
                ...(available ? [platedBullet, tasershot] : []),
              ],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              "material-deck": [platedBullet],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        for (let index = 0; index < 2; index++) {
          const materialDeck = player.zone("material-deck");
          advanceToRecollection(game, opponent.id);
          expect(player.zone("material-deck")).toEqual(materialDeck);
          expect(game.state.stack).toHaveLength(0);
          advanceToRecollection(game, player.id);
          const memory = player.zone("memory");
          const hand = player.zone("hand");
          expect(
            game.state.stack.filter(
              (item) => item.kind === "triggered-ability" && item.ability.id === "ljyevpmu6g-a1",
            ),
          ).toHaveLength(classBonus ? 1 : 0);
          expect(player.zone("material-deck")).toEqual(materialDeck);
          passEffectsStack(game);
          if (classBonus && available) {
            const selected = player.card(index === 0 ? tasershot : platedBullet, {
              zone: "material-deck",
            });
            if (index === 0) {
              for (const invalid of [
                [],
                [player.card(baubleOfAbundance).objectId],
                [player.card(slateWhetstone).objectId],
                [player.card(oneMemoryBullet).objectId],
                [player.card(freezingRound).objectId],
                [opponent.card(platedBullet).objectId],
                [player.card(platedBullet, { zone: "hand" }).objectId],
                [player.card(platedBullet, { zone: "graveyard" }).objectId],
                [selected.objectId, player.card(platedBullet, { zone: "material-deck" }).objectId],
              ]) {
                const before = game.state;
                expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
                expect(game.state).toEqual(before);
              }
            }
            if (game.state.decision?.kind === "resolve-effect-choice")
              answerDecision(game, "resolve-effect-choice", [selected.objectId]);
            expect(game.state.decision).toMatchObject({
              kind: "announce-effect-materialization",
              cardId: selected.objectId,
              playerId: player.id,
            });
            expect(player.zone("material-deck")).toEqual(materialDeck);
            answerDecision(game, "announce-effect-materialization", {});
            expect(game.state.stack.at(-1)).toMatchObject({
              kind: "materialization",
              cardId: selected.objectId,
              materializationContext: "effect-instruction",
            });
            expect(player.zone("field")).not.toContainEqual(selected);
            expect(player.zone("memory")).toEqual(memory);
            passEffectsStack(game);
            expect(player.zone("field")).toContainEqual(selected);
            expect(player.zone("material-deck")).toEqual(
              materialDeck.filter((ref) => ref.objectId !== selected.objectId),
            );
          } else {
            expect(game.state.decision).toBeNull();
            expect(player.zone("material-deck")).toEqual(materialDeck);
          }
          expect(game.state.stack).toHaveLength(0);
          expect(player.zone("memory")).toEqual(memory);
          expect(player.zone("hand")).toEqual(hand);
          expect(opponent.zone("material-deck")).toHaveLength(1);
        }
      });
    }
  }
});
