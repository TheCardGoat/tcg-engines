/**
 * Core type definitions for the One Piece TCG engine
 * Based on the comprehensive One Piece TCG rules
 */
export type ZoneType = "deck" | "hand" | "donDeck" | "costArea" | "lifeArea" | "trash" | "leaderArea" | "characterArea" | "stageArea";
export type CardCategory = "leader" | "character" | "event" | "stage" | "don";
export type CardColor = "red" | "green" | "blue" | "purple" | "black" | "yellow";
export type CardAttribute = "slash" | "strike" | "ranged" | "special" | "wisdom";
export type CardState = "active" | "rested";
export type GamePhase = "refreshPhase" | "drawPhase" | "donPhase" | "mainPhase" | "endPhase";
export type GameSegment = "preGame" | "gamePlay" | "gameEnd";
export type OnePieceGameCondition = "normal" | "gameOver";
export type CardRarity = "common" | "uncommon" | "rare" | "super-rare" | "secret-rare";
export type DefeatCondition = "noLife" | "noDeck" | "concede" | "cardEffect";
export interface PlayerState {
    id: string;
    name: string;
    zones: {
        deck: string[];
        hand: string[];
        donDeck: string[];
        costArea: string[];
        lifeArea: string[];
        trash: string[];
        leaderArea: string[];
        characterArea: string[];
        stageArea: string[];
    };
    isFirstPlayer: boolean;
    hasDrawnFirstTurn: boolean;
    hasPlacedDonFirstTurn: boolean;
    defeatCondition?: DefeatCondition;
    hasLost: boolean;
}
export interface OnePieceGameState {
    foo?: string;
}
export interface CardInstanceState {
    instanceId: string;
    cardId: string;
    owner: string;
    controller: string;
    zone: ZoneType;
    position?: number;
    state: CardState;
    power?: number;
    attachedDon: string[];
    powerModifier: number;
    canAttack: boolean;
    hasAttacked: boolean;
    playedThisTurn: boolean;
}
export interface MoveResult {
    success: boolean;
    error?: string;
    gameState?: OnePieceGameState;
    logs?: string[];
}
export interface BattleInfo {
    attacker: string;
    target: string;
    attackerPower: number;
    targetPower: number;
    battleResult: "attackerWins" | "targetWins" | "noResult";
}
export interface DamageInfo {
    target: string;
    amount: number;
    source?: string;
    triggerActivated?: boolean;
}
export type GameCards = Record<string, Record<string, string>>;
//# sourceMappingURL=one-piece-engine-types.d.ts.map