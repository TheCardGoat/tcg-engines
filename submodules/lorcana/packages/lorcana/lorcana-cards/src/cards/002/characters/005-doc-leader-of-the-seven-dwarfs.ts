import type { CharacterCard } from "@tcg/lorcana-types";
import { docLeaderOfTheSevenDwarfsI18n } from "./005-doc-leader-of-the-seven-dwarfs.i18n";

export const docLeaderOfTheSevenDwarfs: CharacterCard = {
  id: "bgG",
  canonicalId: "ci_bgG",
  reprints: ["set2-005"],
  cardType: "character",
  name: "Doc",
  version: "Leader of the Seven Dwarfs",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 5,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2fec41cf370c44e4a11f2024d8375c4c",
    tcgPlayer: 526602,
  },
  text: [
    {
      title: "SHARE AND SHARE ALIKE",
      description:
        "Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  abilities: [
    {
      effect: {
        amount: 1,
        cardType: "character",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      id: "bgG-1",
      name: "SHARE AND SHARE ALIKE",
      text: "SHARE AND SHARE ALIKE Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
      type: "triggered",
    },
  ],
  i18n: docLeaderOfTheSevenDwarfsI18n,
};
