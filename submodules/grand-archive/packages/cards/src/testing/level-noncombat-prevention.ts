import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { seekingShot } from "../cards/FTC/attacks/seeking-shot.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack, declareResolvedAttack } from "./decisions.ts";
export function proveLevelNoncombatPrevention(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  threshold: number,
) {
  const life = grandArchiveTestFace(card).stats.life;
  if (typeof life !== "number") throw new Error("Expected LIFE");
  for (const matching of [false, true])
    for (const level of [threshold - 1, threshold, threshold + 1])
      for (const kind of ["small", "large", "unpreventable", "combat"] as const)
        for (const other of [false, true])
          it(`class=${matching}, level=${level}, damage=${kind}, other ally=${other}`, () => {
            const champion = grantTestChampionLevel(
              createClassBonusTestChampion(card, matching, "activation-discount"),
              level,
            );
            const opponent = grantTestChampionLevel(
              enableAllTestElements(
                createClassBonusTestChampion(card, false, "activation-discount"),
              ),
              kind === "large" ? 3 : kind === "combat" ? 2 : 0,
            );
            const action =
              kind === "combat" ? seekingShot : kind === "unpreventable" ? sparkAlight : fireball;
            const cost = kind === "combat" ? 1 : kind === "unpreventable" ? 2 : 4;
            const repeat = kind === "small" ? 2 : 1;
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: "playerTwo",
              playerOne: { champion, zones: { field: [card, giantTortoise] } },
              playerTwo: {
                champion: opponent,
                zones: {
                  hand: [
                    ...Array.from({ length: repeat }, () => action),
                    ...Array.from({ length: cost * repeat }, () => woodlandSquirrels),
                  ],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              target = p.card(other ? giantTortoise : card),
              source = p.card(card);
            const protectedTarget =
              !other && level >= threshold && (kind === "small" || kind === "large");
            const amount =
              kind === "small"
                ? 1
                : kind === "large"
                  ? 4
                  : kind === "unpreventable"
                    ? 2
                    : !other && grandArchiveTestFace(card).typeLine.subtypes.includes("HUMAN")
                      ? 4
                      : 1;
            let marked = 0;
            for (const actionRef of q.cards(action, { zone: "hand" })) {
              const start = game.state.eventHistory.length;
              q.activate(actionRef, {
                reservePayment: q
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, cost)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                ...(kind === "combat"
                  ? { attackAttackerId: q.card(opponent).objectId }
                  : { targets: { "target-1": [target.objectId] } }),
              });
              passEffectsStack(game);
              if (kind === "combat") {
                declareResolvedAttack(
                  game,
                  q.card(opponent).objectId,
                  target.objectId,
                  "Attack through Stealth using True Sight",
                );
                game.resolveCombatWithoutRetaliation();
              }
              const events = game.state.eventHistory
                .slice(start)
                .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId);
              if (protectedTarget) expect(events).toHaveLength(0);
              else
                expect(events.map((e) => (e.type === "damage-marked" ? e.amount : 0))).toEqual([
                  amount,
                ]);
              marked += protectedTarget ? 0 : amount;
              expect(game.state.objects[target.objectId]!.zone).toBe(
                marked >= (other ? 6 : life) ? "graveyard" : "field",
              );
              if (marked < (other ? 6 : life))
                expect(game.state.objects[target.objectId]!.damage).toBe(marked);
            }
            if (other) {
              expect(game.state.objects[source.objectId]!.damage).toBe(0);
              expect(game.state.objects[source.objectId]!.zone).toBe("field");
            }
          });
}

import { cramSession } from "../cards/DOA/actions/cram-session.ts";
import { tempestDownfall } from "../cards/MRC/actions/tempest-downfall.ts";
import { advanceToMain } from "./decisions.ts";
export function proveTemporaryLevelPrevention(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  threshold: number,
) {
  for (const matching of [false, true])
    it(`temporary level grants prevention then expires, class=${matching}`, () => {
      const champion = grantTestChampionLevel(
        enableAllTestElements(createClassBonusTestChampion(card, matching, "activation-discount")),
        threshold - 1,
      );
      const opponent = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card],
            hand: [cramSession, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: {
            hand: [
              tempestDownfall,
              tempestDownfall,
              ...Array.from({ length: 6 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card),
        spells = q.cards(tempestDownfall, { zone: "hand" });
      p.activate(cramSession, {
        reservePayment: [
          { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      passEffectsStack(game);
      p.pass();
      const cast = (index: number) => {
        q.activate(spells[index]!, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
      };
      cast(0);
      expect(game.state.objects[source.objectId]!.damage).toBe(0);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      advanceToMain(game, q.id);
      cast(1);
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
    });
}
