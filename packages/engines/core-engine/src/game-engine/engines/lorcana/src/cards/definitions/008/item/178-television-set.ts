import type {
  CardEffectTarget,
  LorcanitoItemCard,
} from "@lorcanito/lorcana-engine";
import { topCardOfYourDeck } from "@lorcanito/lorcana-engine/abilities/targets";
import type { RevealTopCardEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";

const puppyCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
    { filter: "characteristics", value: ["puppy"] },
  ],
};

const revealTopPuppyAndPutIntoHand: RevealTopCardEffect = {
  type: "reveal-top-card",
  target: puppyCharacter,
  onTargetMatchEffects: [
    {
      type: "move",
      to: "hand",
      shouldRevealMoved: true,
      target: topCardOfYourDeck,
    },
  ],
  onTargetMatchFailureEffects: [
    {
      type: "move",
      to: "deck",
      bottom: true,
      target: topCardOfYourDeck,
    },
  ],
};

const isItOnYet: ActivatedAbility = {
  type: "activated",
  name: "IS IT ON YET?",
  text: "{E}, 1 {I} – Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.",
  costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
  effects: [revealTopPuppyAndPutIntoHand],
};

export const televisionSet: LorcanaItemCardDefinition = {
  id: "kqe",
  name: "Television Set",
  characteristics: ["item"],
  text: "IS IT ON YET? {E}, 1 {I} – Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.",
  type: "item",
  abilities: [isItOnYet],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Mariana Moreno",
  number: 178,
  set: "008",
  rarity: "common",
};
