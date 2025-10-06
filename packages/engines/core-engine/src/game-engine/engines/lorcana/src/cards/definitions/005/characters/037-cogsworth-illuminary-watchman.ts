import type {
  AbilityEffect,
  LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/target";

export const cogsworthIlluminaryWatchman: LorcanaCharacterCardDefinition = {
  id: "xha",
  missingTestCase: true,
  name: "Cogsworth",
  title: "Illuminary Watchman",
  characteristics: ["dreamborn", "ally"],
  text: "**TIME TO MOVE IT!** When you play this character, chosen character gains **Rush** this turn. _(They can challenge the turn they’re played.)_",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "**TIME TO MOVE IT!**",
      text: "When you play this character, chosen character gains **Rush** this turn. _(They can challenge the turn they’re played.)_",
      effects: [
        {
          type: "ability",
          ability: "rush",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  flavour: "Step to it! Time is of the essence.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 37,
  set: "SSK",
  rarity: "common",
};
