import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { snowWhiteWeissQueen } from "./snow-white-weiss-queen.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { spiritsBlessing } from "../../DOA/actions/spirits-blessing.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 5u5m8xblmd-a1 */
describe("Snow White - level-gated entry and next controlled wake phase", () => {
  for (const level of [0, 1, 2])
    for (const own of [false, true])
      for (const remove of [false, true])
        it(`level=${level}, own target=${own}, source removed=${remove}`, () => {
          const starter = enableAllTestElements(lineageTestChampion("Owner", 0));
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion: starter,
              lineage: Array.from({ length: level }, (_, i) =>
                enableAllTestElements(lineageTestChampion("Owner", i + 1)),
              ),
              zones: {
                hand: [
                  snowWhiteWeissQueen,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
                field: [woodlandSquirrels, trainingSword],
                "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion: lineageTestChampion("Opponent", 0),
              zones: {
                field: [enfeebledDagger],
                "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(snowWhiteWeissQueen);
          const actor = own ? p : q,
            target = own ? p.card(starter) : q.card(lineageTestChampion("Opponent", 0));
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          expect(() => p.activate(source, { reservePayment: payment.slice(0, 2) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, { reservePayment: payment });
          expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
          expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          expect(p.zone("memory")).toHaveLength(3);
          if (level > 0) {
            expect(game.state.decision?.kind).toBe("announce-triggered-ability");
            const pending = game.state;
            for (const ids of [
              [],
              [source.objectId],
              [p.card(trainingSword).objectId],
              [p.card(woodlandSquirrels, { zone: "field" }).objectId],
              [target.objectId, target.objectId],
            ]) {
              expect(() =>
                answerDecision(game, "announce-triggered-ability", {
                  targets: { "target-1": ids },
                }),
              ).toThrow();
              expect(game.state).toEqual(pending);
            }
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-1": [target.objectId] },
            });
            expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
          } else expect(game.state.decision).toBeFalsy();
          if (remove) {
            p.pass();
            q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
              targets: { "target-unit": [source.objectId] },
            });
          }
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(level > 0);
          expect(game.state.objects[source.objectId]!.zone).toBe(remove ? "graveyard" : "field");
          const turn = game.state.turn.number;
          advanceToMain(game, actor.id, turn);
          expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(level > 0);
          advanceToMain(game, actor.id, game.state.turn.number);
          expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
        });
  for (const own of [false, true])
    it(`allows a card effect to wake the ${own ? "own" : "opposing"} champion before its next wake phase`, () => {
      const starter = enableAllTestElements(lineageTestChampion("Owner", 0)),
        current = enableAllTestElements(lineageTestChampion("Owner", 1)),
        opponent = enableAllTestElements(lineageTestChampion("Opponent", 0));
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: [current],
          zones: {
            field: [trainingSword],
            hand: [
              snowWhiteWeissQueen,
              spiritsBlessing,
              ...Array.from({ length: 4 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: {
            field: [trainingSword],
            hand: [spiritsBlessing, woodlandSquirrels],
            "main-deck": [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        actor = own ? p : q,
        target = actor.card(own ? starter : opponent);
      p.activate(snowWhiteWeissQueen, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
      if (!own) p.pass();
      actor.activate(spiritsBlessing, {
        reservePayment: [
          { kind: "card", cardId: actor.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
        costSelections: [[actor.card(trainingSword).objectId]],
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
      expect(actor.zone("main-deck")).toHaveLength(0);
    });
});

function restableChampion(
  name: string,
  level: number,
): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> {
  const base = lineageTestChampion(name, level);
  return {
    ...base,
    layout: {
      kind: "single-faced",
      face: {
        ...requireSingleFace(base),
        abilities: [
          {
            id: `${base.canonicalId}-a1`,
            kind: "activated",
            activation: "ability",
            text: "REST: Draw zero cards.",
            cost: { kind: "rest", subject: { kind: "source" } },
            effect: { kind: "draw", player: "controller", amount: 0 },
          },
        ],
      },
    },
  };
}

/** @covers 5u5m8xblmd-a2 */
describe("Snow White - replace rested opposing level-up at resolution", () => {
  for (const level of [0, 1])
    for (const own of [false, true])
      for (const rested of [false, true])
        for (const field of [false, true])
          it(`owner level=${level}, own level-up=${own}, rested=${rested}, source field=${field}`, () => {
            const starter = restableChampion("Owner", 0),
              current = restableChampion("Owner", level),
              opponent = restableChampion("Opponent", 0);
            const next = lineageTestChampion(own ? "Owner" : "Opponent", own ? level + 1 : 1);
            const game = GrandArchiveTestEngine.startFixture({
              phase: "materialize",
              firstPlayer: own ? "playerOne" : "playerTwo",
              playerOne: {
                champion: starter,
                lineage: level ? [current] : [],
                zones: {
                  field: field ? [snowWhiteWeissQueen] : [],
                  graveyard: field ? [] : [snowWhiteWeissQueen],
                  memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                  "material-deck": own ? [next] : [],
                },
              },
              playerTwo: {
                champion: opponent,
                zones: {
                  memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                  "material-deck": own ? [] : [next],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              actor = own ? p : q;
            const hero = actor.card(own ? starter : opponent),
              card = actor.card(next, { zone: "material-deck" });
            const previous =
              game.state.objects[hero.objectId]!.activeDefinitionId ??
              game.state.objects[hero.objectId]!.definitionId;
            actor.materialize(card);
            expect(actor.zone("memory")).toHaveLength(3 - (own ? level + 1 : 1));
            expect(game.state.objects[card.objectId]!.zone).toBe("effects-stack");
            if (rested) actor.activateAbility(hero, `${(own ? current : opponent).canonicalId}-a1`);
            passEffectsStack(game);
            const blocked = level > 0 && !own && rested && field;
            expect(
              game.state.objects[hero.objectId]!.activeDefinitionId ??
                game.state.objects[hero.objectId]!.definitionId,
            ).toBe(blocked ? previous : next.canonicalId);
            expect(game.state.objects[card.objectId]!.zone).toBe(
              blocked ? "material-deck" : "inner-lineage",
            );
            expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(rested);
            expect(actor.zone("memory")).toHaveLength(3 - (own ? level + 1 : 1));
            expect(game.state.stack).toHaveLength(0);
            expect(game.state.decision).toBeFalsy();
          });
  it("stops replacing level-ups when Snow White dies in response to materialization", () => {
    const starter = restableChampion("Owner", 0),
      current = restableChampion("Owner", 1),
      opponent = restableChampion("Opponent", 0),
      next = lineageTestChampion("Opponent", 1);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      firstPlayer: "playerTwo",
      playerOne: { champion: starter, lineage: [current], zones: { field: [snowWhiteWeissQueen] } },
      playerTwo: {
        champion: opponent,
        zones: { field: [enfeebledDagger], memory: [woodlandSquirrels], "material-deck": [next] },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      hero = q.card(opponent),
      card = q.card(next, { zone: "material-deck" }),
      snow = p.card(snowWhiteWeissQueen);
    q.materialize(card);
    q.activateAbility(hero, `${opponent.canonicalId}-a1`);
    q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
      targets: { "target-unit": [snow.objectId] },
    });
    expect(q.zone("memory")).toHaveLength(0);
    expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(true);
    passEffectsStack(game);
    expect(game.state.objects[snow.objectId]!.zone).toBe("graveyard");
    expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(next.canonicalId);
    expect(game.state.objects[card.objectId]!.zone).toBe("inner-lineage");
    expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(true);
  });
});
