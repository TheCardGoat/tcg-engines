import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
import { whenYouPlayThisCharAbility } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lefouInstigator: LorcanaCharacterCardDefinition = {
  id: "dx9",
  reprints: ["bmd"],
  name: "Lefou",
  title: "Instigator",
  characteristics: ["dreamborn", "ally"],
  text: "**FAN THE FLAMES** When you play this character, ready chosen character. They can't quest for the rest of this turn.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Fan the Flames",
      text: "When you play this character, ready chosen character. They can't quest for the rest of this turn.",
      effects: readyAndCantQuest({
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      }),
    }),
  ],
  flavour: "All a mob needs is a push in the wrong direction.",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Gaku Kumatori",
  number: 112,
  set: "TFC",
  rarity: "rare",
};
