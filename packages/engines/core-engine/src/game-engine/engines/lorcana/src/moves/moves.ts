import { alterHandMove } from "./alterHand";
import { chooseWhoGoesFirstMove } from "./chooseFirstPlayer";
import { concedeMove } from "./concede";
import { passTurnMove } from "./pass-turn";
import { putACardIntoTheInkwellMove } from "./put-a-card-into-the-inkwell";

// Mock moves to be implemented
// Placeholder for play card move
const playCardMove = () => {
  // 4.3.4 Play a card
  // - Player announces and reveals card from hand
  // - Player announces how they intend to play it (ink cost or alternate)
  // - Player determines total cost (with modifiers)
  // - Player pays the total cost
  // - Card enters appropriate zone
  // - Effects that trigger wait until card is fully played and resolved
  return {};
};

// Placeholder for quest move
const questWithCharacterMove = () => {
  // 4.3.5 Quest
  // - Player declares character is questing
  // - Identify questing character and check restrictions
  // - Exert the questing character
  // - Player gains lore equal to {L} of questing character
  // - Effects from quest are added to the bag
  return {};
};

// Placeholder for character challenge move
const challengeCharacterMove = () => {
  // 4.3.6 Challenge (Character)
  // - Player declares character is challenging
  // - Choose exerted opposing character to be challenged
  // - Check for challenge restrictions
  // - Exert the challenging character
  // - Apply "while challenging" effects
  // - Add trigger effects to bag
  // - Deal damage equal to {S} to each character
  // - Resolve effects from banished characters
  // - End challenge
  return {};
};

// Placeholder for location challenge move
const challengeLocationMove = () => {
  // 4.3.6.19 Challenge (Location)
  // - Player declares character is challenging
  // - Choose opposing location to challenge
  // - Check for challenge restrictions
  // - Exert the challenging character
  // - Apply "while challenging" effects
  // - Add trigger effects to bag
  // - Location doesn't deal damage back
  // - End challenge
  return {};
};

// Placeholder for move character to location move
const moveCharacterToLocationMove = () => {
  // 4.3.7 Move a character to a location
  // - Player chooses one of their characters and locations
  // - Player pays the location's move cost
  // - Character moves to the location
  // - Effects from moving are added to the bag
  return {};
};

// Placeholder for using an activated ability
const useActivatedAbilityMove = () => {
  // 4.3.8 Use activated abilities on cards in play
  // - {E} abilities only if character is dry
  // - Activated abilities of items can be used the turn played
  // - Follow steps in section 7.5 "Activated Abilities"
  return {};
};

// Consolidated Lorcana move registry
export const lorcanaMoves = {
  // Game Setup Moves
  chooseWhoGoesFirstMove,
  alterHand: alterHandMove,
  // Core Game Moves
  passTurn: passTurnMove,
  putACardIntoTheInkwell: putACardIntoTheInkwellMove,
  playCard: playCardMove,
  questWithCharacter: questWithCharacterMove,
  challengeCharacter: challengeCharacterMove,
  challengeLocation: challengeLocationMove,
  moveCharacterToLocation: moveCharacterToLocationMove,
  useActivatedAbility: useActivatedAbilityMove,
  // System Moves
  concede: concedeMove,
};
