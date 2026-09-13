import { registerGameAdapter } from "@tcg/shared/game-adapter";
import { gundamServerAdapter } from "./adapter.js";

export { gundamServerAdapter } from "./adapter.js";
export { GundamServerEngine } from "./gundam-server-engine.js";
export {
  applyGundamPresentationToView,
  cardWithPresentationPrinting,
  readGundamPresentation,
  resolveGundamPresentationPrintingId,
  type GundamPresentation,
} from "./gundam-presentation.js";
export { GUNDAM_RUNTIME_FINGERPRINT } from "./runtime-fingerprint.js";
export {
  GUNDAM_MAIN_DECK_SECTION_ID,
  GUNDAM_RESOURCE_DECK_SECTION_ID,
  GUNDAM_SETUP_SECTION_ID,
  GUNDAM_SIDEBOARD_SECTION_ID,
  applyGundamSetupPresentationToDocument,
  getGundamSetupPresentationSlots,
  gundamDeckCardsToDocument,
  gundamDeckDocumentToCards,
  gundamDeckDocumentToDeckList,
  gundamDeckInterchangeAdapter,
  gundamDeckListToDocument,
  gundamSetupPresentationFromDocument,
  type GundamDeckListDocumentResult,
  type GundamSetupPresentation,
  type GundamSetupPresentationSlot,
  type GundamSetupPresentationSlotKey,
} from "./gundam-deck-document.js";
export {
  decodeGundamDeckDocumentFromText,
  encodeGundamDeckDocumentToText,
  type GundamDeckTextDecodeResult,
  type GundamDeckTextDiagnostic,
  type GundamDeckTextEncodeDiagnostic,
  type GundamDeckTextEncodeResult,
} from "./gundam-deck-text.js";
export {
  gundamDeckValidationToLegalityReport,
  type GundamDeckLegalityReportOptions,
} from "./gundam-deck-legality-report.js";
export {
  buildGundamInteractionView,
  describeGundamInteractionProcedure,
  gundamSubmissionToPayload,
  gundamTargetInputBinding,
  seedGundamInteractionSource,
  type GundamInteractionPayload,
  type GundamPendingChoice,
  type GundamPendingMoveStep,
} from "./interaction-protocol.js";

/**
 * Register the Gundam adapter with the global registry. Idempotent.
 */
export function registerGundamServerAdapter(): void {
  registerGameAdapter(gundamServerAdapter);
}

export * from "./gundam-animation.js";
