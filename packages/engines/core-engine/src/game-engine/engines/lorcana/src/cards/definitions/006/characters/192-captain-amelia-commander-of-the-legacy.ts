import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import { yourOtherCharacters } from "~/game-engine/engines/lorcana/src/abilities/target";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const captainAmeliaCommanderOfTheLegacy: LorcanitoCharacterCardDefinition =
  {
    id: "izk",
    name: "Captain Amelia",
    title: "Commander of the Legacy",
    characteristics: ["storyborn", "ally", "alien", "captain"],
    text: "DRIVELING GALOOTS This character can't be challenged by Pirate characters.\nEVERYTHING SHIPSHAPE While being challenged, your other characters gain Resist +1. (Damage dealt to them is reduced by 1.)",
    type: "character",
    abilities: [
      {
        type: "static",
        ability: "effects",
        name: "Driveling Galoots",
        text: "This character can't be challenged by Pirate characters.",
        effects: [
          {
            type: "restriction",
            restriction: "be-challenged",
            target: thisCharacter,
            challengerFilters: [
              { filter: "characteristics", value: ["pirate"] },
            ],
          },
        ],
      },
      {
        type: "static",
        ability: "gain-ability",
        name: "Everything Shipshape",
        text: "While being challenged, your other characters gain Resist +1.",
        gainedAbility: resistAbility(1, true, true),
        target: yourOtherCharacters,
      },
    ],
    inkwell: true,
    colors: ["steel"],
    cost: 4,
    strength: 1,
    willpower: 4,
    lore: 2,
    illustrator: "French Carlomagno",
    number: 192,
    set: "006",
    rarity: "super_rare",
  };
