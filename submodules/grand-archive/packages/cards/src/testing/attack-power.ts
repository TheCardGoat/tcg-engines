import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack, declareResolvedAttack, answerDecision } from "./decisions.ts";
export function proveAttackPower({
  card,
  cost,
  power,
  classBonus = false,
  level = 0,
  restedTarget = false,
  allyTarget = false,
  cleave = false,
  retaliationAllowed,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  power: number;
  classBonus?: boolean;
  level?: number;
  restedTarget?: boolean;
  allyTarget?: boolean;
  cleave?: boolean;
  retaliationAllowed?: boolean;
}): void {
  it(`deals ${power}, class=${classBonus}, level=${level}, rested=${restedTarget}`, () => {
    const base = grantTestChampionLevel(
        createClassBonusTestChampion(card, classBonus, "activation-discount"),
        level,
      ),
      face = requireSingleFace(base);
    const champion = {
      ...base,
      layout: {
        kind: "single-faced" as const,
        face: { ...face, elements: [...face.elements, "WATER" as const] },
      },
    };
    const enemyBase = createClassBonusTestChampion(card, !classBonus, "activation-discount"),
      enemyFace = requireSingleFace(enemyBase),
      opponent = {
        ...enemyBase,
        layout: {
          kind: "single-faced" as const,
          face: { ...enemyFace, stats: { ...enemyFace.stats, power: 1 } },
        },
      };
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            card,
            ...(restedTarget ? [glacialGuidance] : []),
            ...Array.from({ length: cost + Number(restedTarget) }, () => woodlandSquirrels),
          ],
        },
      },
      playerTwo: { champion: opponent, zones: { field: [giantTortoise] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      target = q.card(allyTarget ? giantTortoise : opponent);
    if (restedTarget) {
      p.activate(glacialGuidance, {
        reservePayment: [
          { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
    }
    const payment = p
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    if (cost > 0) {
      const before = game.state;
      expect(() =>
        p.activate(card, {
          attackAttackerId: p.card(champion).objectId,
          reservePayment: payment.slice(1),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    p.activate(card, { attackAttackerId: p.card(champion).objectId, reservePayment: payment });
    passEffectsStack(game);
    if (cleave) {
      const decision = game.state.decision;
      if (decision?.kind !== "declare-resolved-attack")
        throw new Error("Expected attack declaration");
      game
        .player(decision.playerId)
        .executeLegal(
          (candidate) =>
            candidate.command.move === "answer-decision" &&
            typeof candidate.command.answer === "object" &&
            candidate.command.answer !== null &&
            "cleavePlayerId" in candidate.command.answer &&
            candidate.command.answer.cleavePlayerId === q.id,
          "Declare the cleaving attack against the opponent",
        );
    } else
      declareResolvedAttack(
        game,
        p.card(champion).objectId,
        target.objectId,
        "Declare the resolved attack",
      );
    let offered = false;
    for (let step = 0; game.state.combat && step < 96; step++) {
      if (game.state.decision?.kind === "choose-retaliators") {
        offered = true;
        answerDecision(game, "choose-retaliators", retaliationAllowed ? [target.objectId] : []);
      } else {
        const wait = game.waitState();
        if (wait.kind !== "opportunity")
          throw new Error(`Unexpected ${wait.kind}: ${JSON.stringify(game.state.decision)}`);
        game.player(wait.playerId).pass();
      }
    }
    expect(game.state.combat).toBeNull();
    expect(game.state.objects[target.objectId]!.damage).toBe(power);
    if (cleave) expect(game.state.objects[q.card(giantTortoise).objectId]!.damage).toBe(power);
    if (retaliationAllowed !== undefined) {
      expect(offered).toBe(retaliationAllowed);
      expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(
        retaliationAllowed ? 1 : 0,
      );
    }
  });
}
