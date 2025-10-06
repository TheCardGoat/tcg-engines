import { wheneverYouPlayAFloodBorn } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const buckySquirrelSqueakTutor: LorcanaCharacterCardDefinition = {
  id: "aci",
  name: "Bucky",
  title: "Squirrel Squeak Tutor",
  characteristics: ["storyborn", "ally"],
  text: "**SQUEAK** Whenever you play a Floodborn character, each opponent chooses and discards a card. à Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
  type: "character",
  abilities: [
    wheneverYouPlayAFloodBorn({
      name: "Squeak",
      text: "Whenever you play a Floodborn character, each opponent chooses and discards a card. à Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
      responder: "opponent",
      hasShifted: true,
      effects: [
        {
          type: "discard",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    }),
  ],
  flavour: '"There\'s a lot of nuance to squirrel."\n−Kronk',
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 1,
  illustrator: "Alex Accorsi",
  number: 73,
  set: "ROF",
  rarity: "uncommon",
};
