import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineRoyalCommodoreI18n } from "./084-jasmine-royal-commodore.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const jasmineRoyalCommodore: CharacterCard = {
  id: "J56",
  canonicalId: "ci_J56",
  reprints: ["set6-084"],
  cardType: "character",
  name: "Jasmine",
  version: "Royal Commodore",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 84,
  rarity: "legendary",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ad218b44923244058918299a897f9e4c",
    tcgPlayer: 591116,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "RULER OF THE SEAS",
      description:
        "When you play this character, if you used Shift to play her, return all other exerted characters to their players' hands.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    shift(5),
    {
      condition: {
        type: "used-shift",
      },
      effect: {
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "exerted" }],
          excludeSelf: true,
        },
        type: "return-to-hand",
      },
      id: "8v1-2",
      name: "RULER OF THE SEAS",
      text: "RULER OF THE SEAS When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: jasmineRoyalCommodoreI18n,
};
