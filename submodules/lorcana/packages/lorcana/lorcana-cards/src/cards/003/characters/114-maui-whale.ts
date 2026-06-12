import type { CharacterCard } from "@tcg/lorcana-types";
import { mauiWhaleI18n } from "./114-maui-whale.i18n";

export const mauiWhale: CharacterCard = {
  id: "hjF",
  canonicalId: "ci_8fJ",
  reprints: ["set3-114", "set9-106"],
  cardType: "character",
  name: "Maui",
  version: "Whale",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "003",
  cardNumber: 114,
  rarity: "rare",
  cost: 7,
  strength: 8,
  willpower: 8,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_eca6a044a1a24319948f3c2698344fad",
    tcgPlayer: 650044,
  },
  text: [
    {
      title: "THIS MISSION IS CURSED",
      description: "This character can't ready at the start of your turn.",
    },
    {
      title: "I GOT YOUR BACK 2",
      description: "{I} — Ready this character. He can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity"],
  abilities: [
    {
      effect: {
        restriction: "cant-ready-at-start-of-turn",
        target: "SELF",
        type: "restriction",
      },
      id: "4dw-1",
      name: "THIS MISSION IS CURSED",
      text: "THIS MISSION IS CURSED This character can't ready at the start of your turn.",
      type: "static",
    },
    {
      cost: {
        ink: 1,
      },
      effect: {
        steps: [
          {
            target: "SELF",
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "4dw-2",
      name: "I GOT YOUR BACK 2",
      text: "I GOT YOUR BACK 2 {I} – Ready this character. He can't quest for the rest of this turn.",
      type: "activated",
    },
  ],
  i18n: mauiWhaleI18n,
};
