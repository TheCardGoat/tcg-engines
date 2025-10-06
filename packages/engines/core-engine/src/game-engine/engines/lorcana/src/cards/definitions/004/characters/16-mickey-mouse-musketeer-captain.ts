import {
  bodyguardAbility,
  shiftAbility,
  supportAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { drawXCards } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseMusketeerCaptain: LorcanaCharacterCardDefinition = {
  id: "pjf",
  missingTestCase: true,
  name: "Mickey Mouse",
  title: "Musketeer Captain",
  characteristics: ["hero", "floodborn", "captain", "musketeer"],
  text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)_\n\n**Bodyguard**, **Support**\n\n\n**MUSKETEERS UNITED** When you play this character, if you used **Shift** to play him, you may draw a chard for each character with **Bodyguard** you have in play.",
  type: "character",
  abilities: [
    shiftAbility(5, "mickey mouse"),
    bodyguardAbility,
    supportAbility,
    {
      type: "resolution",
      resolutionConditions: [{ type: "resolution", value: "shift" }],
      name: "Musketeers United",
      text: "When you play this character, if you used **Shift** to play him, you may draw a chard for each character with **Bodyguard** you have in play.",
      effects: [
        drawXCards({
          dynamic: true,
          filters: [
            { filter: "type", value: "character" },
            { filter: "ability", value: "bodyguard" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
          ],
        }),
      ],
    },
  ],
  colors: ["amber"],
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  illustrator: "Jochem van Gool",
  number: 16,
  set: "URR",
  rarity: "legendary",
};
