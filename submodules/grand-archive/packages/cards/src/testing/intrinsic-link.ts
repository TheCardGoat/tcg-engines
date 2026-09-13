import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion, grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

function attackingChampion(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  const champion = createClassBonusTestChampion(card, true, "activation-discount");
  if (champion.layout.kind !== "single-faced") throw new Error("Expected a single-faced champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...champion.layout.face,
        stats: { ...champion.layout.face.stats, power: 1 },
      },
    },
  };
}

function advanceToPlayerMain(
  game: GrandArchiveTestEngine,
  playerId: string,
  nextTurn = false,
): void {
  const initialTurn = game.state.turn.number;
  for (let step = 0; step < 128; step++) {
    if (
      game.state.turn.playerId === playerId &&
      game.state.turn.phase === "main" &&
      (!nextTurn || game.state.turn.number > initialTurn)
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else if (wait.kind === "game-over") throw new Error("Match ended while advancing to main");
    else throw new Error(`Unexpected ${wait.kind} while advancing to main`);
  }
  throw new Error("Did not reach the requested main phase");
}

function faceOf(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  return grandArchiveTestFace(card);
}

function reserveAmount(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>): number {
  const cost = faceOf(card).cost;
  if (cost.kind !== "reserve" || typeof cost.amount !== "number") return 0;
  return cost.amount;
}

function memoryAmount(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>): number {
  const cost = faceOf(card).cost;
  if (cost.kind !== "memory" || typeof cost.amount !== "number") return 0;
  return cost.amount;
}

/** Parameterized Link is card-specific: prove the printed host filter and sacrifice-on-break. */
export function proveIntrinsicLink({
  card,
  host,
  invalidHost,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly host: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly invalidHost: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
}): void {
  const cost = faceOf(card).cost;
  const playFromMaterial = cost.kind === "memory";

  function setup() {
    const champion = attackingChampion(card);
    const reserve = Array.from({ length: reserveAmount(card) }, () => woodlandSquirrels);
    const memory = Array.from({ length: memoryAmount(card) }, () => woodlandSquirrels);
    return GrandArchiveTestEngine.startFixture({
      phase: playFromMaterial ? "materialize" : "main",
      playerOne: {
        champion,
        zones: {
          field: [host, invalidHost],
          hand: playFromMaterial ? [] : [card, ...reserve],
          "material-deck": playFromMaterial ? [card] : [],
          memory,
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
    });
  }

  it("enters linked to a legal host and rejects an illegal host without entering", () => {
    const illegal = setup();
    const illegalPlayer = illegal.player("player-one");
    const illegalHost = illegalPlayer.card(invalidHost, { zone: "field" });
    const before = illegal.state;
    const illegalTargets = { "intrinsic-link-target": [illegalHost.objectId] };
    expect(() =>
      playFromMaterial
        ? illegalPlayer.materialize(card, { targets: illegalTargets })
        : illegalPlayer.activate(card, {
            targets: illegalTargets,
            reservePayment: illegalPlayer
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          }),
    ).toThrow();
    expect(illegal.state).toEqual(before);

    const game = setup();
    const player = game.player("player-one");
    const legalHost = player.card(host, { zone: "field" });
    const targets = { "intrinsic-link-target": [legalHost.objectId] };
    if (playFromMaterial) player.materialize(card, { targets });
    else
      player.activate(card, {
        targets,
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
    passEffectsStack(game);
    const linked = player.card(card, { zone: "field" });
    expect(game.state.objects[linked.objectId]?.hostId).toBe(legalHost.objectId);
    expect(game.state.objects[legalHost.objectId]?.zone).toBe("field");
  });

  it("sacrifices itself when the linked host leaves the field", () => {
    const game = setup();
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const legalHost = player.card(host, { zone: "field" });
    const targets = { "intrinsic-link-target": [legalHost.objectId] };
    if (playFromMaterial) player.materialize(card, { targets });
    else
      player.activate(card, {
        targets,
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
    passEffectsStack(game);
    const linked = player.card(card, { zone: "field" });

    const hostFace = faceOf(host);
    if (hostFace.typeLine.types.includes("ALLY")) {
      advanceToPlayerMain(game, opponent.id);
      const attackers = opponent.cards(woodlandSquirrels, { zone: "field" });
      opponent.declareAttack(attackers[0]!, legalHost);
      game.resolveCombatWithoutRetaliation();
      if (game.state.objects[legalHost.objectId]?.zone === "field") {
        opponent.declareAttack(attackers[1]!, legalHost);
        game.resolveCombatWithoutRetaliation();
      }
    } else if (hostFace.typeLine.types.includes("WEAPON")) {
      advanceToPlayerMain(game, player.id);
      const durability = game.state.objects[legalHost.objectId]?.counters.durability ?? 0;
      for (let swing = 0; swing < Math.max(1, durability); swing += 1) {
        if (game.state.objects[legalHost.objectId]?.zone !== "field") break;
        if (swing > 0) advanceToPlayerMain(game, player.id, true);
        const attack = player
          .legalCommands()
          .map((candidate) => candidate.command)
          .find(
            (command) =>
              command.move === "declare-attack" &&
              command.weaponIds?.includes(legalHost.objectId) &&
              !command.delegatePlayerId,
          );
        if (!attack) throw new Error("No legal attack wielding the linked weapon");
        player.execute(attack);
        game.resolveCombatWithoutRetaliation();
      }
    } else {
      throw new Error(`proveIntrinsicLink needs an ally or weapon host, got ${hostFace.name}`);
    }

    expect(game.state.objects[legalHost.objectId]?.zone).not.toBe("field");
    expect(game.state.objects[linked.objectId]?.zone).not.toBe("field");
  });
}
