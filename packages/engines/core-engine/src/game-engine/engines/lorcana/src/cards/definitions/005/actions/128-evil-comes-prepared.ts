import type {
  CardEffectTarget,
  LorcanitoActionCard,
  TargetConditionalEffect,
} from "@lorcanito/lorcana-engine";
import {
  chosenCharacter,
  chosenCharacterOfYours,
} from "@lorcanito/lorcana-engine/abilities/targets";
import {
  readyAndCantQuest,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";

const targetingVillain: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    {
      filter: "characteristics",
      value: ["villain"],
    },
  ],
};

const evilComesEffect: TargetConditionalEffect = {
  type: "target-conditional",
  effects: [...readyAndCantQuest(targetingVillain), youGainLore(1)],
  fallback: [...readyAndCantQuest(chosenCharacter)],
  // TODO: Re implement conditional target
  target: targetingVillain,
};

export const evilComesPrepared: LorcanitoActionCard = {
  id: "xc5",
  missingTestCase: true,
  name: "Evil Comes Prepared",
  characteristics: ["action"],
  text: "Ready chosen character of yours. They can’t quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Ready chosen character of yours. They can’t quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
      effects: [evilComesEffect],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  lore: 1,
  illustrator: "Adam Bunch",
  number: 128,
  set: "SSK",
  rarity: "common",
};
