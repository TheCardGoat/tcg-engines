import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseDetective: LorcanitoCharacterCardDefinition = {
  id: "aec",
  name: "Mickey Mouse",
  title: "Detective",
  characteristics: ["hero", "dreamborn", "detective"],
  text: "**GET A CLUE** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Get a Clue",
      text: "When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
      optional: true,
      effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
    }),
  ],
  flavour:
    "Wherever the seaweed had come from, Mickey was sure of one thing: something fishy was going on.",
  colors: ["sapphire"],
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Jared Nickerl",
  number: 154,
  set: "TFC",
  rarity: "common",
};
