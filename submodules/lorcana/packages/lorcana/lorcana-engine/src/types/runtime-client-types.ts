/**
 * Client Runtime Types
 *
 * Types specific to the LorcanaClient that handle move composition,
 * validation, and execution results.
 */

import type { LorcanaRuntimeMoveInputs } from "./runtime-move-params";

/**
 * Setup move identifiers used during game setup phase
 */
export type SetupMoveId = "chooseWhoGoesFirst" | "alterHand";

/**
 * Result of composing a move request from dynamic parameters
 *
 * Success case: includes the moveId and composed input
 * Failure case: includes the moveId and reason for failure
 */
export type LorcanaMoveComposeResult =
  | {
      success: true;
      moveId: keyof LorcanaRuntimeMoveInputs & string;
      input: LorcanaRuntimeMoveInputs[keyof LorcanaRuntimeMoveInputs];
    }
  | {
      success: false;
      moveId: keyof LorcanaRuntimeMoveInputs & string;
      reason: string;
    };

/**
 * Validation result for a move request
 */
export type LorcanaMoveRequestValidation = {
  valid: boolean;
  reason?: string;
  code?: string;
};

/**
 * Execution result for a move request
 */
export type LorcanaMoveRequestExecution = {
  success: boolean;
  reason?: string;
  code?: string;
};
