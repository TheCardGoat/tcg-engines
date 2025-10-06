import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanReflecting: LorcanaCharacterCardDefinition = {
  id: "jat",
  name: "Mulan",
  title: "Reflecting",
  characteristics: ["hero", "floodborn", "princess"],
  text: "**Shift** 2 (_You may pay 2 {I} to play this on top of one of your characters named Mulan._)\n\n**HONOR TO THE ANCESTORS** Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Honor To The Ancestors",
      text: "Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.",
      effects: [
        {
          type: "reveal-and-play",
          putInto: "deck",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "action" },
              { filter: "characteristics", value: ["song"] },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    }),
    shiftAbility(2, "mulan"),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Lissette Carrera",
  number: 16,
  set: "ROF",
  rarity: "rare",
};
