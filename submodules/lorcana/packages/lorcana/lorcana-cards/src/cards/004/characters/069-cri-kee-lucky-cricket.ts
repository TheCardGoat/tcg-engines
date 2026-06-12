import type { CharacterCard } from "@tcg/lorcana-types";
import { crikeeLuckyCricketI18n } from "./069-cri-kee-lucky-cricket.i18n";

export const crikeeLuckyCricket: CharacterCard = {
  id: "pGG",
  canonicalId: "ci_pGG",
  reprints: ["set4-069"],
  cardType: "character",
  name: "Cri-Kee",
  version: "Lucky Cricket",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 69,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_38b8a802fe784ee286fd81ddc09ea7ec",
    tcgPlayer: 547783,
  },
  text: [
    {
      title: "SPREADING GOOD FORTUNE",
      description: "When you play this character, your other characters get +3 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 3,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: "all",
          excludeSelf: true,
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "dzo-1",
      name: "SPREADING GOOD FORTUNE",
      text: "SPREADING GOOD FORTUNE When you play this character, your other characters get +3 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: crikeeLuckyCricketI18n,
};
