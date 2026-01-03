import type { CharacterCard } from "@tcg/lorcana-types";

export const AuroraDreamingGuardian: CharacterCard = {
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
      type: "static",
      text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Aurora._)\n**Protective Embrace** Your other characters gain **Ward**. _(Opponents can",
      id: "wb5-1",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Floodborn", "Princess"],
};
