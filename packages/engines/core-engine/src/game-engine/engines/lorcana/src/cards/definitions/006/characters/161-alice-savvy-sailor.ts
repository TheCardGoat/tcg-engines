// TODO: Once the set is released, we organize the cards by set and type

import { anotherChosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aliceSavvySailor: LorcanaCharacterCardDefinition = {
  id: "w6y",
  name: "Alice",
  title: "Savvy Sailor",
  characteristics: ["dreamborn", "hero"],
  text: "Ward (Opponents can't choose this character except to challenge.)\nAHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
  type: "character",
  abilities: [
    wardAbility,
    wheneverQuests({
      name: "Ahoy!",
      text: "Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: anotherChosenCharacterOfYours,
        },
        {
          type: "ability",
          ability: "ward",
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: anotherChosenCharacterOfYours,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["sapphire"],
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Dustin Panolino",
  number: 161,
  set: "006",
  rarity: "super_rare",
};
