import { alterHandMove } from "./alterHand";
import { challengeMove } from "./challenge";
import { chooseWhoGoesFirstMove } from "./chooseFirstPlayer";
import { concedeMove } from "./concede";
import { moveCharacterToLocationMove } from "./move-character-to-location";
import { passTurnMove } from "./pass-turn";
import { playCardMove } from "./play-card";
import { putACardIntoTheInkwellMove } from "./put-a-card-into-the-inkwell";
import { questMove } from "./quest";
import { useActivatedAbilityMove } from "./use-activated-ability";
// Consolidated Lorcana move registry
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
    moveCharacterToLocation: moveCharacterToLocationMove,
    useActivatedAbility: useActivatedAbilityMove,
    // System Moves
    concede: concedeMove,
};
//# sourceMappingURL=moves.js.map