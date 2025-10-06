// TODO: Once the set is released, we organize the cards by set and type

import { youPayXLessToPlayNextCharThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const winnieThePoohHoneyPirateLookout: LorcanitoCharacterCardDefinition =
  {
    id: "vhr",
    missingTestCase: true,
    name: "Winnie the Pooh",
    title: "Hunny Pirate",
    characteristics: ["storyborn", "hero", "pirate"],
    text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nWE'RE PIRATES, YOU SEE Whenever this character quests, the next Pirate character you play this turn costs 1 {I} less.",
    type: "character",
    abilities: [
      supportAbility,
      wheneverQuests({
        name: "We're Pirates, You See",
        text: "Whenever this character quests, the next Pirate character you play this turn costs 1 {I} less.",
        effects: [
          youPayXLessToPlayNextCharThisTurn(1, [
            { filter: "characteristics", value: ["pirate"] },
          ]),
        ],
      }),
    ],
    inkwell: false,
    colors: ["amber"],
    cost: 2,
    strength: 2,
    willpower: 2,
    lore: 1,
    illustrator: "Koni",
    number: 3,
    set: "006",
    rarity: "rare",
  };
