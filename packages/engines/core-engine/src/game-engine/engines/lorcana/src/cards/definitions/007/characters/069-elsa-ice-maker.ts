import {
  ifYouHaveCharacterNamed,
  notHaveCharacterNamed,
} from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import {
  exertAndCantReady,
  exertChosenCharacter,
} from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const elsaIceMaker: LorcanaCharacterCardDefinition = {
  id: "ejk",
  name: "Elsa",
  title: "Ice Maker",
  characteristics: ["floodborn", "hero", "queen", "sorcerer"],
  text: "Shift 4\nWINTER WALL Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can't ready at the start of their next turn.",
  type: "character",
  abilities: [
    shiftAbility(4, "Elsa"),
    wheneverQuests({
      name: "WINTER WALL",
      text: "Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can't ready at the start of their next turn.",
      optional: true,
      conditions: [ifYouHaveCharacterNamed("Anna")],
      effects: exertAndCantReady({
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      }),
    }),
    wheneverQuests({
      name: "WINTER WALL",
      text: "Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can't ready at the start of their next turn.",
      optional: true,
      conditions: [notHaveCharacterNamed("Anna")],
      effects: [exertChosenCharacter],
    }),
  ],
  inkwell: false,
  colors: ["amethyst", "sapphire"],
  cost: 7,
  strength: 5,
  willpower: 5,
  illustrator: "Ian MacDonald",
  number: 69,
  set: "007",
  rarity: "super_rare",
  lore: 2,
};
