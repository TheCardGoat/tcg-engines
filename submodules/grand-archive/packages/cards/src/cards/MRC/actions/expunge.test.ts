import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { expunge } from "./expunge.ts";
import { umbraSight } from "../../ALC/actions/umbra-sight.ts";
import { violetHaze } from "../../ALC/actions/violet-haze.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers r73opcqtzs-a1 */
/** @covers r73opcqtzs-a2 */
describe("Expunge discards one lineage Curse and uses its reserve cost", () => {
  for (const curse of [umbraSight, violetHaze])
    for (const opposingOwner of [false, true])
      for (const opposingHost of curse === umbraSight ? [opposingOwner] : [false, true])
        it(`${curse.slug}, opposing owner=${opposingOwner}, opposing host=${opposingHost}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(expunge, false, "activation-discount"),
          );
          const zones = {
            field: [giantTortoise, woodlandSquirrels],
            hand: [curse, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
            graveyard: [curse],
            "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          };
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: { champion, zones: { ...zones, hand: [...zones.hand, expunge] } },
            playerTwo: { champion, zones },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            actor = opposingOwner ? q : p,
            host = opposingHost ? q : p;
          const pay = (player: typeof p, n: number) =>
            player
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const source = actor.card(curse, { zone: "hand" });
          if (opposingOwner) p.pass();
          if (curse === violetHaze)
            actor.activate(source, {
              reservePayment: pay(actor, 2),
              targets: { "target-champion": [host.card(champion).objectId] },
            });
          else actor.activate(source);
          passEffectsStack(game);
          if (curse === umbraSight) {
            answerDecision(game, "resolve-optional-effect", true);
            passEffectsStack(game);
          }
          expect(game.state.objects[source.objectId]!.zone).toBe("inner-lineage");
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          if (wait.playerId !== p.id) q.pass();
          for (const ids of [
            [],
            [p.card(champion).objectId],
            [p.card(giantTortoise).objectId],
            [p.card(curse, { zone: "graveyard" }).objectId],
            [source.objectId, source.objectId],
          ]) {
            const before = game.state;
            expect(() =>
              p.activate(expunge, { reservePayment: pay(p, 2), costSelections: [ids] }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const survivors = [
            p.card(champion),
            q.card(champion),
            p.card(giantTortoise),
            q.card(giantTortoise),
          ];
          const previous = survivors.map((c) => game.state.objects[c.objectId]!.damage);
          const squirrels = [
            p.card(woodlandSquirrels, { zone: "field" }),
            q.card(woodlandSquirrels, { zone: "field" }),
          ];
          p.activate(expunge, { reservePayment: pay(p, 2), costSelections: [[source.objectId]] });
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(actor.zone("graveyard")).toContainEqual(source);
          passEffectsStack(game);
          const damage = curse === umbraSight ? 0 : 2;
          survivors.forEach((c, i) =>
            expect(game.state.objects[c.objectId]!.damage).toBe(previous[i]! + damage),
          );
          for (const squirrel of squirrels)
            expect(game.state.objects[squirrel.objectId]!.zone).toBe(
              damage ? "graveyard" : "field",
            );
          expect(p.zone("graveyard")).toContainEqual(p.card(expunge));
        });
});
