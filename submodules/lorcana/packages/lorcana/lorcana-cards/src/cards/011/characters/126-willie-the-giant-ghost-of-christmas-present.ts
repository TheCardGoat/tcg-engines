import type { CharacterCard } from "@tcg/lorcana-types";
import { willieTheGiantGhostOfChristmasPresentI18n } from "./126-willie-the-giant-ghost-of-christmas-present.i18n";
import { boost } from "../../../helpers/abilities/boost";

export const willieTheGiantGhostOfChristmasPresent: CharacterCard = {
  id: "4Qt",
  canonicalId: "ci_4Qt",
  reprints: ["set11-126"],
  cardType: "character",
  name: "Willie the Giant",
  version: "Ghost of Christmas Present",
  inkType: ["ruby"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 126,
  rarity: "rare",
  cost: 4,
  strength: 7,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f472ec7c6a294a6498f3788b189472c4",
    tcgPlayer: 670270,
  },
  text: [
    {
      title: "Boost 3 {I}",
    },
    {
      title: "THE FOOD OF GENEROSITY",
      description:
        "This character can't quest or challenge unless you put a card under him this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Ghost", "Giant"],
  abilities: [
    boost(3),
    {
      id: "4Qt-2",
      name: "THE FOOD OF GENEROSITY",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-quest-or-challenge",
        target: "SELF",
      },
      condition: {
        type: "not",
        condition: {
          type: "put-card-under-self-this-turn",
        },
      },
      text: "THE FOOD OF GENEROSITY This character can't quest or challenge unless you put a card under him this turn.",
    },
  ],
  i18n: willieTheGiantGhostOfChristmasPresentI18n,
};
