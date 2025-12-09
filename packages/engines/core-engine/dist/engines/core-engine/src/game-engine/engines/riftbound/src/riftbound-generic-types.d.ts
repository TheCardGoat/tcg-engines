/**
 * Generic type definitions that extend the core engine for Riftbound TCG
 * These types integrate with the CoreEngine framework
 */
import type { CardInstanceState, CardRarity, CardType, CombatRole, Domain, RiftboundGameState as EngineGameState, PlayerState as EnginePlayerState, GamePhase, GameSegment, MoveResult, ResourceType, StatusCondition, ZoneType } from "./riftbound-engine-types";
export type { ZoneType, GamePhase, GameSegment, Domain, CardType, CardRarity, ResourceType, CombatRole, StatusCondition, CardInstanceState, MoveResult, };
export type RiftboundMoveType = "chooseDomainIdentity" | "selectBattlefields" | "mulligan" | "chooseFirstPlayer" | "channelRunes" | "activateRune" | "recycleCard" | "addResources" | "playCard" | "attachCard" | "activateAbility" | "activateKeyword" | "moveUnit" | "enterBattlefield" | "leaveBattlefield" | "declareCombat" | "declareDefenders" | "assignDamage" | "resolveCombat" | "enterShowdown" | "focusTarget" | "invitePlayer" | "scoreConquer" | "scoreHold" | "drawCard" | "discardCard" | "revealCard" | "hideCard" | "killPermanent" | "banishCard" | "endTurn" | "passPriority" | "concede" | "cleanup" | "passToNextPlayer";
export interface RiftboundMoveParams {
    chooseDomainIdentity: {
        domains: Domain[];
    };
    selectBattlefields: {
        battlefieldIds: string[];
    };
    mulligan: {
        cardsToMulligan: string[];
    };
    chooseFirstPlayer: {
        playerId: string;
    };
    channelRunes: {
        count: number;
        exhausted?: boolean;
    };
    activateRune: {
        instanceId: string;
        ability?: string;
    };
    recycleCard: {
        instanceIds: string[];
        fromZone: ZoneType;
    };
    addResources: {
        energy?: number;
        power?: Partial<Record<Domain, number>>;
    };
    playCard: {
        instanceId: string;
        targets?: string[];
        additionalCosts?: any[];
        location?: string;
    };
    attachCard: {
        instanceId: string;
        targetId: string;
    };
    activateAbility: {
        instanceId: string;
        abilityIndex: number;
        targets?: string[];
    };
    activateKeyword: {
        instanceId: string;
        keyword: string;
        targets?: string[];
    };
    moveUnit: {
        instanceIds: string[];
        destination: string;
    };
    enterBattlefield: {
        instanceId: string;
        battlefieldId: string;
    };
    leaveBattlefield: {
        instanceId: string;
    };
    declareCombat: {
        battlefieldId: string;
        attackers: string[];
        targets?: string[];
    };
    declareDefenders: {
        defenders: Record<string, string[]>;
    };
    assignDamage: {
        assignments: Record<string, number>;
    };
    resolveCombat: {
        battlefieldId: string;
    };
    enterShowdown: {
        battlefieldId: string;
        relevantPlayers: string[];
    };
    focusTarget: {
        playerId: string;
    };
    invitePlayer: {
        playerId: string;
    };
    scoreConquer: {
        battlefieldId: string;
    };
    scoreHold: {
        battlefieldId: string;
    };
    drawCard: {
        count: number;
    };
    discardCard: {
        instanceIds: string[];
    };
    revealCard: {
        instanceIds: string[];
        fromZone: ZoneType;
    };
    hideCard: {
        instanceId: string;
        battlefieldId: string;
    };
    killPermanent: {
        instanceIds: string[];
    };
    banishCard: {
        instanceIds: string[];
        fromZone: ZoneType;
    };
    endTurn: {};
    passPriority: {};
    concede: {};
    cleanup: {};
    passToNextPlayer: {};
}
export type RiftboundMove<T extends RiftboundMoveType = RiftboundMoveType> = (params: T extends keyof RiftboundMoveParams ? RiftboundMoveParams[T] : any) => MoveResult | Promise<MoveResult>;
export type RiftboundMoves = {
    [K in RiftboundMoveType]: RiftboundMove<K>;
};
export type RiftboundGameState = EngineGameState;
export type RiftboundPlayerState = EnginePlayerState;
export type { RiftboundMoveType as MoveType };
export type { RiftboundMoveParams as MoveParams };
export type { RiftboundMoves as Moves };
//# sourceMappingURL=riftbound-generic-types.d.ts.map