import type { AttributeEffect, DynamicAmount, StaticAbility } from "@lorcanito/lorcana-engine";
import type { StaticAbilityWithEffect } from "@lorcanito/lorcana-engine/abilities/abilities";
export declare function propertyStaticAbilities({ name, text, conditions, attribute, amount, target, modifier, }: {
    name: string;
    text: string;
    conditions?: StaticAbility["conditions"];
    attribute: AttributeEffect["attribute"];
    target?: AttributeEffect["target"];
    modifier?: AttributeEffect["modifier"];
    amount: number | DynamicAmount;
}): StaticAbilityWithEffect;
//# sourceMappingURL=propertyStaticAbilities.d.ts.map