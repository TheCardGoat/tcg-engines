import type { CharacterCard } from "@tcg/lorcana-types";
import { perditaPlayfulMotherP2ChallengeI18n } from "./p2-021-perdita-playful-mother-challenge.i18n";

export const perditaPlayfulMotherP2Challenge: CharacterCard = {
  id: "3df",
  canonicalId: "ci_uxF",
  slug: "lorcana-ci_uxF",
  printings: [
    {
      id: "set7-p2-021-challenge",
      artId: "ci_uxF-challenge",
      setCode: "set7",
      collectorNumber: "21",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set7-002"],
  cardType: "character",
  name: "Perdita",
  version: "Playful Mother",
  inkType: ["amber", "sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  cardNumber: 21,
  rarity: "special",
  specialRarity: "challenge",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9290224bc0aa4571a72a8cca9b3dc655",
    tcgPlayer: "618213",
  },
  text: [
    {
      title: "WHO'S NEXT?",
      description:
        "Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.",
    },
    {
      title: "DON'T BE AFRAID",
      description: "Your Puppy characters gain Ward.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        amount: 2,
        cardType: "character",
        classification: "Puppy",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "ehi-1",
      name: "WHO'S NEXT?",
      text: "WHO'S NEXT? Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        keyword: "Ward",
        target: "YOUR_PUPPY_CHARACTERS",
        type: "gain-keyword",
      },
      id: "ehi-2",
      name: "DON'T BE AFRAID",
      text: "DON'T BE AFRAID Your Puppy characters gain Ward.",
      type: "static",
    },
  ],
  i18n: perditaPlayfulMotherP2ChallengeI18n,
};
