import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import { dredgingStreams } from "../cards/SP4/actions/dredging-streams.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveDelugeDeath(card: Card, threshold: number, draw: number, enlighten = 0) {
  for (const matching of [false, true])
    for (const mode of [
      "below",
      "at",
      "above",
      "enter",
      "leave",
      "source-exiled",
      "bounce",
    ] as const) {
      it(`checks WATER graveyard at death trigger resolution: class=${matching}, mode=${mode}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const opponent = enableAllTestElements(
          grantTestChampionLevel(
            createClassBonusTestChampion(card, false, "activation-discount"),
            3,
          ),
        );
        const water =
          mode === "below" || mode === "enter"
            ? threshold - 2
            : mode === "above" || mode === "source-exiled" || mode === "bounce"
              ? threshold
              : threshold - 1;
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: mode === "bounce" ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [card, woodlandSquirrels],
              hand: [
                dredgingStreams,
                reclaim,
                glacialGuidance,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              memory: [glacialGuidance],
              banishment: [glacialGuidance],
              graveyard: [
                ...Array.from({ length: water }, () => glacialGuidance),
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: opponent,
            zones: {
              hand: [
                fireball,
                dredgingStreams,
                ...Array.from({ length: 6 }, () => woodlandSquirrels),
              ],
              graveyard: [
                ...Array.from({ length: threshold + 2 }, () => glacialGuidance),
                woodlandSquirrels,
              ],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          hero = p.card(champion),
          foe = q.card(opponent),
          deck = p.zone("main-deck");
        const payP = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const payQ = (n: number) =>
          q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        if (mode === "bounce") {
          p.activate(reclaim, {
            reservePayment: payP(2),
            targets: { "target-1": [source.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("hand");
        } else {
          q.activate(fireball, {
            reservePayment: payQ(4),
            targets: { "target-1": [source.objectId] },
          });
          expect(p.zone("main-deck")).toEqual(deck);
          q.pass();
          p.pass();
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(
            game.state.stack.some(
              (item) => item.kind === "triggered-ability" && item.sourceId === source.objectId,
            ),
          ).toBe(true);
          expect(p.zone("main-deck")).toEqual(deck);
          expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(0);
          if (mode === "enter") {
            q.pass();
            p.activate(dredgingStreams, {
              reservePayment: payP(2),
              targets: {
                "target-card": [q.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
              },
            });
          } else if (mode === "leave" || mode === "source-exiled") {
            q.activate(dredgingStreams, {
              reservePayment: payQ(2),
              targets: { "target-card": [source.objectId] },
            });
          }
          passEffectsStack(game);
          if (mode === "leave" || mode === "source-exiled")
            expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        }
        const enabled = ["at", "above", "enter", "source-exiled"].includes(mode);
        expect(p.zone("main-deck")).toEqual(deck.slice(enabled ? draw : 0));
        for (const ref of deck.slice(0, enabled ? draw : 0))
          expect(p.zone("hand")).toContainEqual(ref);
        expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(
          enabled ? enlighten : 0,
        );
        expect(game.state.objects[foe.objectId]!.counters.enlighten ?? 0).toBe(0);
        expect(game.state.stack).toHaveLength(0);
        expect(game.state.decision).toBeNull();
      });
    }
}
