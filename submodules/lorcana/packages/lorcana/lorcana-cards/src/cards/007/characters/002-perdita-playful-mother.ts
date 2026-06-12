import type { CharacterCard } from "@tcg/lorcana-types";
import { perditaPlayfulMotherI18n } from "./002-perdita-playful-mother.i18n";

export const perditaPlayfulMother: CharacterCard = {
  id: "uxF",
  canonicalId: "ci_uxF",
  reprints: ["set7-002"],
  cardType: "character",
  name: "Perdita",
  version: "Playful Mother",
  inkType: ["amber", "sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  cardNumber: 2,
  rarity: "rare",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9290224bc0aa4571a72a8cca9b3dc655",
    tcgPlayer: 618213,
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
  i18n: perditaPlayfulMotherI18n,
};
