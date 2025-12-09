/**
 * Core type definitions for the Riftbound TCG engine
 * Based on the comprehensive Riftbound rules analysis
 */
export type ZoneType = "deck" | "hand" | "resourceDeck" | "base" | "removalArea" | "trash" | "legendZone" | "championZone" | "sideboard";
export type BattlefieldZoneType = "battlefield" | "facedown";
export type GamePhase = "awakening" | "beginning" | "channel" | "draw" | "action" | "ending";
export type GameSegment = "setup" | "mulligan" | "gamePlay" | "gameEnd";
export type Domain = "fury" | "calm" | "mind" | "body" | "chaos" | "order";
export type CardType = "unit" | "gear" | "spell" | "rune" | "battlefield" | "legend";
export type CardRarity = "common" | "uncommon" | "rare" | "mythic";
export type ResourceType = "energy" | "power";
export type RiftboundGameStates = "neutral-open" | "neutral-closed" | "showdown-open" | "showdown-closed";
export type CombatRole = "attacker" | "defender" | "none";
export type StatusCondition = "ready" | "exhausted" | "stunned" | "buffed" | "damaged";
export interface PlayerState {
    id: string;
    name: string;
    zones: {
        deck: string[];
        hand: string[];
        resourceDeck: string[];
        base: string[];
        removalArea: string[];
        trash: string[];
        legendZone: string[];
        championZone: string[];
        sideboard: string[];
    };
    points: number;
    burnOutCount: number;
    energyPool: number;
    powerPool: Record<Domain, number>;
    universalPower: number;
    combatRole: CombatRole;
    hasPlayedCard: boolean;
    hasScored: Set<string>;
    focus: boolean;
    isRelevantPlayer: boolean;
    domainIdentity: Domain[];
    chosenChampion?: string;
    championLegend?: string;
}
export interface Battlefield {
    id: string;
    owner: string;
    controller?: string;
    contested: boolean;
    units: Record<string, string[]>;
    facedownZone: {
        cardId?: string;
        controller?: string;
    };
    battlefieldCard: string;
    combatState: "none" | "pending" | "active" | "resolved";
    pointValue: number;
}
export interface RiftboundGameState {
    gameState: RiftboundGameStates;
    battlefields: Record<string, Battlefield>;
    victoryScore: number;
    gameMode: string;
    teamMode?: boolean;
    teams?: Record<string, string[]>;
    pendingCombats: string[];
    currentCombat?: {
        battlefieldId: string;
        attacker: string;
        defender: string;
        attackers: string[];
        defenders: string[];
    };
    chain: Array<{
        type: "spell" | "ability";
        controller: string;
        source?: string;
        targets?: string[];
    }>;
    showdown?: {
        battlefieldId: string;
        relevantPlayers: string[];
        focusPlayer: string;
    };
    battlefieldControl: Record<string, string | null>;
    contestedBattlefields: Set<string>;
}
export interface CardInstanceState {
    instanceId: string;
    cardId: string;
    owner: string;
    controller: string;
    zone: ZoneType;
    position?: number;
    damage: number;
    buffs: number;
    statusConditions: Set<StatusCondition>;
    mightModifier: number;
    costModifier: {
        energy: number;
        power: Record<Domain, number>;
    };
    temporaryKeywords: string[];
    temporaryAbilities: string[];
    combatRole: CombatRole;
    combatDamageAssigned: number;
    location?: string;
    isHidden?: boolean;
    hiddenAt?: string;
    attachedTo?: string;
    attachments: string[];
}
export interface MoveResult {
    success: boolean;
    error?: string;
    gameState?: RiftboundGameState;
    logs?: string[];
}
export interface GameState extends RiftboundGameState {
}
//# sourceMappingURL=riftbound-engine-types.d.ts.map