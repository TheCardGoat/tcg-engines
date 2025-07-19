import { exertCard } from "~/game-engine/engines/lorcana/src/moves/manualMoves";
import { alterHandMove } from "./alterHand";
import { challengeMove } from "./challenge";
import { chooseWhoGoesFirstMove } from "./chooseFirstPlayer";
import { concedeMove } from "./concede";
import { moveCharacter } from "./move-character-to-location";
import { passTurnMove } from "./pass-turn";
import { playCardMove } from "./play-card";
import { putACardIntoTheInkwellMove } from "./put-a-card-into-the-inkwell";
import { questMove } from "./quest";
import { useActivatedAbilityMove } from "./use-activated-ability";

export const lorcanaMoves = {
  // Game Setup Moves
  chooseWhoGoesFirstMove,
  alterHand: alterHandMove,
  // Core Game Moves
  passTurn: passTurnMove,
  putACardIntoTheInkwell: putACardIntoTheInkwellMove,
  playCard: playCardMove,
  quest: questMove,
  challenge: challengeMove,
  moveCharacterToLocation: moveCharacter,
  useActivatedAbility: useActivatedAbilityMove,
  manualMoves: {
    exertCard,
  },
  // Testing/Debug Moves
  concede: concedeMove,
};
