import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { whenMovesToALocation } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const taffytaMuttonfudgeSourSpeedster: LorcanitoCharacterCardDefinition =
  {
    id: "hep",
    missingTestCase: true,
    name: "Taffyta Muttonfudge",
    title: "Sour Speedster",
    characteristics: ["floodborn", "ally", "racer"],
    text: "**Shift** 2 _(You may pay 2 {I} to play this on top of one of your characters named Taffyta Muttonfudge.)_ **NEW ROSTER** Once per turn, when this character moves to a location, gain 2 lore.",
    type: "character",
    abilities: [
      shiftAbility(2, "Taffyta Muttonfudge"),
      whenMovesToALocation({
        name: "New Roster",
        text: "Once per turn, when this character moves to a location, gain 2 lore.",
        oncePerTurn: true,
        effects: [youGainLore(2)],
      }),
    ],
    inkwell: true,
    colors: ["ruby"],
    cost: 4,
    strength: 3,
    willpower: 3,
    lore: 1,
    illustrator: "Jiahui Eva Gao",
    number: 117,
    set: "SSK",
    rarity: "uncommon",
  };
