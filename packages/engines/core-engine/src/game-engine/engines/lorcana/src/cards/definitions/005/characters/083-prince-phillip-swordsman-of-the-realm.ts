import { readyThisCharacter } from "@lorcanito/lorcana-engine/effects/effects";
import { chosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/target";
import { wheneverChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princePhillipSwordsmanOfTheRealm: LorcanitoCharacterCardDefinition =
  {
    id: "yrg",
    missingTestCase: true,
    name: "Prince Phillip",
    title: "Swordsman of the Realm",
    characteristics: ["hero", "storyborn", "prince"],
    text: "**SLAYER OF DRAGONS** When you play this character, banish chosen opposing Dragon character.\n \n**PRESSING THE ADVANTAGE** When he challenges a damaged character, ready this character after the challenge.",
    type: "character",
    abilities: [
      {
        type: "resolution",
        name: "Slayer Of Dragons",
        text: "When you play this character, banish chosen opposing Dragon character.",
        effects: [
          {
            type: "banish",
            target: {
              ...chosenOpposingCharacter,
              filters: [
                ...chosenOpposingCharacter.filters,
                { filter: "characteristics", value: ["dragon"] },
              ],
            },
          },
        ],
      },
      wheneverChallengesAnotherChar({
        name: "Pressing the Advantage",
        text: "When he challenges a damaged character, ready this character after the challenge.",
        effects: [readyThisCharacter],
        defenderFilter: [
          {
            filter: "status",
            value: "damage",
            comparison: { operator: "gt", value: 0 },
          },
        ],
      }),
    ],
    inkwell: true,
    colors: ["emerald"],
    cost: 7,
    strength: 3,
    willpower: 9,
    lore: 3,
    illustrator: "Ian MacDonald",
    number: 83,
    set: "SSK",
    rarity: "super_rare",
  };
