import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const olafCarrotEnthusiast: LorcanaCharacterCardDefinition = {
  id: "om0",
  name: "Olaf",
  title: "Carrot Enthusiast",
  characteristics: ["floodborn", "ally"],
  text: "**Shift: Discard an item card** _(You may discard an item card to play this on top of one of your characters named Olaf.)_\n\n**CARROTS ALL AROUND!** Whenever he quests, each of your other characters gets +{S} equal to this character's {S} this turn.",
  type: "character",
  abilities: [
    shiftAbility(
      [
        {
          type: "card",
          action: "discard",
          amount: 1,
          filters: [
            { filter: "zone", value: "hand" },
            { filter: "owner", value: "self" },
            { filter: "type", value: "item" },
          ],
        },
      ],
      "Olaf",
      "**Shift: Discard an item card** _(You may discard an item card to play this on top of one of your characters named Olaf.)_",
    ),
    wheneverQuests({
      optional: true,
      name: "CARROTS ALL AROUND!",
      text: "Whenever he quests, each of your other characters gets +{S} equal to this character's {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          target: yourOtherCharacters,
          amount: {
            dynamic: true,
            sourceAttribute: "strength",
          },
          modifier: "add",
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Lauren Levering",
  number: 149,
  set: "URR",
  rarity: "uncommon",
};
