import type { AbilityModel } from "@lorcanito/lorcana-engine";
import type { FloatingTriggeredAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import { FloatingTriggeredAbilityModel } from "@lorcanito/lorcana-engine/store/models/FloatingTriggeredAbilityModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { PlayCardParams } from "@lorcanito/lorcana-engine/store/StateMachineStore";
import type { Match, Zones } from "@lorcanito/lorcana-engine/types/types";
export declare class StaticTriggeredStore {
    private readonly rootStore;
    private readonly observable;
    delayedTriggeredAbilities: Array<FloatingTriggeredAbilityModel>;
    constructor(rootStore: MobXRootStore, observable: boolean);
    sync(triggeredAbilities?: FloatingTriggeredAbility[]): void;
    toJSON(): Match["triggeredAbilities"];
    private getTriggers;
    private trigger;
    onBanish(banishedCard: CardModel, params?: {
        attacker?: CardModel;
        defender?: CardModel;
    }): void;
    onChallenge(attacker: CardModel, defender: CardModel): void;
    onEnterLocation(character: CardModel, location: CardModel, previousLocation?: CardModel): void;
    onQuest(card: CardModel): void;
    onDamage(trigger: CardModel, params: {
        amount: number;
        damageSource?: CardModel;
        isChallenge?: boolean;
        attacker?: CardModel;
        defender?: CardModel;
    }): void;
    onHeal({ target, amount, triggeredBy, }: {
        target: CardModel;
        amount: number;
        triggeredBy?: CardModel;
    }): void;
    onDiscard(discarded: CardModel): void;
    onPutIntoInkwell(card: CardModel): void;
    onDraw(cardDraw: CardModel, source?: CardModel): void;
    onReady(card: CardModel): void;
    onLeavePlay(trigger: CardModel, destination: Zones, from: Zones): void;
    onPlay(card: CardModel, params?: PlayCardParams): void;
    onShift(card: CardModel, params: {
        shifted: CardModel;
        shifter: CardModel;
    }): void;
    onExert(card: CardModel): void;
    onSing(singer: CardModel, song: CardModel): void;
    onEndOfTurn(playerId: string): void;
    onStartOfTurn(playerId: string): void;
    startDelayedAbility(model: AbilityModel): void;
    stopDelayedEffect(abilityModel: FloatingTriggeredAbilityModel): void;
    onTurnPassed(turn: number): void;
}
//# sourceMappingURL=StaticTriggeredStore.d.ts.map