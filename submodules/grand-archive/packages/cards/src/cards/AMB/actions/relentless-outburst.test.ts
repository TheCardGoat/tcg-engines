import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { grandArchiveDefaultFaceId } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { relentlessOutburst } from "./relentless-outburst.ts";

function highLifeChampion(classBonus: boolean, level: number) {
  const { starter, lineage } = classBonusLeveledChampion(relentlessOutburst, classBonus, level);
  const withLife = (card: typeof starter, life: number) => {
    if (card.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
    return {
      ...card,
      layout: {
        kind: "single-faced" as const,
        face: { ...card.layout.face, stats: { ...card.layout.face.stats, life } },
      },
    };
  };
  return { starter: withLife(starter, 50), lineage: lineage.map((card) => withLife(card, 50)) };
}

function crushingSquirrel(power: number) {
  if (woodlandSquirrels.layout.kind !== "single-faced") {
    throw new Error("Expected single-faced squirrel");
  }
  const canonicalId = `crushing-squirrel-${power}`;
  return {
    ...woodlandSquirrels,
    canonicalId,
    slug: canonicalId,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...woodlandSquirrels.layout.face,
        id: grandArchiveDefaultFaceId(canonicalId),
        catalogId: canonicalId,
        stats: { ...woodlandSquirrels.layout.face.stats, power, life: 1 },
      },
    },
  };
}

function dealDamageToChampion(
  game: GrandArchiveTestEngine,
  amount: number,
  firstPlayer: "player-one" | "player-two",
): void {
  const attacker = game.player(firstPlayer === "player-one" ? "player-two" : "player-one");
  const defender = game.player(firstPlayer);
  const champion = defender.zone("field")[0]!;
  const source = attacker.cards(crushingSquirrel(amount), { zone: "field" })[0];
  if (!source) throw new Error("Missing crushing squirrel");
  attacker.declareAttack(source, champion);
  game.resolveCombatWithoutRetaliation();
}

/** @covers oobp8g4cpe-a2 */
describe("Relentless Outburst — damage for every six counters", () => {
  it("deals one to every other unit per six damage on its controller's champion", () => {
    const { starter, lineage } = highLifeChampion(false, 0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion: starter,
        lineage,
        zones: {
          field: [automatedGardener],
          hand: [relentlessOutburst, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: starter,
        zones: {
          field: [crushingSquirrel(12), automatedGardener],
          "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    dealDamageToChampion(game, 12, "player-one");
    opponent.pass();
    for (let step = 0; step < 32; step++) {
      if (game.state.turn.playerId === player.id && game.state.turn.phase === "main") break;
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    const self = player.zone("field")[0]!;
    const ownAlly = player.card(automatedGardener, { zone: "field" });
    const foe = opponent.zone("field")[0]!;
    const foeAlly = opponent.card(automatedGardener, { zone: "field" });
    expect(game.state.objects[self.objectId]!.damage).toBe(12);
    player.activate(relentlessOutburst, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[ownAlly.objectId]!.damage).toBe(2);
    expect(game.state.objects[foe.objectId]!.damage).toBe(2);
    expect(game.state.objects[foeAlly.objectId]!.damage).toBe(2);
    expect(game.state.objects[self.objectId]!.damage).toBe(14);
  });
});

/** @covers oobp8g4cpe-a1 */
describe("Relentless Outburst — Class Bonus damage 35+ replacement", () => {
  it("adds one to the next damage the targeted champion takes only with class and 35 damage", () => {
    for (const enabled of [false, true]) {
      const { starter, lineage } = highLifeChampion(enabled, 0);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion: starter,
          lineage,
          zones: {
            hand: [
              relentlessOutburst,
              nascentBlast,
              ...Array.from({ length: 6 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: starter,
          zones: {
            field: [crushingSquirrel(enabled ? 35 : 12)],
            "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      dealDamageToChampion(game, enabled ? 35 : 12, "player-one");
      opponent.pass();
      for (let step = 0; step < 32; step++) {
        if (game.state.turn.playerId === player.id && game.state.turn.phase === "main") break;
        const wait = game.waitState();
        if (wait.kind === "materialization-choice")
          game.player(wait.playerId).execute({ move: "skip-materialization" });
        else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
        else throw new Error(`Unexpected ${wait.kind}`);
      }
      const foe = opponent.zone("field")[0]!;
      const payment = player.cards(woodlandSquirrels, { zone: "hand" });
      player.activate(relentlessOutburst, {
        reservePayment: payment.slice(0, 3).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
        ...(enabled ? { targets: { "target-1": [foe.objectId] } } : {}),
      });
      passEffectsStack(game);
      const beforeBlast = game.state.objects[foe.objectId]!.damage;
      player.activate(nascentBlast, {
        reservePayment: payment.slice(3, 6).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
        targets: { "target-1": [foe.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[foe.objectId]!.damage).toBe(beforeBlast + (enabled ? 4 : 3));
    }
  });
});
