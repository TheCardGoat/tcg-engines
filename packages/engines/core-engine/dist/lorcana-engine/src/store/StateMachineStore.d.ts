import { type CardModel, type MoveResponse } from "@lorcanito/lorcana-engine";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { Actions, ChallengeState, Match, MatchStart, Phases, SerializedStateMachines, Steps } from "@lorcanito/lorcana-engine/types/types";
export type ChallengeStep = "DECLARE_CHALLENGE" | "CHOOSE_TARGET" | "CHECK_RESTRICTIONS" | "EXERT_CHALLENGER" | "CHALLENGE_OCCURS" | "APPLY_WHILE_CHALLENGING_EFFECTS" | "ADD_TRIGGERS_TO_BAG" | "CHALLENGE_DAMAGE" | "CHALLENGE_COMPLETE";
export type PlayCardStep = "ANNOUNCE_CARD" | "ANNOUNCE_PAYMENT_METHOD" | "DETERMINE_TOTAL_COST" | "PAY_COST" | "PLACE_CARD" | "RESOLVE_EFFECTS" | "PLAY_COMPLETE";
export type PlayCardParams = {
    bodyguard?: boolean;
    hasShifted?: boolean;
    forFree?: boolean;
    bottomCardAfterPlaying?: boolean;
    exerted?: boolean;
    alternativeCosts?: string[];
    singing?: boolean;
    singers?: string[];
    song?: string;
};
export interface PlayCardState {
    cardId: string | undefined;
    playerId: string | undefined;
    alternatePayment: boolean;
    totalCost: number;
    params?: PlayCardParams;
    costModifiers?: {
        additional: number;
        increases: number;
        reductions: number;
    };
}
export declare class StateMachineStore {
    readonly rootStore: MobXRootStore;
    private _startMatchMachine;
    action?: Actions;
    phase?: Phases;
    step?: Steps | ChallengeStep | PlayCardStep;
    challengeState?: ChallengeState;
    playCardState?: PlayCardState;
    matchStart?: MatchStart;
    constructor(initialState: Match["stateMachines"], rootStore: MobXRootStore, observable: boolean);
    sync(state: Match["stateMachines"]): void;
    toJSON(): Match["stateMachines"];
    get matchHasStarted(): boolean;
    get startMachine(): MatchStart;
    alterHand(playerId: string, cards: string[]): MoveResponse;
    hasPlayerAlteredHand(playerId: string): boolean;
    get currentPlayerAlteringHand(): string;
    isPlayerAlteringHand(playerId: string): boolean;
    get isChoosingWhoGoesFirst(): boolean;
    get priorityPlayer(): string;
    chooseFirstPlayer(playerId: string): MoveResponse;
    isGoingFirst(ownerId: string): boolean;
    trackAlteredCards(playerId: string, count: number): void;
    setPhase(phase: SerializedStateMachines["phase"]): void;
    setStep(step: SerializedStateMachines["step"]): void;
    setAction(action: SerializedStateMachines["action"]): void;
    startChallenge(attacker: string, defender: string): MoveResponse;
    endChallenge(): MoveResponse;
    setChallengeStep(step: ChallengeStep, attacker?: string, defender?: string): void;
    progressChallenge(): MoveResponse;
    resolveChallengeOutcome(attacker: CardModel, defender: CardModel): MoveResponse;
    get challengeInProgress(): boolean;
    get playInProgress(): boolean;
    startPlayCard(cardId: string, playerId: string, params?: {
        bodyguard?: boolean;
        hasShifted?: boolean;
        forFree?: boolean;
        bottomCardAfterPlaying?: boolean;
        exerted?: boolean;
        alternativeCosts?: string[];
        singing?: boolean;
        singers?: string[];
        song?: string;
    }): MoveResponse;
    endPlayCard(overwriteResult?: boolean): MoveResponse;
    setPlayCardStep(step: PlayCardStep, cardId: string, playerId: string, params?: {
        bodyguard?: boolean;
        hasShifted?: boolean;
        forFree?: boolean;
        bottomCardAfterPlaying?: boolean;
        exerted?: boolean;
        alternativeCosts?: string[];
    }): void;
    progressPlayCard(): MoveResponse;
}
//# sourceMappingURL=StateMachineStore.d.ts.map