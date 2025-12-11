/**
 * Move Types
 *
 * Types for all game moves in Lorcana.
 */

import type { CardId } from "../types/game-state";

/**
 * Put card into inkwell move (Rule 4.3.3)
 */
export interface PutIntoInkwellMove {
  type: "putIntoInkwell";
  cardId: CardId;
}

/**
 * Payment method for playing cards
 */
export type PaymentMethod =
  | InkPayment
  | ShiftPayment
  | SingerPayment
  | SingTogetherPayment;

export interface InkPayment {
  type: "ink";
}

export interface ShiftPayment {
  type: "shift";
  targetCardId: CardId;
}

export interface SingerPayment {
  type: "singer";
  singerCardId: CardId;
}

export interface SingTogetherPayment {
  type: "singTogether";
  singerCardIds: CardId[];
}

/**
 * Play card move (Rule 4.3.4)
 */
export interface PlayCardMove {
  type: "playCard";
  cardId: CardId;
  paymentMethod: PaymentMethod;
}

/**
 * Move validation result
 */
export interface MoveValidationResult {
  valid: boolean;
  errors: MoveValidationError[];
}

/**
 * Move validation error types
 */
export type MoveValidationError =
  | { type: "ALREADY_INKED_THIS_TURN" }
  | { type: "CARD_NOT_INKABLE" }
  | { type: "INSUFFICIENT_INK"; required: number; available: number }
  | { type: "INVALID_SHIFT_TARGET"; reason: string }
  | { type: "INVALID_SHIFT_TARGET"; expectedName: string; actualName?: string }
  | { type: "INVALID_SINGER"; reason: string }
  | { type: "INVALID_SINGER"; expectedKeyword: string }
  | { type: "INVALID_PAYMENT_METHOD" }
  | { type: "NOT_IN_HAND" }
  | { type: "NOT_YOUR_TURN" }
  | { type: "NOT_MAIN_PHASE" }
  | { type: "CARD_NOT_FOUND" }
  | { type: "SINGER_NOT_DRY" }
  | { type: "SINGER_VALUE_TOO_LOW"; singerValue: number; songCost: number }
  | { type: "NOT_A_SONG" }
  | { type: "NOT_YOUR_CHARACTER" }
  | { type: "NOT_IN_PLAY" }
  | { type: "NOT_A_CHARACTER" }
  | { type: "NOT_READY" }
  | { type: "NOT_DRY" }
  | { type: "HAS_RECKLESS" }
  | { type: "INVALID_TARGET" }
  | { type: "TARGET_NOT_IN_PLAY" }
  | { type: "CANNOT_CHALLENGE_OWN" }
  | { type: "TARGET_NOT_EXERTED" }
  | { type: "BODYGUARD_BLOCKING"; bodyguardId: CardId }
  | { type: "NOT_YOUR_CARD" }
  | { type: "CARD_NOT_READY" }
  | { type: "CARD_IS_DRYING" }
  | {
      type: "INSUFFICIENT_CARDS_TO_DISCARD";
      required: number;
      available: number;
    }
  | { type: "ABILITY_NOT_FOUND"; abilityId: string }
  | { type: "CUSTOM_COST_NOT_MET" };

/**
 * Cost calculation result
 */
export interface CostCalculation {
  baseCost: number;
  increases: CostModifier[];
  reductions: CostModifier[];
  totalCost: number;
}

export interface CostModifier {
  source: CardId | "effect";
  amount: number;
  reason: "cost_increase" | "cost_reduction" | "shift_alternate" | "other";
  description?: string;
}

/**
 * Create a successful validation result
 */
export function validMove(): MoveValidationResult {
  return { valid: true, errors: [] };
}

/**
 * Create a failed validation result
 */
export function invalidMove(
  ...errors: MoveValidationError[]
): MoveValidationResult {
  return { valid: false, errors };
}

/**
 * Check if a payment method is ink payment
 */
export function isInkPayment(payment: PaymentMethod): payment is InkPayment {
  return payment.type === "ink";
}

/**
 * Check if a payment method is shift payment
 */
export function isShiftPayment(
  payment: PaymentMethod,
): payment is ShiftPayment {
  return payment.type === "shift";
}

/**
 * Check if a payment method is singer payment
 */
export function isSingerPayment(
  payment: PaymentMethod,
): payment is SingerPayment {
  return payment.type === "singer";
}

/**
 * Check if a payment method is sing together payment
 */
export function isSingTogetherPayment(
  payment: PaymentMethod,
): payment is SingTogetherPayment {
  return payment.type === "singTogether";
}
