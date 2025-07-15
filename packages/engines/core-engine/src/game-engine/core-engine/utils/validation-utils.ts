import type { CoreCtx } from "../state/context";
import { isValidContext } from "../state/context";
import { logger } from "./logger";

// Re-export the isValidContext function from context.ts
export { isValidContext };

// Re-export all validation functions from the new validation module
export {
  getValidatedZone,
  hasPlayerPriority,
  isCardInZone,
  isPlayerTurn,
  isValidCardInstanceId,
  isValidPlayerId,
  isValidZoneId,
  validateCardInstanceId,
  validateCardInZone,
  validateContextStructure,
  validatePlayerId,
  validatePlayerOrder,
  validatePlayerPriority,
  validatePlayerTurn,
  validateZoneId,
  validateZoneNotEmpty,
  validateZoneOwnership,
} from "./validation";
