import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { rapidCombustion } from "./rapid-combustion.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { baubleOfMending } from "../../DOA/items/bauble-of-mending.ts";
import { lacunasGrasp } from "../weapons/lacunas-grasp.ts";
import { frozenQuill } from "../../AMB/items/frozen-quill.ts";
import { primaMateria } from "../../MRC/items/prima-materia.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 0s6solta0h-a1 */
describe("Rapid Combustion — Kindle four and exact payment", () => {
  for (const count of [0, 1, 3, 4])
    for (const own of [false, true])
      it(`Kindle=${count}, own target=${own}`, () => {
        const champion = createClassBonusTestChampion(
          rapidCombustion,
          false,
          "activation-discount",
        );
        const supplies = {
          field: [trainingSword],
          "material-deck": [trainingSword],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        };
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: own ? "playerOne" : "playerTwo",
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              ...supplies,
              hand: [
                rapidCombustion,
                sparkAlight,
                ...Array.from({ length: 4 }, () => woodlandSquirrels),
              ],
              graveyard: [woodlandSquirrels, ...Array.from({ length: 5 }, () => sparkAlight)],
              banishment: [sparkAlight],
            },
          },
          playerTwo: { champion, zones: { ...supplies, graveyard: [sparkAlight] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = own ? p : q;
        const target = owner.card(trainingSword, { zone: "material-deck" });
        owner.materialize(target);
        passEffectsStack(game);
        advanceToMain(game, owner.id);
        if (!own) q.pass();
        const source = p.card(rapidCombustion),
          fire = p.cards(sparkAlight, { zone: "graveyard" }).map((c) => c.objectId);
        const payment = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        for (const ids of [
          fire,
          [fire[0]!, fire[0]!],
          [q.card(sparkAlight).objectId],
          [p.card(sparkAlight, { zone: "hand" }).objectId],
          [p.card(sparkAlight, { zone: "banishment" }).objectId],
          [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
        ]) {
          expect(() =>
            p.activate(source, {
              targets: { "target-1": [target.objectId] },
              kindleCardIds: ids,
              reservePayment: payment(Math.max(0, 4 - ids.length)),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        if (count < 4) {
          expect(() =>
            p.activate(source, {
              targets: { "target-1": [target.objectId] },
              kindleCardIds: fire.slice(0, count),
              reservePayment: payment(3 - count),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(source, {
          targets: { "target-1": [target.objectId] },
          kindleCardIds: fire.slice(0, count),
          reservePayment: payment(4 - count),
        });
        expect(p.zone("memory")).toHaveLength(4 - count);
        for (const [index, id] of fire.entries())
          expect(game.state.objects[id]!.zone).toBe(index < count ? "banishment" : "graveyard");
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
      });
});

/** @covers 0s6solta0h-a2 */
describe("Rapid Combustion — cost, type and current-turn entry", () => {
  for (const own of [false, true])
    for (const scenario of [
      { card: condemnedTrinket, memory: true, cost: 0, allowed: true },
      { card: baubleOfMending, memory: true, cost: 1, allowed: false },
      { card: lacunasGrasp, memory: true, cost: 1, allowed: false },
      { card: frozenQuill, memory: false, cost: 3, allowed: true },
      { card: primaMateria, memory: false, cost: 4, allowed: false },
      { card: woodlandSquirrels, memory: false, cost: 0, allowed: false },
    ])
      it(`${scenario.card.slug}, own=${own}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(rapidCombustion, false, "activation-discount"),
        );
        const supplies = {
          hand: [
            ...(scenario.memory ? [] : [scenario.card]),
            ...Array.from({ length: 8 }, () => woodlandSquirrels),
          ],
          memory: [woodlandSquirrels, woodlandSquirrels],
          "material-deck": scenario.memory ? [scenario.card] : [],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        };
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: own ? "playerOne" : "playerTwo",
          phase: "materialize",
          playerOne: {
            champion,
            zones: { ...supplies, hand: [rapidCombustion, ...supplies.hand] },
          },
          playerTwo: { champion, zones: supplies },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = own ? p : q;
        const target = owner.cards(scenario.card, {
          zone: scenario.memory ? "material-deck" : "hand",
        })[0]!;
        const payment = (player: typeof p, n: number) =>
          player
            .cards(woodlandSquirrels, { zone: "hand" })
            .filter((c) => c.objectId !== target.objectId)
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (scenario.memory) {
          owner.materialize(target);
          passEffectsStack(game);
        }
        advanceToMain(game, owner.id);
        if (!scenario.memory) {
          owner.activate(target, { reservePayment: payment(owner, scenario.cost) });
          passEffectsStack(game);
        }
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        if (!own) q.pass();
        const before = game.state;
        const activate = () =>
          p.activate(rapidCombustion, {
            targets: { "target-1": [target.objectId] },
            reservePayment: payment(p, 4),
          });
        if (!scenario.allowed) {
          expect(activate).toThrow();
          expect(game.state).toEqual(before);
        } else {
          activate();
          expect(game.state.objects[target.objectId]!.zone).toBe("field");
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.zone).toBe(
            scenario.memory ? "banishment" : "graveyard",
          );
        }
      });

  it("rejects a prior-turn item even though its reserve cost is eligible", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(rapidCombustion, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [rapidCombustion, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: { hand: [frozenQuill, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      target = q.card(frozenQuill);
    q.activate(target, {
      reservePayment: q
        .cards(woodlandSquirrels)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
    });
    passEffectsStack(game);
    advanceToMain(game, p.id);
    const before = game.state;
    expect(() =>
      p.activate(rapidCombustion, {
        targets: { "target-1": [target.objectId] },
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 4)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});
