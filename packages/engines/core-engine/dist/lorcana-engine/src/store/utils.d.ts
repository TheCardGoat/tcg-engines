import { type Ability } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { ContinuousEffectModel } from "@lorcanito/lorcana-engine/store/models/ContinuousEffectModel";
export declare const mapContinuousEffectToAbility: (element: ContinuousEffectModel) => Ability | undefined;
export declare const keywordToAbilityPredicate: (keyword: AbilityEffect["ability"]) => ((ability: Ability) => boolean);
export declare function normalizeToSafeASCII(str: string): string;
export declare function extraSafeJSONStringify(str: unknown): string;
//# sourceMappingURL=utils.d.ts.map