import {
  drawACard,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import {
  evasiveAbility,
  yourOtherCharactersWithGain,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dumboNinthWonderOfTheUniverse: LorcanitoCharacterCardDefinition = {
  id: "uxf",
  name: "Dumbo",
  title: "Ninth Wonder of the Universe",
  characteristics: ["storyborn", "hero"],
  text: 'Evasive\nBREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.\nMAKING HISTORY Your other characters with Evasive gain "{E}, 1 {I} – Draw a card and gain 1 lore."',
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 3,
  illustrator: "Mariana Moreno",
  number: 45,
  set: "009",
  rarity: "legendary",
  abilities: [
    evasiveAbility,
    {
      type: "activated",
      name: "BREAKING RECORDS",
      text: "{E}, 1 {I} – If you have 2 or more characters in play, gain 1 lore.",
      costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
      effects: [youGainLore(1), drawACard],
    },
    yourOtherCharactersWithGain({
      name: "MAKING HISTORY",
      text: 'Your other characters with Evasive gain "{E}, 1 {I} – Draw a card and gain 1 lore."',
      filter: { filter: "ability", value: "evasive" },
      gainedAbility: {
        name: "MAKING HISTORY",
        type: "activated",
        text: "{E}, 1 {I} – If you have 2 or more characters in play, gain 1 lore.",
        costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
        effects: [youGainLore(1), drawACard],
      },
    }),
  ],
  lore: 1,
};
