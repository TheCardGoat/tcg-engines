import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinheroicOutlaw: CharacterCard = {
  id: "c0t",
  cardType: "character",
  name: "Aladdin",
  version: "Heroic Outlaw",
  fullName: "Aladdin - Heroic Outlaw",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Aladdin.)_\n**DARING EXPLOIT** During your turn, whenever this\rcharacter banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 104,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Aladdin.)_\n**DARING EXPLOIT** During your turn, whenever this\rcharacter banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
      id: "c0t-1",
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 2,
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Floodborn"],
};
