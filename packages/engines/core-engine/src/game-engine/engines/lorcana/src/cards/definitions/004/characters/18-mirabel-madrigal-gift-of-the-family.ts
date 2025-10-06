import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mirabelMadrigalGiftOfTheFamily: LorcanitoCharacterCardDefinition =
  {
    id: "o01",
    missingTestCase: true,
    name: "Mirabel Madrigal",
    title: "Gift of the Family",
    characteristics: ["hero", "dreamborn", "madrigal"],
    text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_\n\n**SAVING THE MIRACLE** Whenever this character quests, your other Madrigal characters get +1 {L} this turn.",
    type: "character",
    abilities: [
      supportAbility,
      wheneverQuests({
        name: "Saving The Miracle",
        text: "Whenever this character quests, your other Madrigal characters get +1 {L} this turn.",
        effects: [
          {
            type: "attribute",
            attribute: "lore",
            amount: 1,
            modifier: "add",
            duration: "turn",
            target: {
              type: "card",
              value: "all",
              excludeSelf: true,
              filters: [
                { filter: "owner", value: "self" },
                { filter: "type", value: "character" },
                { filter: "zone", value: "play" },
                { filter: "characteristics", value: ["madrigal"] },
              ],
            },
          },
        ],
      }),
    ],
    colors: ["amber"],
    cost: 5,
    strength: 3,
    willpower: 5,
    lore: 2,
    illustrator: "Aubrey Archer",
    number: 18,
    set: "URR",
    rarity: "super_rare",
  };
