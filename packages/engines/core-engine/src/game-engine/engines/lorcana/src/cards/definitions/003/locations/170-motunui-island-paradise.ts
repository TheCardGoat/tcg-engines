import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { putThisCardIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import { whenThisCharacterBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";

export const motunuiIslandParadise: LorcanaLocationCardDefinition = {
  id: "rqt",
  reprints: ["jiu"],
  type: "location",
  missingTestCase: true,
  name: "Motunui",
  title: "Island Paradise",
  characteristics: ["location"],
  text: "**REINCARNATION** Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.",
  abilities: [
    gainAbilityWhileHere({
      name: "Reincarnation",
      text: "Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.",
      ability: whenThisCharacterBanished({
        name: "Reincarnation",
        text: "Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.",
        optional: true,
        effects: [putThisCardIntoYourInkwellExerted],
      }),
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  willpower: 5,
  lore: 1,
  moveCost: 1,
  illustrator: "Etienne Savoie",
  number: 170,
  set: "ITI",
  rarity: "uncommon",
};
