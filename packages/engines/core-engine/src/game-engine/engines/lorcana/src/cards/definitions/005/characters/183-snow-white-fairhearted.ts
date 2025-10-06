import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const snowWhiteFairhearted: LorcanitoCharacterCardDefinition = {
  id: "s09",
  missingTestCase: true,
  name: "Snow White",
  title: "Fair-Hearted",
  characteristics: ["hero", "dreamborn", "princess", "knight"],
  text: "**NATURAL LEADER** This character gains **Resist** +1 for each other Knight character you have in play. _(Damage dealt to this character is reduced by 1 for each other Knight.)_",
  type: "character",
  abilities: [
    resistAbility({
      dynamic: true,
      excludeSelf: true,
      filters: [
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "characteristics", value: ["knight"] },
      ],
    }),
  ],
  flavour: "Friendship is the best armor of all.",
  colors: ["steel"],
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  illustrator: "Aubrey Archer",
  number: 183,
  set: "SSK",
  rarity: "super_rare",
};
