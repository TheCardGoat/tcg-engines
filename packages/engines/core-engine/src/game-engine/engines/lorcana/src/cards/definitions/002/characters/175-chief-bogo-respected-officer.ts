import { opposingCharacters } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverYouPlayAFloodBorn } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chiefBogoRespectedOfficer: LorcanaCharacterCardDefinition = {
  id: "qpr",
  name: "Chief Bogo",
  title: "Respected Officer",
  characteristics: ["dreamborn"],
  text: "**INSUBORDINATION!** Whenever you play a Floodborn character, deal 1 damage to each opposing character.",
  type: "character",
  abilities: [
    wheneverYouPlayAFloodBorn({
      name: "Insubordination!",
      text: "Whenever you play a Floodborn character, deal 1 damage to each opposing character.",
      effects: [
        {
          type: "damage",
          amount: 1,
          target: opposingCharacters,
        },
      ],
    }),
  ],
  flavour:
    "We can confirm the ink flood was caused by an explosion. We have it under control−now clear the area.",
  colors: ["steel"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  illustrator: "Adam Banch",
  number: 175,
  set: "ROF",
  rarity: "rare",
};
