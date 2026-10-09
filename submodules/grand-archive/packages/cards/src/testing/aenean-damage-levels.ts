import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { secondWind } from "../cards/DOA/actions/second-wind.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveAeneanDamageLevels(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  frost = false,
) {
  for (const matches of [false, true])
    for (const level of [2, 3, 5, 6])
      for (const ally of [false, true])
        for (const mode of frost
          ? ally
            ? ["awake", "rested", "wake-response", "rest-response"]
            : ["awake", "rested"]
          : ["awake"])
          it(`class=${matches}, level=${level}, ally=${ally}, state=${mode}`, () => {
            const champion = enableAllTestElements(
              grantTestChampionLevel(
                createClassBonusTestChampion(card, matches, "activation-discount"),
                level,
              ),
            );
            const foe = enableAllTestElements(lineageTestChampion("Target", 0));
            const printed = grandArchiveTestFace(card).cost;
            if (printed.kind !== "reserve" || typeof printed.amount !== "number")
              throw new Error("Expected fixed reserve cost");
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: "playerTwo",
              playerOne: {
                champion,
                zones: {
                  hand: [card, ...Array.from({ length: printed.amount }, () => woodlandSquirrels)],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion: foe,
                zones: {
                  field: [giantTortoise, trainingSword],
                  hand: [
                    secondWind,
                    glacialGuidance,
                    ...Array.from({ length: 4 }, () => woodlandSquirrels),
                  ],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              target = q.card(ally ? giantTortoise : foe);
            const rested = mode === "rested" || mode === "wake-response";
            if (rested) {
              q.declareAttack(
                target,
                p.card(champion),
                ally ? {} : { weaponIds: [q.card(trainingSword).objectId] },
              );
              game.resolveCombatWithoutRetaliation();
            }
            advanceToMain(game, p.id);
            expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(rested);
            const history = game.state.eventHistory.length;
            p.activate(card, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, printed.amount)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              targets: { "target-1": [target.objectId] },
            });
            if (mode.endsWith("response")) {
              p.pass();
              q.activate(mode === "wake-response" ? secondWind : glacialGuidance, {
                reservePayment: q
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, mode === "wake-response" ? 3 : 1)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                targets: { "target-1": [target.objectId] },
              });
            }
            passEffectsStack(game);
            const enabled = matches && (!frost || mode === "rested" || mode === "rest-response");
            const damage = enabled && level >= 6 ? (frost ? 8 : 6) : enabled && level >= 3 ? 4 : 2;
            const hits = game.state.eventHistory
              .slice(history)
              .filter((e) => e.type === "damage-marked");
            expect(hits).toHaveLength(1);
            expect(hits[0]!.amount).toBe(damage);
            const died = ally && damage >= 6;
            expect(game.state.objects[target.objectId]!.zone).toBe(died ? "graveyard" : "field");
            expect(game.state.objects[target.objectId]!.damage).toBe(died ? 0 : damage);
            expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
          });
}
