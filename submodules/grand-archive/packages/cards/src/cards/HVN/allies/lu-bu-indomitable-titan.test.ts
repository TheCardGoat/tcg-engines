import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { luBuIndomitableTitan } from "./lu-bu-indomitable-titan.ts";

/** @covers xyan7zbtxi-a1 */
describe("Lu Bu, Indomitable Titan — printed keywords", () => {
  proveKeywordGroup({
    card: luBuIndomitableTitan,
    keywords: [
      {
        name: "taunt",
      },
      {
        name: "vigor",
      },
    ],
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack, advanceToMain } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { enragedBoars } from "../../DOA/allies/enraged-boars.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
/** @covers xyan7zbtxi-a3 @covers 1hlxj4rywq-a2 */
describe("Lu Bu — exact damage transformation and global reductions", () => {
  for (const named of [false, true])
    for (const damage of [31, 32, 33])
      it(`Diao Chan=${named}, damage=${damage}`, () => {
        const base = enableAllTestElements(
          createClassBonusTestChampion(luBuIndomitableTitan, false, "activation-discount"),
        );
        const champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: {
              ...requireSingleFace(base),
              lineageName: named ? "Diao Chan" : "Other",
              stats: { level: 0, life: 32 },
            },
          },
        };
        const opponent = grantTestChampionLevel(base, damage - 1);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [luBuIndomitableTitan, woodlandSquirrels, trainingSword],
              hand: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: opponent,
            zones: {
              field: [enragedBoars, woodlandSquirrels],
              hand: [
                fireball,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          source = p.card(luBuIndomitableTitan),
          ownAlly = p.card(woodlandSquirrels, { zone: "field" }),
          sword = p.card(trainingSword),
          boars = q.card(enragedBoars),
          enemyAlly = q.card(woodlandSquirrels, { zone: "field" });
        q.activate(fireball, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [hero.objectId] },
        });
        passEffectsStack(game);
        const transformed = named && damage === 32;
        if (transformed) {
          expect(game.state.decision?.kind).toBe("choose-replacement");
          if (game.state.decision?.kind !== "choose-replacement")
            throw new Error("Expected replacement choice");
          const replacement = game.state.decision.candidateIds.find((id) =>
            id.includes("xyan7zbtxi-a3"),
          );
          if (!replacement) throw new Error("Lu Bu replacement missing");
          answerDecision(game, "choose-replacement", replacement);
          passEffectsStack(game);
        }
        expect(game.state.objects[source.objectId]!.face).toBe(
          transformed ? "transformed" : "default",
        );
        if (!transformed) {
          expect(game.state.objects[hero.objectId]!.zone).toBe(
            damage >= 32 ? "banishment" : "field",
          );
          return;
        }
        expect(game.state.objects[hero.objectId]!.zone).toBe("banishment");
        expect(game.state.objects[ownAlly.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[sword.objectId]!.zone).toBe("banishment");
        const numeric = (id: typeof source.objectId, property: "level" | "power") =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(numeric(source.objectId, "level")).toBe(4);
        expect(numeric(source.objectId, "power")).toBe(8);
        expect(numeric(q.card(opponent).objectId, "level")).toBe(28);
        expect(numeric(boars.objectId, "power")).toBe(1);
        expect(numeric(enemyAlly.objectId, "power")).toBe(-2);
        advanceToMain(game, p.id);
        const entered = p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
        p.activate(entered);
        passEffectsStack(game);
        expect(numeric(entered.objectId, "power")).toBe(-2);
        p.declareAttack(source, q.card(opponent));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(opponent).objectId]!.damage).toBe(8);
      });
});

