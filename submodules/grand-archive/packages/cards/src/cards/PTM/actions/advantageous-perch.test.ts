import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";
import { seaspriteDiver } from "../../SP4/allies/seasprite-diver.ts";
import { splashingPerch } from "../../RDO/actions/splashing-perch.ts";
import { advantageousPerch } from "./advantageous-perch.ts";
/** @covers oLzsAj9mKl-a2 */
describe("Advantageous Perch — Ranger action recovery", () => {
  for (const matching of [false, true])
    for (const ownTurn of [false, true])
      for (const choice of ["none", "splash", "perch"])
        it(`class=${matching}, own turn=${ownTurn}, choice=${choice}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(advantageousPerch, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: ownTurn ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                hand: [
                  advantageousPerch,
                  splashingPerch,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
                graveyard: [advantageousPerch, splashingPerch, favorableWinds, seaspriteDiver],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                graveyard: [splashingPerch],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          if (!ownTurn) q.pass();
          const source = p.card(advantageousPerch, { zone: "hand" }),
            hero = p.card(champion);
          const splash = p.card(splashingPerch, { zone: "graveyard" }),
            perch = p.card(advantageousPerch, { zone: "graveyard" });
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          for (const ids of [
            [p.card(favorableWinds).objectId],
            [p.card(seaspriteDiver).objectId],
            [q.card(splashingPerch).objectId],
            [p.card(splashingPerch, { zone: "hand" }).objectId],
            [source.objectId],
            [splash.objectId, perch.objectId],
            [splash.objectId, splash.objectId],
          ]) {
            expect(() =>
              p.activate(source, { reservePayment: payment, targets: { "target-card": ids } }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const target = choice === "none" ? undefined : choice === "splash" ? splash : perch;
          const grave = p.zone("graveyard");
          p.activate(source, {
            reservePayment: payment,
            targets: { "target-card": target ? [target.objectId] : [] },
          });
          const hand = p.zone("hand"),
            memory = p.zone("memory");
          expect(game.state.objects[hero.objectId]?.states.has("distant")).toBe(false);
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]?.states.has("distant")).toBe(true);
          expect(game.state.objects[q.card(champion).objectId]?.states.has("distant")).toBe(false);
          expect(game.state.objects[source.objectId]?.zone).toBe("banishment");
          expect(p.zone("hand")).toEqual(target ? [...hand, target] : hand);
          expect(p.zone("memory")).toEqual(memory);
          expect(p.zone("graveyard")).toEqual(grave.filter((c) => c.objectId !== target?.objectId));
          if (!ownTurn) {
            advanceToMain(game, p.id);
            expect(game.state.objects[hero.objectId]?.states.has("distant")).toBe(true);
          }
          advanceToMain(game, p.id, game.state.turn.number);
          expect(game.state.objects[hero.objectId]?.states.has("distant")).toBe(false);
        });
});
