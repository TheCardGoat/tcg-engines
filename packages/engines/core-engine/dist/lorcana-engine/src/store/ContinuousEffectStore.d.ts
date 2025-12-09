import { AbilityModel } from "@lorcanito/lorcana-engine";
import { type ContinuousEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import { ContinuousEffectModel } from "@lorcanito/lorcana-engine/store/models/ContinuousEffectModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
export declare class ContinuousEffectStore {
    continuousEffects: ContinuousEffectModel[];
    private readonly rootStore;
    private readonly observable;
    constructor(initialState: ContinuousEffect[], rootStore: MobXRootStore, observable: boolean);
    sync(effects?: ContinuousEffect[]): void;
    toJSON(): ContinuousEffect[] | undefined;
    startContinuousEffect(effect: ContinuousEffectModel): void;
    stopContinuousEffect(effect: ContinuousEffectModel): void;
    get length(): number;
    findContinuousEffect(id: string): ContinuousEffectModel | undefined;
    onPlay(card: CardModel): void;
    onLeave(card: CardModel): void;
    onTurnPassed(turn: number): void;
    onChallenge(attacker: CardModel, defender: CardModel): void;
    onChallengeFinished(): void;
    findContinuousEffectsByCard(card: CardModel): ContinuousEffectModel[];
    getGainedAbilitiesFromContinuousEffects(card: CardModel, filters: Array<(ability: AbilityModel) => boolean | undefined>): AbilityModel[];
    getQuestRestriction(card: CardModel): ContinuousEffectModel[];
    getDamageRemovalRestriction(card: CardModel): ContinuousEffectModel[];
    getDamageDealtRestriction(card: CardModel): ContinuousEffectModel[];
    getChallengeRestriction(card: CardModel): ContinuousEffectModel[];
    getChallengeCharactersRestriction(card: CardModel): ContinuousEffectModel[];
    getExertRestriction(card: CardModel): ContinuousEffectModel[];
    getPlayerEffects(playerId: string): ContinuousEffectModel[];
    moveEffectsToCard(param: {
        from: CardModel;
        to: CardModel;
    }): void;
}
//# sourceMappingURL=ContinuousEffectStore.d.ts.map