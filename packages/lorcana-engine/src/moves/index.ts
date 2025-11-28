/**
 * Moves Module
 *
 * Move types and validation for Lorcana game actions.
 */

// Inkwell moves
export {
  canPutIntoInkwell,
  getInkableCardsInHand,
  validatePutIntoInkwell,
} from "./inkwell";
// Move types
export {
  type CostCalculation,
  type CostModifier,
  type InkPayment,
  invalidMove,
  isInkPayment,
  isShiftPayment,
  isSingerPayment,
  isSingTogetherPayment,
  type MoveValidationError,
  type MoveValidationResult,
  type PaymentMethod,
  type PlayCardMove,
  type PutIntoInkwellMove,
  type ShiftPayment,
  type SingerPayment,
  type SingTogetherPayment,
  validMove,
} from "./move-types";

// Play card moves
export {
  calculateCost,
  canPlayCard,
  validatePlayCard,
  validateShiftPayment,
  validateSingerPayment,
  validateSingTogetherPayment,
} from "./play-card";
