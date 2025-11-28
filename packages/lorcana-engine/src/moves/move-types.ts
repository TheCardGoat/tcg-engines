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
  | { type: "INVALID_SINGER"; reason: string }
  | { type: "NOT_IN_HAND" }
  | { type: "NOT_YOUR_TURN" }
  | { type: "NOT_MAIN_PHASE" }
  | { type: "CARD_NOT_FOUND" }
  | { type: "SINGER_NOT_DRY" }
  | { type: "SINGER_VALUE_TOO_LOW"; singerValue: number; songCost: number }
  | { type: "NOT_A_SONG" };

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
  reason: string;
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
