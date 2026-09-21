import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { deathEssenceAmulet } from "./death-essence-amulet.ts";
import { enfeebledDagger } from "./enfeebled-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers ddag7ue0k7-a1 */
describe("Death Essence Amulet — off-turn death and reflexive private discard", () => {
  for (const zone of ["hand", "memory"] as const)
    for (const size of [0, 2])
      for (const accept of [false, true])
        it(`${zone} has ${size} cards, accepts banishment=${accept}`, () => {
          const champion = createClassBonusTestChampion(
            deathEssenceAmulet,
            false,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [deathEssenceAmulet, enfeebledDagger, woodlandSquirrels],
                hand: [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: Array.from({ length: zone === "hand" ? size : 2 }, () => woodlandSquirrels),
                memory: Array.from(
                  { length: zone === "memory" ? size : 2 },
                  () => woodlandSquirrels,
                ),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(deathEssenceAmulet),
            cards = q.zone(zone),
            otherZone = zone === "hand" ? "memory" : "hand",
            other = q.zone(otherZone);
          q.pass();
          p.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
            targets: { "target-unit": [p.card(woodlandSquirrels, { zone: "field" }).objectId] },
          });
          passEffectsStack(game);
          expect(game.state.decision).toMatchObject({
            kind: "resolve-optional-effect",
            playerId: p.id,
          });
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(
            0,
          );
          answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
          if (accept) {
            expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
            expect(game.state.decision).toMatchObject({
              kind: "announce-triggered-ability",
              playerId: p.id,
            });
            const before = game.state;
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                modeIds: [`choose-${zone}`],
                targets: { "target-opponent": [p.id] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            answerDecision(game, "announce-triggered-ability", {
              modeIds: [`choose-${zone}`],
              targets: { "target-opponent": [q.id] },
            });
            expect(q.zone(zone)).toEqual(cards);
            expect(
              game.state.eventHistory.filter((e) => e.type === "cards-looked-at"),
            ).toHaveLength(0);
            passEffectsStack(game);
            if (size) {
              expect(game.state.decision).toMatchObject({
                kind: "resolve-effect-choice",
                playerId: p.id,
              });
              for (const invalid of [
                [],
                cards.map((c) => c.objectId),
                [p.card(woodlandSquirrels, { zone: "hand" }).objectId],
                [other[0]!.objectId],
              ]) {
                const checkpoint = game.state;
                expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
                expect(game.state).toEqual(checkpoint);
              }
              answerDecision(game, "resolve-effect-choice", [cards[1]!.objectId]);
              passEffectsStack(game);
            }
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.objects[source.objectId]!.zone).toBe(accept ? "banishment" : "field");
          expect(q.zone(zone)).toEqual(accept && size ? [cards[0]!] : cards);
          expect(q.zone(otherZone)).toEqual(other);
          expect(q.zone("graveyard")).toEqual(accept && size ? [cards[1]!] : []);
          const looks = game.state.eventHistory.filter((e) => e.type === "cards-looked-at");
          expect(looks).toHaveLength(accept && size ? 1 : 0);
          if (accept && size)
            expect(looks[0]).toMatchObject({
              playerId: p.id,
              actorId: p.id,
              objectIds: cards.map((c) => c.objectId),
            });
        });

  for (const ownTurn of [false, true])
    for (const ownAlly of [false, true]) {
      if (!ownTurn && ownAlly) continue;
      it(`does not trigger for ownTurn=${ownTurn}, ownAlly=${ownAlly}`, () => {
        const champion = createClassBonusTestChampion(
          deathEssenceAmulet,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: ownTurn ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: { field: [deathEssenceAmulet, enfeebledDagger, woodlandSquirrels] },
          },
          playerTwo: { champion, zones: { field: [woodlandSquirrels], hand: [woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        if (!ownTurn) q.pass();
        p.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
          targets: {
            "target-unit": [(ownAlly ? p : q).card(woodlandSquirrels, { zone: "field" }).objectId],
          },
        });
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        expect(p.card(deathEssenceAmulet, { zone: "field" })).toBeDefined();
        expect(q.zone("hand")).toHaveLength(1);
        expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(0);
      });
    }
});
