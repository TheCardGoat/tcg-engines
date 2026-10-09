import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { signaltechXUltra } from "./signaltech-x-ultra.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { eagerPage } from "../../DOA/allies/eager-page.ts";
import { fireball } from "../../DOA/actions/fireball.ts";

/** @covers vFvhZeunOc-a1 */
describe("SignalTech X Ultra — rest, reveal an ally, order the remainder, and sacrifice only on transfer", () => {
  for (const matching of [false, true])
    for (const length of [0, 1, 2, 3, 5])
      for (const mode of ["first", "last", "decline", "no-match"] as const)
        it(`matching=${matching}, length=${length}, mode=${mode}`, () => {
          const champion = createClassBonusTestChampion(
            signaltechXUltra,
            matching,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [signaltechXUltra],
                hand: [eagerPage],
                graveyard: [eagerPage],
                "main-deck": Array.from({ length }, (_, i) =>
                  mode === "no-match" || i === 1
                    ? fireball
                    : i === 0
                      ? woodlandSquirrels
                      : eagerPage,
                ),
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const source = p.card(signaltechXUltra, { zone: "field" });
          const held = p.card(eagerPage, { zone: "hand" }),
            dead = p.card(eagerPage, { zone: "graveyard" });
          const deck = p.zone("main-deck"),
            looked = deck.slice(0, 3);
          const allies = looked.filter((c) => c.definitionId !== fireball.canonicalId);
          const chosen = mode === "first" ? allies[0] : mode === "last" ? allies.at(-1) : undefined;
          p.activateAbility(source, "vFvhZeunOc-a1");
          expect(game.state.objects[source.objectId]?.states.has("rested")).toBe(true);
          expect(p.zone("hand")).toEqual([held]);
          passEffectsStack(game);
          if (
            game.state.decision?.kind === "resolve-effect-choice" &&
            game.state.decision.selection.id === "chosen-ally"
          ) {
            const before = game.state;
            for (const bad of [
              source,
              held,
              dead,
              q.zone("main-deck")[0]!,
              ...deck.slice(3),
              ...looked.filter((c) => c.definitionId === fireball.canonicalId),
            ]) {
              expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
              expect(game.state).toEqual(before);
            }
            if (chosen) {
              expect(() =>
                answerDecision(game, "resolve-effect-choice", [chosen.objectId, chosen.objectId]),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", chosen ? [chosen.objectId] : []);
            passEffectsStack(game);
          } else expect(chosen).toBeUndefined();
          const remainder = looked
            .filter((c) => c.objectId !== chosen?.objectId)
            .reverse()
            .map((c) => c.objectId);
          if (game.state.decision?.kind === "resolve-effect-choice") {
            expect(p.card(signaltechXUltra, { zone: "field" })).toEqual(source);
            expect(p.zone("hand").map((c) => c.objectId)).toEqual([
              held.objectId,
              ...(chosen ? [chosen.objectId] : []),
            ]);
            const before = game.state;
            for (const invalid of [
              [],
              remainder.slice(1),
              [held.objectId, ...remainder.slice(1)],
            ]) {
              expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", remainder);
            passEffectsStack(game);
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
          expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
            ...deck.slice(3).map((c) => c.objectId),
            ...remainder,
          ]);
          expect(p.zone("hand").map((c) => c.objectId)).toEqual([
            held.objectId,
            ...(chosen ? [chosen.objectId] : []),
          ]);
          expect(p.card(signaltechXUltra, { zone: chosen ? "banishment" : "field" })).toEqual(
            source,
          );
          expect(p.zone("graveyard").map((c) => c.objectId)).toEqual([dead.objectId]);
          expect(p.zone("banishment").map((c) => c.objectId)).toEqual(
            chosen ? [source.objectId] : [],
          );
          expect(p.zone("memory")).toHaveLength(0);
          expect(
            game.state.eventHistory
              .filter((e) => e.type === "card-revealed")
              .map((e) => e.objectId),
          ).toEqual(chosen ? [chosen.objectId] : []);
          expect(game.state.winnerIds).toEqual([]);
          if (!chosen) {
            const before = game.state;
            expect(() => p.activateAbility(source, "vFvhZeunOc-a1")).toThrow();
            expect(game.state).toEqual(before);
          }
        });
});
