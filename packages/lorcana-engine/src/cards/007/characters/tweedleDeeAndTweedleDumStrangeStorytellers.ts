import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const tweedleDeeAndTweedleDumStrangeStorytellers: LorcanitoCharacterCard =
  {
    id: "fkm",
    name: "Tweedle Dee & Tweedle Dum",
    title: "Strange Storytellers",
    characteristics: ["storyborn"],
    text: "ANOTHER RECITATION Whenever this character quests, you may return chosen damaged character to their player's hand.",
    type: "character",
    abilities: [
      wheneverQuests({
        name: "ANOTHER RECITATION",
        text: "Whenever this character quests, you may return chosen damaged character to their player's hand.",
        optional: true,
        effects: [
          {
            type: "move",
            to: "hand",
            target: {
              type: "card",
              value: 1,
              filters: [
                { filter: "type", value: "character" },
                { filter: "zone", value: "play" },
                { filter: "status", value: "damaged" },
              ],
            },
          },
        ],
      }),
    ],
    inkwell: true,
    // @ts-expect-error
    color: "",
    colors: ["emerald", "ruby"],
    cost: 5,
    strength: 4,
    willpower: 4,
    illustrator: "Alice Pisoni",
    number: 103,
    set: "007",
    rarity: "uncommon",
    lore: 2,
  };
