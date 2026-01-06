import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraDreamingGuardian: CharacterCard = {
  id: "wb5",
  cardType: "character",
  name: "Aurora",
  version: "Dreaming Guardian",
  fullName: "Aurora - Dreaming Guardian",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Aurora._)\n**Protective Embrace** Your other characters gain **Ward**. _(Opponents can",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 139,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "keyword",
      keyword: "Shift",
      cost: { ink: 3 },
      id: "wb5-1",
      text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Aurora._)",
    },
    {
      type: "static",
      id: "wb5-2",
      text: "**Protective Embrace** Your other characters gain **Ward**. _(Opponents can",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
    },
  ],
  classifications: ["Hero", "Floodborn", "Princess"],
};
