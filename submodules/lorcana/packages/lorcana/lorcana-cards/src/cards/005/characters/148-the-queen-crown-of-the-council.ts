import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenCrownOfTheCouncilI18n } from "./148-the-queen-crown-of-the-council.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const theQueenCrownOfTheCouncil: CharacterCard = {
  id: "05o",
  canonicalId: "ci_05o",
  reprints: ["set5-148"],
  cardType: "character",
  name: "The Queen",
  version: "Crown of the Council",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 148,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_65f44d7a61bc416ebc68806cea7f39e2",
    tcgPlayer: 561969,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "GATHERER OF THE WICKED",
      description:
        "When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
  abilities: [
    ward,
    {
      id: "vdv-2",
      effect: {
        type: "scry",
        amount: 3,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 3,
            reveal: true,
            filters: [
              {
                type: "card-type",
                cardType: "character",
              },
              {
                type: "name",
                equals: "The Queen",
              },
            ],
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      name: "GATHERER OF THE WICKED",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "GATHERER OF THE WICKED When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  i18n: theQueenCrownOfTheCouncilI18n,
};
