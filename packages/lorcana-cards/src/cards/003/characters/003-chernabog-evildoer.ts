import type { CharacterCard } from "@tcg/lorcana-types";

export const chernabogEvildoer: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "r3g-1",
      text: "THE POWER OF EVIL For each character card in your discard, you pay 1 {I} less to play this character.",
      type: "action",
    },
    {
      effect: {
        type: "shuffle-into-deck",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        intoDeck: "owner",
      },
      id: "r3g-2",
      name: "SUMMON THE SPIRITS",
      text: "SUMMON THE SPIRITS When you play this character, shuffle all character cards from your discard into your deck.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 3,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 10,
  externalIds: {
    ravensburger: "61a80f2f88c8834ee4e9f7ab5c36239495197b09",
  },
  franchise: "Fantasia",
  fullName: "Chernabog - Evildoer",
  id: "r3g",
  inkType: ["amber"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Chernabog",
  set: "003",
  strength: 9,
  text: "THE POWER OF EVIL For each character card in your discard, you pay 1 {I} less to play this character.\nSUMMON THE SPIRITS When you play this character, shuffle all character cards from your discard into your deck.",
  version: "Evildoer",
  willpower: 9,
};
