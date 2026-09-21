import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { idleThoughts } from "../../DOA/actions/idle-thoughts.ts";
import { ignisDeus } from "./ignis-deus.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

function championAt(
  level: number,
  spirit: boolean,
): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> {
  const base = enableAllTestElements(lineageTestChampion(spirit ? "Spirit" : "Warrior", level));
  return {
    ...base,
    layout: {
      kind: "single-faced",
      face: {
        ...requireSingleFace(base),
        typeLine: {
          supertypes: [],
          types: ["CHAMPION"],
          classes: [spirit ? "SPIRIT" : "WARRIOR"],
          subtypes: [spirit ? "SPIRIT" : "WARRIOR"],
        },
      },
    },
  };
}

function reachMaterialization(game: GrandArchiveTestEngine, playerId: string): void {
  for (let step = 0; step < 128; step++) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice") {
      if (wait.playerId === playerId) return;
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    } else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} before materialization`);
  }
  throw new Error("Materialization phase not reached");
}

/** @covers rxdon8uwza-a1 */
describe("Ignis Deus — the current champion must be a Spirit", () => {
  for (const state of ["starting-spirit", "leveled-spirit", "leveled-warrior"] as const)
    it(state, () => {
      const starter = championAt(0, true),
        next = championAt(1, state === "leveled-spirit");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: state === "starting-spirit" ? [] : [next],
          zones: { hand: [ignisDeus, woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: { champion: starter },
      });
      const p = game.player("player-one"),
        hero = p.card(starter);
      const payment = p
        .cards(woodlandSquirrels)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      if (state === "leveled-warrior") {
        expect(() => p.activate(ignisDeus, { reservePayment: payment })).toThrow();
        expect(game.state).toEqual(before);
      } else {
        p.activate(ignisDeus, { reservePayment: payment });
        expect(p.zone("memory")).toHaveLength(2);
        passEffectsStack(game);
        expect(p.cards(ignisDeus, { zone: "graveyard" })).toHaveLength(1);
        expect(
          game.state.objects[hero.objectId]!.activeDefinitionId ??
            game.state.objects[hero.objectId]!.definitionId,
        ).toBe(state === "starting-spirit" ? starter.canonicalId : next.canonicalId);
      }
    });
});

/** @covers rxdon8uwza-a2 */
describe("Ignis Deus — paid level-one materialization and lasting level restriction", () => {
  it("does not impose the permanent restriction when no level-one card can be materialized", () => {
    const starter = championAt(0, true),
      one = championAt(1, true),
      two = championAt(2, false),
      three = championAt(3, false);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [one],
        zones: {
          hand: [ignisDeus, woodlandSquirrels, woodlandSquirrels],
          "material-deck": [two, three, trainingSword],
          graveyard: Array.from({ length: 5 }, () => idleThoughts),
          "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: starter,
        zones: { "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels) },
      },
    });
    const p = game.player("player-one"),
      hero = p.card(starter);
    p.activate(ignisDeus, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.decision).toBeNull();
    expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(one.canonicalId);
    for (const [card, cost] of [
      [two, 2],
      [three, 3],
    ] as const) {
      reachMaterialization(game, p.id);
      p.materialize(card, {
        floatingMemoryCardIds: p
          .cards(idleThoughts, { zone: "graveyard" })
          .slice(0, cost)
          .map((c) => c.objectId),
      });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(card.canonicalId);
    }
  });

  for (const spirit of [false, true])
    for (const opposingTurn of [false, true])
      it(`materialized Spirit=${spirit}, opposing turn=${opposingTurn}`, () => {
        const starter = championAt(0, true),
          one = championAt(1, spirit),
          alternative = championAt(1, !spirit),
          two = championAt(2, false),
          three = championAt(3, false);
        const opponentOne = championAt(1, false);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: opposingTurn ? "playerTwo" : "playerOne",
          playerOne: {
            champion: starter,
            zones: {
              hand: [ignisDeus, woodlandSquirrels, woodlandSquirrels],
              memory: Array.from({ length: 4 }, () => woodlandSquirrels),
              "material-deck": [one, alternative, two, three, trainingSword],
              banishment: [one],
              graveyard: Array.from({ length: 6 }, () => idleThoughts),
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: starter,
            lineage: [opponentOne],
            zones: {
              graveyard: Array.from({ length: 3 }, () => idleThoughts),
              "material-deck": [one, two],
              memory: Array.from({ length: 3 }, () => woodlandSquirrels),
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(starter),
          foe = q.card(starter);
        const chosen = p.card(one, { zone: "material-deck" });
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
        if (opposingTurn) q.pass();
        const before = game.state;
        expect(() => p.activate(ignisDeus, { reservePayment: payment.slice(0, 1) })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(ignisDeus, { reservePayment: payment });
        expect(
          game.state.objects[hero.objectId]!.activeDefinitionId ??
            game.state.objects[hero.objectId]!.definitionId,
        ).toBe(starter.canonicalId);
        passEffectsStack(game);
        const pending = game.state;
        for (const ids of [
          [p.card(two, { zone: "material-deck" }).objectId],
          [p.card(trainingSword).objectId],
          [q.card(one, { zone: "material-deck" }).objectId],
          [p.card(one, { zone: "banishment" }).objectId],
          [chosen.objectId, p.card(alternative, { zone: "material-deck" }).objectId],
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
          expect(game.state).toEqual(pending);
        }
        answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
        expect(game.state.decision).toMatchObject({
          kind: "announce-effect-materialization",
          payCosts: true,
          playerId: p.id,
        });
        expect(p.zone("memory")).toHaveLength(6);
        answerDecision(game, "announce-effect-materialization", {});
        expect(p.zone("memory")).toHaveLength(5);
        expect(game.state.objects[chosen.objectId]!.zone).toBe("effects-stack");
        expect(
          game.state.objects[hero.objectId]!.activeDefinitionId ??
            game.state.objects[hero.objectId]!.definitionId,
        ).toBe(starter.canonicalId);
        passEffectsStack(game);
        expect(
          game.state.objects[hero.objectId]!.activeDefinitionId ??
            game.state.objects[hero.objectId]!.definitionId,
        ).toBe(one.canonicalId);
        expect(p.cards(ignisDeus, { zone: "graveyard" })).toHaveLength(1);
        reachMaterialization(game, p.id);
        if (spirit) {
          p.materialize(two, {
            floatingMemoryCardIds: p
              .cards(idleThoughts, { zone: "graveyard" })
              .slice(0, 2)
              .map((c) => c.objectId),
          });
          passEffectsStack(game);
          expect(
            game.state.objects[hero.objectId]!.activeDefinitionId ??
              game.state.objects[hero.objectId]!.definitionId,
          ).toBe(two.canonicalId);
        } else {
          const blocked = game.state;
          expect(() =>
            p.materialize(two, {
              floatingMemoryCardIds: p
                .cards(idleThoughts, { zone: "graveyard" })
                .slice(0, 2)
                .map((c) => c.objectId),
            }),
          ).toThrow();
          expect(game.state).toEqual(blocked);
          p.execute({ move: "skip-materialization" });
        }
        reachMaterialization(game, q.id);
        q.materialize(two, {
          floatingMemoryCardIds: q
            .cards(idleThoughts, { zone: "graveyard" })
            .slice(0, 2)
            .map((c) => c.objectId),
        });
        passEffectsStack(game);
        expect(game.state.objects[foe.objectId]!.activeDefinitionId).toBe(two.canonicalId);
        reachMaterialization(game, p.id);
        const later = game.state;
        expect(() =>
          p.materialize(spirit ? three : two, {
            floatingMemoryCardIds: p
              .cards(idleThoughts, { zone: "graveyard" })
              .slice(0, spirit ? 3 : 2)
              .map((c) => c.objectId),
          }),
        ).toThrow();
        expect(game.state).toEqual(later);
        expect(
          game.state.objects[hero.objectId]!.activeDefinitionId ??
            game.state.objects[hero.objectId]!.definitionId,
        ).toBe(spirit ? two.canonicalId : one.canonicalId);
      });
});
