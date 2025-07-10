import type {
  Ability,
  ActionAbility,
  BlockerAbility,
  MainAbility,
  RepairAbility,
} from "./types";

export const mainOrActionAbility = (
  ability: Omit<MainAbility, "type"> | Omit<ActionAbility, "type">,
): Ability[] => {
  return [
    {
      type: "main",
      ...ability,
    },
    {
      type: "action",
      ...ability,
    },
  ];
};

export const repairAbility = (value: number): RepairAbility => ({
  name: "Repair",
  text: `At the start of your turn, this unit recovers ${value} of HP.`,
  type: "static",
  abilityType: "repair",
  value,
});

export const blockerAbility: BlockerAbility = {
  name: "Blocker",
  text: "(Rest this Unit to change the attack target to it.)",
  type: "static",
  abilityType: "blocker",
};
