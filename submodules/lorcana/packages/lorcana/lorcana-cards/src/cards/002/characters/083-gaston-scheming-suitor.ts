import type { CharacterCard } from "@tcg/lorcana-types";
import { gastonSchemingSuitorI18n } from "./083-gaston-scheming-suitor.i18n";

export const gastonSchemingSuitor: CharacterCard = {
  id: "yh1",
  canonicalId: "ci_yh1",
  reprints: ["set2-083"],
  cardType: "character",
  name: "Gaston",
  version: "Scheming Suitor",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 83,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4cb55532004549e59945436fd57a62b7",
    tcgPlayer: 527746,
  },
  text: [
    {
      title: "YES, I'M INTIMIDATING",
      description:
        "While one or more opponents have no cards in their hands, this character gets +3 {S}.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "1xf-1",
      name: "YES, I'M INTIMIDATING",
      text: "YES, I'M INTIMIDATING While one or more opponents have no cards in their hands, this character gets +3 {S}.",
      type: "static",
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "opponent",
        comparison: "equal",
        value: 0,
      },
      effect: {
        modifier: 3,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
    },
  ],
  i18n: gastonSchemingSuitorI18n,
};
