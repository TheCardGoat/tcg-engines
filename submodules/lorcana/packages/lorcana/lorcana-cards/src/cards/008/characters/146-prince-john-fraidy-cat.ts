import type { CharacterCard } from "@tcg/lorcana-types";
import { princeJohnFraidycatI18n } from "./146-prince-john-fraidy-cat.i18n";

export const princeJohnFraidycat: CharacterCard = {
  id: "460",
  canonicalId: "ci_460",
  reprints: ["set8-146"],
  cardType: "character",
  name: "Prince John",
  version: "Fraidy-Cat",
  inkType: ["ruby"],
  franchise: "Robin Hood",
  set: "008",
  cardNumber: 146,
  rarity: "rare",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_e55251bd10c24f90a388f5dc18a2867f",
    tcgPlayer: 631446,
  },
  text: [
    {
      title: "HELP! HELP!",
      description: "Whenever an opponent plays a character, deal 1 damage to this character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "self",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "fa9-1",
      name: "HELP! HELP!",
      text: "HELP! HELP! Whenever an opponent plays a character, deal 1 damage to this character.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "opponent",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: princeJohnFraidycatI18n,
};
