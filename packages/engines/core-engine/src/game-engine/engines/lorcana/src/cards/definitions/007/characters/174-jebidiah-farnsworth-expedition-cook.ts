import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jebidiahFarnsworthExpeditionCook: LorcanaCharacterCardDefinition =
  {
    id: "i78",
    name: "Jebidiah Farnsworth",
    title: "Expedition Cook",
    characteristics: ["storyborn", "ally"],
    text: "Support\nI GOT YOUR FOUR BASIC FOOD GROUPS When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
    type: "character",
    abilities: [
      supportAbility,
      {
        type: "resolution",
        name: "I GOT YOUR FOUR BASIC FOOD GROUPS",
        text: "When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
        effects: [
          {
            type: "ability",
            ability: "resist",
            amount: 1,
            modifier: "add",
            duration: "next_turn",
            until: true,
            target: chosenCharacter,
          },
        ],
      },
    ],
    inkwell: true,
    colors: ["sapphire"],
    cost: 4,
    strength: 3,
    willpower: 3,
    illustrator: "Pix Smith",
    number: 174,
    set: "007",
    rarity: "uncommon",
    lore: 1,
  };
