import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { necklaceOfHindsight } from "./necklace-of-hindsight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 21g6ldxwrv-a1 */
describe("Necklace of Hindsight — class-only memory discount", () => {
  for (const matching of [false, true])
    for (const memory of [0, 1])
      it(`class=${matching}, available memory=${memory}`, () => {
        const champion = createClassBonusTestChampion(
          necklaceOfHindsight,
          matching,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              "material-deck": [necklaceOfHindsight],
              memory: Array.from({ length: memory }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: createClassBonusTestChampion(
              necklaceOfHindsight,
              true,
              "activation-discount",
            ),
          },
        });
        const p = game.player("player-one");
        if (!matching && !memory) {
          const before = game.state;
          expect(() => p.materialize(necklaceOfHindsight)).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        p.materialize(necklaceOfHindsight);
        expect(p.zone("memory")).toHaveLength(memory - (matching ? 0 : 1));
        expect(p.zone("banishment")).toHaveLength(matching ? 0 : 1);
        passEffectsStack(game);
        expect(p.card(necklaceOfHindsight, { zone: "field" })).toBeDefined();
      });
});

/** @covers 21g6ldxwrv-a2 */
describe("Necklace of Hindsight — private opposing deck manipulation", () => {
  for (const size of [0, 1, 3, 6])
    for (const mode of ["top", "bottom", "split"] as const)
      it(`reorders ${size} available cards with ${mode} placement`, () => {
        const champion = createClassBonusTestChampion(
          necklaceOfHindsight,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { field: [necklaceOfHindsight], "main-deck": [woodlandSquirrels] },
          },
          playerTwo: {
            champion,
            zones: {
              "main-deck": Array.from({ length: size }, () => woodlandSquirrels),
              hand: [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(necklaceOfHindsight),
          deck = q.zone("main-deck"),
          ownDeck = p.zone("main-deck");
        for (const invalid of [p.id, q.card(champion).objectId]) {
          const before = game.state;
          expect(() =>
            p.activateAbility(source, "21g6ldxwrv-a2", {
              targets: { "target-opponent": [invalid] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activateAbility(source, "21g6ldxwrv-a2", { targets: { "target-opponent": [q.id] } });
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        expect(q.zone("main-deck")).toEqual(deck);
        const paid = game.state;
        expect(() =>
          p.activateAbility(source, "21g6ldxwrv-a2", { targets: { "target-opponent": [q.id] } }),
        ).toThrow();
        expect(game.state).toEqual(paid);
        passEffectsStack(game);
        const looked = deck.slice(0, 4),
          bottom =
            mode === "top"
              ? []
              : mode === "bottom"
                ? [...looked].reverse()
                : looked.filter((_, i) => i % 2 === 0).reverse();
        const top = looked.filter((c) => !bottom.includes(c)).reverse();
        if (size) {
          expect(game.state.decision).toMatchObject({
            kind: "resolve-effect-choice",
            playerId: p.id,
          });
          for (const invalid of [
            [ownDeck[0]!.objectId],
            [q.card(woodlandSquirrels, { zone: "hand" }).objectId],
            ...(size > 4 ? [[deck[4]!.objectId]] : []),
            [looked[0]!.objectId, looked[0]!.objectId],
          ]) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(
            game,
            "resolve-effect-choice",
            bottom.map((c) => c.objectId),
          );
          passEffectsStack(game);
          for (const group of [top])
            if (group.length > 1) {
              expect(game.state.decision).toMatchObject({
                kind: "resolve-effect-choice",
                playerId: p.id,
              });
              const before = game.state;
              expect(() =>
                answerDecision(
                  game,
                  "resolve-effect-choice",
                  group.slice(1).map((c) => c.objectId),
                ),
              ).toThrow();
              expect(game.state).toEqual(before);
              answerDecision(
                game,
                "resolve-effect-choice",
                group.map((c) => c.objectId),
              );
              passEffectsStack(game);
            }
        }
        expect(game.state.decision).toBeNull();
        expect(q.zone("main-deck")).toEqual([...top, ...deck.slice(4), ...bottom]);
        expect(p.zone("main-deck")).toEqual(ownDeck);
        expect(p.zone("hand")).toHaveLength(0);
        expect(q.zone("hand")).toHaveLength(1);
        const looks = game.state.eventHistory.filter((e) => e.type === "cards-looked-at");
        expect(looks).toHaveLength(size ? 1 : 0);
        if (size)
          expect(looks[0]).toMatchObject({
            playerId: p.id,
            actorId: p.id,
            objectIds: looked.map((c) => c.objectId),
          });
        expect(game.state.eventHistory.filter((e) => e.type === "card-revealed")).toHaveLength(0);
      });
});
