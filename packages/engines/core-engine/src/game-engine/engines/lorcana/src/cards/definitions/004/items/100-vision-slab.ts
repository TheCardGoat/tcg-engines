import type {
  CardEffectTarget,
  LorcanitoItemCard,
} from "@lorcanito/lorcana-engine";
import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { targetCardsGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import {
  damageRemovalRestrictionEffect,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import type { StaticAbilityWithEffect } from "~/game-engine/engines/lorcana/src/abilities";

const cardsInPlay: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [{ filter: "zone", value: "play" }],
};

const damageCountersCannotBeRemovedAbility: StaticAbilityWithEffect = {
  type: "static",
  ability: "effects",
  name: "TRAPPED!",
  text: "Damage counters can't be removed.",
  effects: [damageRemovalRestrictionEffect],
};

export const visionSlab: LorcanaItemCardDefinition = {
  id: "mir",
  name: "Vision Slab",
  characteristics: ["item"],
  text: "**DANGER REVEALED** At the start of your turn, if an opposing character has damage, gain 1 lore. \n\n\n**TRAPPED!** Damage counters can't be removed.",
  type: "item",
  abilities: [
    targetCardsGains({
      name: "TRAPPED!",
      text: "Damage counters can't be removed.",
      target: cardsInPlay,
      ability: damageCountersCannotBeRemovedAbility,
    }),
    atTheStartOfYourTurn({
      name: "Danger Revealed",
      text: "At the start of your turn, if an opposing character has damage, gain 1 lore.",
      conditions: [
        {
          type: "filter",
          comparison: { operator: "gte", value: 1 },
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "opponent" },
            { filter: "status", value: "damaged" },
          ],
        },
      ],
      effects: [youGainLore(1)],
    }),
  ],
  flavour: "Tío Bruno! What's happening to him? We have to help!\n−Mirabel",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Jonas Petsuskas",
  number: 100,
  set: "URR",
  rarity: "uncommon",
};
