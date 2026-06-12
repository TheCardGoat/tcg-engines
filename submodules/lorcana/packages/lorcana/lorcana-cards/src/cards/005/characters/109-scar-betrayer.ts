import type { CharacterCard } from "@tcg/lorcana-types";
import { scarBetrayerI18n } from "./109-scar-betrayer.i18n";

export const scarBetrayer: CharacterCard = {
  id: "MEi",
  canonicalId: "ci_MEi",
  reprints: ["set5-109"],
  cardType: "character",
  name: "Scar",
  version: "Betrayer",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 109,
  rarity: "uncommon",
  cost: 5,
  strength: 6,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0e2b19d48e8447f19582feef97a52725",
    tcgPlayer: 561962,
  },
  text: [
    {
      title: "LONG LIVE THE KING",
      description: "When you play this character, you may banish chosen character named Mufasa.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [{ type: "has-name", name: "Mufasa" }],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "1rc-1",
      name: "LONG LIVE THE KING",
      text: "LONG LIVE THE KING When you play this character, you may banish chosen character named Mufasa.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: scarBetrayerI18n,
};