function finishLuBuCombat(game: GrandArchiveTestEngine, accept: boolean) {
  let offers = 0;
  for (let step = 0; step < 128; step++) {
    const decision = game.state.decision;
    if (decision?.kind === "resolve-optional-effect") {
      offers++;
      answerDecision(game, "resolve-optional-effect", accept);
    } else if (decision?.kind === "resolve-effect-payment") {
      const p = game.player(decision.playerId);
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() =>
        answerDecision(game, "resolve-effect-payment", { reservePayment: payment.slice(0, 1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      answerDecision(game, "resolve-effect-payment", { reservePayment: payment });
    } else if (decision?.kind === "choose-retaliators")
      answerDecision(game, "choose-retaliators", []);
    else if (!game.state.combat && game.state.stack.length === 0) return offers;
    else {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
  }
  throw new Error("Combat did not finish");
}
/** @covers xyan7zbtxi-a2 */
describe("Lu Bu — first attack reserve payment", () => {
  for (const matching of [false, true])
    for (const accept of [false, true])
      for (const earlierAllyAttack of [false, true])
        it(`class=${matching}, accept=${accept}, other ally attacked=${earlierAllyAttack}`, () => {
          const base = enableAllTestElements(
            createClassBonusTestChampion(luBuIndomitableTitan, matching, "activation-discount"),
          );
          const champion = {
            ...base,
            layout: {
              kind: "single-faced" as const,
              face: { ...requireSingleFace(base), stats: { level: 0, life: 60 } },
            },
          };
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [luBuIndomitableTitan, woodlandSquirrels],
                hand: Array.from({ length: 6 }, () => woodlandSquirrels),
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(luBuIndomitableTitan),
            enemy = q.card(champion);
          if (earlierAllyAttack) {
            p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), enemy);
            game.resolveCombatWithoutRetaliation();
          }
          p.declareAttack(source, enemy);
          expect(finishLuBuCombat(game, accept)).toBe(1);
          expect(p.zone("memory")).toHaveLength(accept ? 2 : 0);
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(!accept);
          if (accept) {
            p.declareAttack(source, enemy);
            expect(finishLuBuCombat(game, true)).toBe(0);
            expect(p.zone("memory")).toHaveLength(2);
          }
          expect(game.state.objects[enemy.objectId]!.damage).toBe(
            (earlierAllyAttack ? 1 : 0) + (accept ? 8 : 4),
          );
          advanceToMain(game, q.id);
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
          advanceToMain(game, p.id);
          p.declareAttack(source, enemy);
          expect(finishLuBuCombat(game, true)).toBe(1);
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
        });
});

import { imperialCountermeasure } from "../../RDO/actions/imperial-countermeasure.ts";
/** @covers 1hlxj4rywq-a1 @covers 1hlxj4rywq-a3 */
describe("Lu Bu, Wrath Incarnate — kill damage and Vigor", () => {
  for (const shield of [false, true])
    it(`unpreventable kill damage with shield=${shield}`, () => {
      const base = enableAllTestElements(
        createClassBonusTestChampion(luBuIndomitableTitan, false, "activation-discount"),
      );
      const champion = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: {
            ...requireSingleFace(base),
            lineageName: "Diao Chan",
            stats: { level: 0, life: 32 },
          },
        },
      };
      const opponent = grantTestChampionLevel(base, 31);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [luBuIndomitableTitan],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: opponent,
          zones: {
            field: [enragedBoars],
            hand: [
              fireball,
              imperialCountermeasure,
              ...Array.from({ length: 5 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(luBuIndomitableTitan),
        victim = q.card(enragedBoars),
        enemy = q.card(opponent);
      q.activate(fireball, {
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 4)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        targets: { "target-1": [p.card(champion).objectId] },
      });
      passEffectsStack(game);
      if (game.state.decision?.kind !== "choose-replacement")
        throw new Error("Expected replacement choice");
      const candidate = game.state.decision.candidateIds.find((id) => id.includes("xyan7zbtxi-a3"));
      if (!candidate) throw new Error("Missing Lu Bu replacement");
      answerDecision(game, "choose-replacement", candidate);
      passEffectsStack(game);
      q.declareAttack(victim, source);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[source.objectId]!.damage).toBe(1);
      advanceToMain(game, p.id);
      p.declareAttack(source, victim);
      if (shield) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error("Expected attack response");
        if (wait.playerId === p.id) p.pass();
        q.activate(imperialCountermeasure, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 1)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [enemy.objectId] },
        });
        passEffectsStack(game);
      }
      game.resolveCombatWithoutRetaliation();
      passEffectsStack(game);
      expect(game.state.objects[victim.objectId]!.zone).toBe("graveyard");
      expect(game.state.objects[enemy.objectId]!.damage).toBe(5);
      expect(game.state.objects[source.objectId]!.damage).toBe(1);
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      advanceToMain(game, q.id);
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
    });
});
