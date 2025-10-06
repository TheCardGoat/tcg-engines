import { oneOfYourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverIsReturnedToHand } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const merlinShapeshifter: LorcanitoCharacterCardDefinition = {
  id: "lcu",
  name: "Merlin",
  title: "Shapeshifter",
  characteristics: ["sorcerer", "storyborn", "mentor"],
  text: "**BATTLE OF WITS** Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.",
  type: "character",
  abilities: [
    wheneverIsReturnedToHand({
      name: "Battle of Wits",
      text: "Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.",
      target: oneOfYourOtherCharacters,
      // from: "play",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    }),
  ],
  flavour: "Oh, blast it all−I can’t make up my mind.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  illustrator: "Matthew Robert Davies",
  number: 53,
  set: "ROF",
  rarity: "rare",
};
