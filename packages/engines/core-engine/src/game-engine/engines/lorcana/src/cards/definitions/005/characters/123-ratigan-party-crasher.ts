import {
  evasiveAbility,
  shiftAbility,
  yourOtherCharactersWithGain,
} from "~/game-engine/engines/lorcana/src/abilities";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ratiganPartyCrasher: LorcanaCharacterCardDefinition = {
  id: "enx",
  missingTestCase: true,
  name: "Ratigan",
  title: "Party Crasher",
  characteristics: ["floodborn", "villain"],
  text: "**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Ratigan.)_ **Evasive** _(Only characters with Evasive can challenge this character.)_\n **DELIGHTFULLY WICKED** Your damaged characters get +2 {S}.",
  type: "character",
  abilities: [
    shiftAbility(4, "ratigan"),
    evasiveAbility,
    yourOtherCharactersWithGain({
      name: "Delightfully Wicked",
      text: "Your damaged characters get -2 {S}.",
      filter: {
        filter: "status",
        value: "damage",
        comparison: { operator: "gte", value: 1 },
      },
      gainedAbility: {
        type: "static",
        ability: "effects",
        effects: [
          {
            type: "attribute",
            attribute: "strength",
            amount: 2,
            modifier: "add",
            duration: "static",
            target: thisCharacter,
          },
        ],
      },
    }),
  ],
  colors: ["ruby"],
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  illustrator: "Nicholas Kole",
  number: 123,
  set: "SSK",
  rarity: "rare",
};
