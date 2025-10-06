import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { whenPlayAndWheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jasmineQueenOfAgrabah: LorcanaCharacterCardDefinition = {
  id: "a4n",
  name: "Jasmine",
  title: "Queen of Agrabah",
  characteristics: ["floodborn", "hero", "queen", "princess"],
  text: "**Shift** 3 _(You may pay 3 * to play this on top of one of your characters named Jasmine.)_\n\n**CARETAKER** When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
  type: "character",
  abilities: [
    ...whenPlayAndWheneverQuests({
      name: "Caretaker",
      text: "When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
      optional: true,
      effects: [
        {
          type: "heal",
          amount: 2,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    }),
    shiftAbility(3, "Jasmine"),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  illustrator: "Filipe Laurentino",
  number: 149,
  set: "TFC",
  rarity: "rare",
};
