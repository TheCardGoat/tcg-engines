import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { aesanProtector } from "../cards/DOA/allies/aesan-protector.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

function attackingChampion(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  const champion = enableAllTestElements(
    createClassBonusTestChampion(card, true, "activation-discount"),
  );
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
    else if (wait.kind === "decision" && game.state.decision?.kind === "resolve-optional-effect")
      game.player(wait.playerId).execute({
        move: "answer-decision",
        decisionId: game.state.decision.id,
        stateVersion: game.state.decision.stateVersion,
        answer: false,
      });
    else if (wait.kind === "decision" && game.state.decision?.kind === "order-triggered-abilities")
      game.player(wait.playerId).execute({
        move: "answer-decision",
        decisionId: game.state.decision.id,
        stateVersion: game.state.decision.stateVersion,
        answer: game.state.decision.pendingTriggerIds,
      });
    else if (wait.kind === "decision") {
      const decision = game.state.decision;
      if (!decision) throw new Error("Advancing lost its decision");
      if (decision.kind === "resolve-optional-effect")
        game.player(wait.playerId).execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: false,
        });
      else if (decision.kind === "order-triggered-abilities")
        game.player(wait.playerId).execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: decision.pendingTriggerIds,
        });
      else if (decision.kind === "resolve-effect-choice")
        game.player(wait.playerId).execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: [],
        });
      else if (decision.kind === "choose-retaliators")
        game.player(wait.playerId).execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: [],
        });
      else if (decision.kind === "announce-triggered-ability")
        game.player(wait.playerId).execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: {},
        });
      else throw new Error(`Unexpected decision ${decision.kind} while advancing to main`);
    } else throw new Error(`Unexpected ${wait.kind} while advancing to main`);
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

function drainCombat(game: GrandArchiveTestEngine, maxSteps = 64): void {
  for (let step = 0; step < maxSteps && game.state.combat; step += 1) {
    const wait = game.waitState();
    if (wait.kind === "decision") {
      const decision = game.state.decision;
      if (decision?.kind === "order-triggered-abilities") {
        game.player(wait.playerId).execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: decision.pendingTriggerIds,
        });
        continue;
      }
      if (decision?.kind === "choose-retaliators") {
        game.player(wait.playerId).execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: [],
        });
        continue;
      }
      if (decision?.kind === "resolve-optional-effect") {
        game.player(wait.playerId).execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: false,
        });
        continue;
      }
      throw new Error(`Combat drain stopped at unsupported decision ${decision?.kind}.`);
    }
    if (wait.kind !== "opportunity") throw new Error(`Combat drain stopped at ${wait.kind}.`);
    game.player(wait.playerId).pass();
  }
}

/**
 * Parameterized Link is card-specific: prove the printed host filter and
 * sacrifice-on-break. Pass "champion" to target the fixture's own champion.
 */
export function proveIntrinsicLink({
  card,
  host,
  invalidHost,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly host: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> | "champion";
  readonly invalidHost: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> | "champion";
}): void {
  const cost = faceOf(card).cost;
  const playFromMaterial = cost.kind === "memory";
  const championDefinition = attackingChampion(card);
  const resolveHost = (
    game: GrandArchiveTestEngine,
    selection: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> | "champion",
  ) =>
    game
      .player("player-one")
      .card(selection === "champion" ? championDefinition : selection, { zone: "field" });

  function setup() {
    const champion = attackingChampion(card);
    const reserve = Array.from({ length: reserveAmount(card) }, () => woodlandSquirrels);
    const memory = Array.from({ length: memoryAmount(card) }, () => woodlandSquirrels);
    const fieldHosts = [host, invalidHost].map((selection) =>
      selection === "champion" ? champion : selection,
    );
    return GrandArchiveTestEngine.startFixture({
      phase: playFromMaterial ? "materialize" : "main",
      playerOne: {
        champion,
        zones: {
          field: fieldHosts,
          hand: playFromMaterial ? [] : [card, ...reserve],
          "material-deck": playFromMaterial ? [card] : [],
          memory,
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [aesanProtector, aesanProtector],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
    });
  }

  it("enters linked to a legal host and rejects an illegal host without entering", () => {
    const illegal = setup();
    const illegalPlayer = illegal.player("player-one");
    const illegalHost = resolveHost(illegal, invalidHost);
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
    const legalHost = resolveHost(game, host);
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
    const legalHost = resolveHost(game, host);
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

    const hostFaceCard = faceOf(host === "champion" ? championDefinition : host);
    if (hostFaceCard.typeLine.types.includes("CHAMPION")) {
      // A champion host only leaves the field when its controller loses, so
      // link-break sacrifice cannot occur during a playable game state.
      expect(game.state.objects[linked.objectId]?.hostId).toBe(
        game.player("player-one").card(championDefinition, { zone: "field" }).objectId,
      );
      return;
    }
    if (hostFaceCard.typeLine.types.includes("ALLY")) {
      advanceToPlayerMain(game, opponent.id);
      const attackers = opponent.cards(aesanProtector, { zone: "field" });
      opponent.declareAttack(attackers[0]!, legalHost);
      game.resolveCombatWithoutRetaliation();
      if (game.state.objects[legalHost.objectId]?.zone === "field") {
        opponent.declareAttack(attackers[1]!, legalHost);
        game.resolveCombatWithoutRetaliation();
      }
    } else if (hostFaceCard.typeLine.types.includes("WEAPON")) {
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
        drainCombat(game);
      }
    } else {
      throw new Error(`proveIntrinsicLink needs an ally or weapon host, got ${hostFaceCard.name}`);
    }

    expect(game.state.objects[legalHost.objectId]?.zone).not.toBe("field");
    expect(game.state.objects[linked.objectId]?.zone).not.toBe("field");
  });
}
