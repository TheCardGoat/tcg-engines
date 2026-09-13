/**
 * Fluent assert helpers for card refs + player-visible counts.
 *
 *   expect(p1).toHaveHandCount(3);
 *   expectCard(p1, st01Gundam001).toBeIn("battleArea");
 *   expectCard(p1, st01Gundam001).toBeRested();
 */

import type { Card } from "@tcg/gundam-types";
import type { GundamPlayerActions, GundamPlayerId, GundamTestEngine } from "./test-engine.ts";
import {
  type CardInstanceRef,
  type CardRef,
  type CardRefFilter,
  isCardDefinition,
  isCardInstanceRef,
  resolveCardRef,
} from "./card-ref.ts";
import { PLAYER_ONE } from "./test-engine.ts";

export function expectCard(
  player: GundamPlayerActions,
  card: CardRef,
  filter?: CardRefFilter,
): FluentCardAssert {
  const ref = resolveCardRef(player.runtime, player.playerId, card, filter ?? {});
  return new FluentCardAssert(player, ref);
}

export class FluentCardAssert {
  private readonly player: GundamPlayerActions;
  private readonly ref: CardInstanceRef;

  constructor(player: GundamPlayerActions, ref: CardInstanceRef) {
    this.player = player;
    this.ref = ref;
  }

  get instanceId(): string {
    return this.ref.instanceId;
  }

  toBeIn(zone: string): this {
    const actual = this.player.getCardZone(this.ref.instanceId);
    const prefix = `${zone}:`;
    if (!actual?.startsWith(prefix) && actual !== zone) {
      throw new Error(
        `Expected ${this.ref.definitionId} in ${zone} but was ${actual ?? "missing"}`,
      );
    }
    return this;
  }

  toBeRested(): this {
    if (!this.player.isExhausted(this.ref.instanceId)) {
      throw new Error(`Expected ${this.ref.definitionId} to be rested`);
    }
    return this;
  }

  toBeReady(): this {
    if (this.player.isExhausted(this.ref.instanceId)) {
      throw new Error(`Expected ${this.ref.definitionId} to be ready`);
    }
    return this;
  }

  toHaveDamage(value: number): this {
    const actual = this.player.getDamage(this.ref.instanceId);
    if (actual !== value) {
      throw new Error(`Expected ${this.ref.definitionId} to have damage ${value}, got ${actual}`);
    }
    return this;
  }

  toHaveAp(value: number): this {
    const actual = this.player.getVisibleCard(this.ref.instanceId)?.effectiveAp;
    if (actual !== value) {
      throw new Error(`Expected ${this.ref.definitionId} AP ${value}, got ${actual}`);
    }
    return this;
  }

  toHaveHp(value: number): this {
    const actual = this.player.getVisibleCard(this.ref.instanceId)?.effectiveHp;
    if (actual !== value) {
      throw new Error(`Expected ${this.ref.definitionId} HP ${value}, got ${actual}`);
    }
    return this;
  }

  toShowKeyword(keyword: string): this {
    const kws = this.player.getVisibleCard(this.ref.instanceId)?.keywords ?? [];
    if (!kws.includes(keyword)) {
      throw new Error(
        `Expected ${this.ref.definitionId} to show keyword ${keyword}, got [${kws.join(", ")}]`,
      );
    }
    return this;
  }

  /**
   * Assert the Unit is paired. When `pilot` is a definition, also check the
   * assigned pilot's definitionId. When it is an instance id/ref, require an
   * exact match. Always checks unit projection `pilotId` matches assignment.
   */
  toHavePilot(pilot?: CardRef): this {
    const pilotId = this.player.getPilotId(this.ref.instanceId);
    if (!pilotId) {
      throw new Error(`Expected ${this.ref.definitionId} to have a paired Pilot`);
    }
    const projected = this.player.getVisibleCard(this.ref.instanceId)?.pilotId;
    if (projected !== pilotId) {
      throw new Error(
        `Unit ${this.ref.definitionId} assignment pilot ${pilotId} does not match projection ${String(projected)}`,
      );
    }
    if (pilot === undefined) return this;

    if (isCardDefinition(pilot)) {
      const defId = this.player.getVisibleCard(pilotId)?.definitionId;
      if (defId !== pilot.cardNumber) {
        throw new Error(
          `Expected pilot ${pilot.cardNumber} on ${this.ref.definitionId}, got ${String(defId)}`,
        );
      }
      return this;
    }

    const expectedId = isCardInstanceRef(pilot) ? pilot.instanceId : pilot;
    if (expectedId !== pilotId) {
      throw new Error(`Expected pilot ${expectedId} on ${this.ref.definitionId}, got ${pilotId}`);
    }
    return this;
  }
}

export function expectPlayer(player: GundamPlayerActions): FluentPlayerAssert {
  return new FluentPlayerAssert(player);
}

export class FluentPlayerAssert {
  private readonly player: GundamPlayerActions;

  constructor(player: GundamPlayerActions) {
    this.player = player;
  }

  toHaveHandCount(n: number): this {
    const actual = this.player.handCount();
    if (actual !== n) throw new Error(`Expected hand count ${n}, got ${actual}`);
    return this;
  }

  toHaveDeckCount(n: number): this {
    const actual = this.player.deckCount();
    if (actual !== n) throw new Error(`Expected deck count ${n}, got ${actual}`);
    return this;
  }

  toHaveShieldCount(n: number): this {
    const actual = this.player.shieldCount();
    if (actual !== n) throw new Error(`Expected shield count ${n}, got ${actual}`);
    return this;
  }

  toHaveZoneCount(zone: string, n: number): this {
    const actual = this.player.getCardsInZone(zone).length;
    if (actual !== n) throw new Error(`Expected ${zone} count ${n}, got ${actual}`);
    return this;
  }

  toHaveResourceCount(n: number): this {
    const actual = this.player.getResourceCount();
    if (actual !== n) throw new Error(`Expected resource count ${n}, got ${actual}`);
    return this;
  }

  /** Assert board-view turn ownership (player-visible; not raw ctx). */
  toBeTurnPlayer(): this {
    const view = this.player.getBoardView();
    if (view.turnPlayer !== this.player.playerId) {
      throw new Error(
        `Expected turnPlayer ${this.player.playerId}, got ${String(view.turnPlayer)}`,
      );
    }
    return this;
  }

  /** Assert board-view phase/step (player-visible). */
  toBeInPhase(phase: string, step?: string): this {
    const view = this.player.getBoardView();
    if (view.phase !== phase) {
      throw new Error(`Expected phase ${phase}, got ${String(view.phase)}`);
    }
    if (step !== undefined && view.step !== step) {
      throw new Error(`Expected step ${step}, got ${String(view.step)}`);
    }
    return this;
  }

  /** Assert global turn counter from the player-visible board view. */
  toHaveTurnNumber(n: number): this {
    const actual = this.player.getBoardView().turn;
    if (actual !== n) {
      throw new Error(`Expected turn number ${n}, got ${String(actual)}`);
    }
    return this;
  }
}

export function expectWinnerIs(engine: GundamTestEngine, winner: GundamPlayerId | undefined): void {
  const actual = engine.asPlayer(PLAYER_ONE).getBoardView().winner;
  if (actual !== winner) {
    throw new Error(`Expected winner ${String(winner)}, got ${String(actual)}`);
  }
}

export type { Card, CardRef, CardInstanceRef };
