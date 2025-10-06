import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { vanishAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/vanishAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const giantCobraGhostlySerpent: LorcanitoCharacterCardDefinition = {
  id: "u16",
  name: "Giant Cobra",
  title: "Ghostly Serpent",
  characteristics: ["dreamborn", "ally", "illusion"],
  text: "Vanish\nMYSTERIOUS ADVANTAGE When you play this character, you may choose and discard a card to gain 2 lore.",
  type: "character",
  abilities: [
    vanishAbility,
    whenYouPlayThis({
      name: "MYSTERIOUS ADVANTAGE",
      text: "When you play this character, you may choose and discard a card to gain 2 lore.",
      optional: true,
      effects: [
        {
          type: "discard",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
            ],
          },
          forEach: [youGainLore(2)],
        },
      ],
    }),
  ],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amethyst", "steel"],
  cost: 3,
  strength: 4,
  willpower: 4,
  illustrator: "Nicola Saviori",
  number: 57,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
