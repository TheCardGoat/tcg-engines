import type { FloatingTriggeredAbility, ResolutionAbility, StaticAbility } from "@lorcanito/lorcana-engine";
import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
export declare const soMuchToGiveAbility: ResolutionAbility;
export declare const restoringTheHeartAbility: ResolutionAbility;
export declare const magicalManeuversAbility: ResolutionAbility;
export declare const thisIsMyFamilyAbility: ResolutionAbility;
export declare const showMeMoreAbilities: {
    type: string;
    name: string;
    text: string;
    responder: string;
    effects: import("@lorcanito/lorcana-engine").DrawEffect[];
}[];
export declare const weveGotCompanyAbility: ResolutionAbility;
export declare const outOfOrderAbility: ResolutionAbility;
export declare const waterHasMemoryAbility: ResolutionAbility;
export declare const restoringAtlantisAbility: ResolutionAbility;
export declare const theFamilyMadrigalAbility: ResolutionAbility;
export declare const theReturnOfHerculesAbility: ResolutionAbility[];
export declare const allIsFoundAbility: ResolutionAbility;
export declare const doubleTroubleAbility: ResolutionAbility;
export declare const inkGeyserAbility: ResolutionAbility[];
export declare const hesATrampAbility: {
    type: string;
    name: string;
    text: string;
    effects: {
        type: string;
        attribute: string;
        amount: {
            dynamic: boolean;
            filters: {
                filter: string;
                value: string;
            }[];
        };
        modifier: string;
        duration: string;
        target: import("@lorcanito/lorcana-engine").CardEffectTarget;
    }[];
};
export declare const wakeUpAliceAbility: {
    type: string;
    name: string;
    text: string;
    effects: {
        type: string;
        to: string;
        target: {
            type: string;
            value: number;
            filters: ({
                filter: string;
                value: string;
                comparison?: undefined;
            } | {
                filter: string;
                value: string;
                comparison: {
                    operator: string;
                    value: number;
                };
            })[];
        };
    }[];
};
export declare const restoringTheCrownAbilities: (ResolutionAbility | FloatingTriggeredAbility)[];
export declare const spaghettiDinnerAbility: ActivatedAbility;
export declare const kanineKrunchiesAbility: StaticAbility;
export declare const searchTheKingdom: ActivatedAbility;
export declare const amethystCoilAbility: import("@lorcanito/lorcana-engine").TriggeredAbility;
export declare const emeraldCoilAbility: import("@lorcanito/lorcana-engine").TriggeredAbility;
export declare const unconventionalToolAbility: import("@lorcanito/lorcana-engine").TriggeredAbility;
export declare const sapphireCoilAbility: import("@lorcanito/lorcana-engine").TriggeredAbility;
export declare const devilsEyeDiamondAbility: ActivatedAbility;
export declare const baymaxsChargingStationAbility: import("@lorcanito/lorcana-engine").TriggeredAbility;
export declare const amberCoilAbility: import("@lorcanito/lorcana-engine").TriggeredAbility;
export declare const rubyCoilAbility: import("@lorcanito/lorcana-engine").TriggeredAbility;
export declare const mauricesMachineAbility: import("@lorcanito/lorcana-engine").TriggeredAbility;
export declare const steelCoilAbility: import("@lorcanito/lorcana-engine").TriggeredAbility;
export declare const trainingStaffAbility: ActivatedAbility;
export declare const hiddenAwayAbility: StaticAbility;
export declare const taleOfTheFifthSpiritAbility: ResolutionAbility;
export declare const midnightFestivitiesAbility: ResolutionAbility;
export declare const madGrinAbility: ResolutionAbility;
export declare const pilferAndPlunderAbility: import("@lorcanito/lorcana-engine").TriggeredAbility;
//# sourceMappingURL=abilities.d.ts.map