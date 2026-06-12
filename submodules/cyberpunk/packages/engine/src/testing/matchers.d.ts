import type { CardZone } from "@tcg/cyberpunk-types";
import type { GamePhase } from "../types/match-state.ts";

declare global {
  namespace Chai {
    interface Assertion {
      toBeSuccessfulCommand(): Assertion;
      toBeInZone(zone: CardZone): Assertion;
      toHaveEddies(expected: { player: string; count: number }): Assertion;
      toBeInPhase(phase: GamePhase): Assertion;
      toHaveEffectivePower(expected: { card: string; value: number }): Assertion;
      toBeSpent(): Assertion;
      toBeReady(): Assertion;
      toHaveDamage(amount: number): Assertion;
      toBeFaceDown(): Assertion;
      toHaveZoneCounts(expected: { player: string } & Partial<Record<CardZone, number>>): Assertion;
      toBeActivePlayer(expected: string): Assertion;
    }
  }
}

declare module "vite-plus/test" {
  interface Assertion<T = any> {
    toBeSuccessfulCommand(): T;
    toBeInZone(zone: CardZone): T;
    toHaveEddies(expected: { player: string; count: number }): T;
    toBeInPhase(phase: GamePhase): T;
    toHaveEffectivePower(expected: { card: string; value: number }): T;
    toBeSpent(): T;
    toBeReady(): T;
    toHaveDamage(amount: number): T;
    toBeFaceDown(): T;
    toHaveZoneCounts(expected: { player: string } & Partial<Record<CardZone, number>>): T;
    toBeActivePlayer(expected: string): T;
  }
}

declare module "@voidzero-dev/vite-plus-test" {
  interface Assertion<T = any> {
    toBeSuccessfulCommand(): T;
    toBeInZone(zone: CardZone): T;
    toHaveEddies(expected: { player: string; count: number }): T;
    toBeInPhase(phase: GamePhase): T;
    toHaveEffectivePower(expected: { card: string; value: number }): T;
    toBeSpent(): T;
    toBeReady(): T;
    toHaveDamage(amount: number): T;
    toBeFaceDown(): T;
    toHaveZoneCounts(expected: { player: string } & Partial<Record<CardZone, number>>): T;
    toBeActivePlayer(expected: string): T;
  }
}

declare module "@voidzero-dev/vite-plus-test/dist/@vitest/expect/index.js" {
  interface Matchers<T = any> {
    toBeSuccessfulCommand(): T;
    toBeInZone(zone: CardZone): T;
    toHaveEddies(expected: { player: string; count: number }): T;
    toBeInPhase(phase: GamePhase): T;
    toHaveEffectivePower(expected: { card: string; value: number }): T;
    toBeSpent(): T;
    toBeReady(): T;
    toHaveDamage(amount: number): T;
    toBeFaceDown(): T;
    toHaveZoneCounts(expected: { player: string } & Partial<Record<CardZone, number>>): T;
    toBeActivePlayer(expected: string): T;
  }

  interface Assertion<T = any> {
    toBeSuccessfulCommand(): T;
    toBeInZone(zone: CardZone): T;
    toHaveEddies(expected: { player: string; count: number }): T;
    toBeInPhase(phase: GamePhase): T;
    toHaveEffectivePower(expected: { card: string; value: number }): T;
    toBeSpent(): T;
    toBeReady(): T;
    toHaveDamage(amount: number): T;
    toBeFaceDown(): T;
    toHaveZoneCounts(expected: { player: string } & Partial<Record<CardZone, number>>): T;
    toBeActivePlayer(expected: string): T;
  }
}

declare module "@voidzero-dev/vite-plus-test/dist/@vitest/expect/index" {
  interface Matchers<T = any> {
    toBeSuccessfulCommand(): T;
    toBeInZone(zone: CardZone): T;
    toHaveEddies(expected: { player: string; count: number }): T;
    toBeInPhase(phase: GamePhase): T;
    toHaveEffectivePower(expected: { card: string; value: number }): T;
    toBeSpent(): T;
    toBeReady(): T;
    toHaveDamage(amount: number): T;
    toBeFaceDown(): T;
    toHaveZoneCounts(expected: { player: string } & Partial<Record<CardZone, number>>): T;
    toBeActivePlayer(expected: string): T;
  }

  interface Assertion<T = any> {
    toBeSuccessfulCommand(): T;
    toBeInZone(zone: CardZone): T;
    toHaveEddies(expected: { player: string; count: number }): T;
    toBeInPhase(phase: GamePhase): T;
    toHaveEffectivePower(expected: { card: string; value: number }): T;
    toBeSpent(): T;
    toBeReady(): T;
    toHaveDamage(amount: number): T;
    toBeFaceDown(): T;
    toHaveZoneCounts(expected: { player: string } & Partial<Record<CardZone, number>>): T;
    toBeActivePlayer(expected: string): T;
  }
}

export {};
