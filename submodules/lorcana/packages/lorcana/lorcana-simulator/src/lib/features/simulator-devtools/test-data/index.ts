// Test Data Factories
// Use these to generate realistic mock data for stories and tests

export {
  // Card factories
  createCardSnapshot,
  createCharacterCard,
  createActionCard,
  createLogCardReference,
  createHand,
  createBoardCharacters,
  createInkwell,
  createDiscard,

  // Player state
  createPlayerState,
  maskCards,

  // Action factories
  createActionCandidate,
  createDefaultActions,

  // Log factories
  createLogEntry,
  createSampleLog,

  // Types
  type CardFactoryOptions,
  type PlayerState,
} from "./factories.js";
