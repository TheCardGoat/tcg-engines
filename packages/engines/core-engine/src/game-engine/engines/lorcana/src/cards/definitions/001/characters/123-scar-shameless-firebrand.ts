import { readyAndCantQuest } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { whenYouPlayThisCharAbility } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scarShamelessFirebrand: LorcanaCharacterCardDefinition = {
  id: "mm7",
  name: "Scar",
  title: "Shameless Firebrand",
  characteristics: ["floodborn", "villain", "king"],
  text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Scar.)_\n**ROUSING SPEECH** When you play this character, ready your characters with cost 3 or less. They can't quest for the rest of this turn.",
  type: "character",
  abilities: [
    shiftAbility(6, "Scar"),
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "ROUSING SPEECH",
      text: "When you play this character, ready your characters with cost 3 or less. They can't quest for the rest of this turn",
      effects: readyAndCantQuest({
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          {
            filter: "attribute",
            value: "cost",
            comparison: { operator: "lte", value: 3 },
          },
        ],
      }),
    }),
  ],
  colors: ["ruby"],
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 1,
  illustrator: "Jenna Gray",
  number: 123,
  set: "TFC",
  rarity: "rare",
};
