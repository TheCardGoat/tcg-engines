import { wheneverIsReturnedToHand } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import {
  readyAndCantQuest,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";

const racerCharacterInDiscard: CardEffectTarget = {
  type: "card",
  value: 1,
  excludeSelf: true,
  filters: [
    { filter: "owner", value: "self" },
    { filter: "type", value: "character" },
    { filter: "characteristics", value: ["racer"] },
    { filter: "zone", value: "discard" },
  ],
};

const racerCharacterInPlay: CardEffectTarget = {
  type: "card",
  value: 1,
  excludeSelf: true,
  filters: [
    { filter: "owner", value: "self" },
    { filter: "type", value: "character" },
    { filter: "characteristics", value: ["racer"] },
    { filter: "zone", value: "play" },
  ],
};

export const fixitFelixJrPintsizedHero: LorcanitoCharacterCard = {
  id: "vw2",
  name: "Fix‐It Felix, Jr.",
  title: "Pint‐Sized Hero",
  characteristics: ["storyborn", "hero", "racer"],
  type: "character",
  inkwell: true,
  colors: ["amber", "ruby"],
  cost: 5,
  strength: 4,
  willpower: 4,
  illustrator: "Stefano Spagnuolo",
  number: 22,
  set: "007",
  rarity: "uncommon",
  lore: 2,
  text: "LET'S GET TO WORK Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can't quest for the rest of this turn.",
  abilities: [
    wheneverIsReturnedToHand({
      name: "LET'S GET TO WORK",
      text: "Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can't quest for the rest of this turn.",
      optional: true,
      target: racerCharacterInDiscard,
      effects: readyAndCantQuest(racerCharacterInPlay),
    }),
  ],
};
