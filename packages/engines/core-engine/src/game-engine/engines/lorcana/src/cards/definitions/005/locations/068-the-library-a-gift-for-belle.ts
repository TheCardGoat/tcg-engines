import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import { drawACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenThisCharacterBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theLibraryAGiftForBelle: LorcanaLocationCardDefinition = {
  id: "xz3",
  name: "The Library",
  title: "A Gift for Belle",
  characteristics: ["location"],
  text: "**LOST IN A BOOK** Whenever a character is banished while here, you may draw a card.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "Lost In a Book",
      text: "Whenever a character is banished while here, you may draw a card.",
      ability: whenThisCharacterBanished({
        name: "Lost In a Book",
        optional: true,
        text: "Whenever a character is banished while here, you may draw a card.",
        effects: [drawACard],
      }),
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  willpower: 8,
  lore: 1,
  illustrator: "Roberto Gatto",
  number: 68,
  set: "SSK",
  rarity: "uncommon",
  moveCost: 1,
};
