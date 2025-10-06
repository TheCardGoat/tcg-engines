import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const almaMadrigalFamilyMatriarch: LorcanaCharacterCardDefinition = {
  id: "lxy",
  name: "Alma Madrigal",
  title: "Family Matriarch",
  characteristics: ["storyborn", "mentor", "madrigal"],
  text: "**ALL AT THE TABLE** When you play this character, look at your deck. You may reveal a Madrigal character card. Shuffle your deck and put that card on top of your deck.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "ALL AT THE TABLE",
      dependentEffects: true,
      resolveEffectsIndividually: true,
      text: "When you play this character, look at your deck. You may reveal a Madrigal character card. Shuffle your deck and put that card on top of your deck.",
      effects: [
        {
          type: "move",
          to: "deck",
          bottom: false,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "deck" },
              { filter: "owner", value: "self" },
              { filter: "characteristics", value: ["madrigal"] },
            ],
          },
        },
        {
          type: "shuffle-deck",
          target: self,
        },
      ],
    },
  ],
  flavour: "Let's be clear Abuela runs this show\n– Mirabel",
  colors: ["amber"],
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  illustrator: "Maxine Vee",
  number: 2,
  set: "URR",
  rarity: "rare",
};
