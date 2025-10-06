import { banishChallengingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
import { whenChallengedAndBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cheshireCat: LorcanaCharacterCardDefinition = {
  id: "mmz",

  name: "Cheshire Cat",
  title: "Not All There",
  characteristics: ["storyborn"],
  text: "**Lose something?** When this character is challenged and banished, banish the challenging character.",
  type: "character",
  abilities: [
    whenChallengedAndBanished({
      name: "Lose Something?",
      text: "When this character is challenged and banished, banish the challenging character.",
      effects: [banishChallengingCharacter],
    }),
  ],
  flavour: '"You may have noticed that I\'m not all there myself."',
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  willpower: 3,
  strength: 0,
  lore: 2,
  illustrator: "Caner Soylu",
  number: 71,
  set: "TFC",
  rarity: "uncommon",
};
