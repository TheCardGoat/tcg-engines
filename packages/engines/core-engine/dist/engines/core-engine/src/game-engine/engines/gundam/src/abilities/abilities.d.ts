import type { Ability, ActionAbility, BlockerAbility, MainAbility, RepairAbility } from "./types";
export declare const mainOrActionAbility: (ability: Omit<MainAbility, "type"> | Omit<ActionAbility, "type">) => Ability[];
export declare const repairAbility: (value: number) => RepairAbility;
export declare const blockerAbility: BlockerAbility;
//# sourceMappingURL=abilities.d.ts.map