import type { CharacterCard } from "@tcg/lorcana-types";

export const davidXanatosSteelClanLeader: CharacterCard = {
  id: "xa7",
  cardType: "character",
  name: "David Xanatos",
  version: "Steel Clan Leader",
  fullName: "David Xanatos - Steel Clan Leader",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  text: "MINOR INCONVENIENCE When you play this character, you may choose and discard a card to deal 2 damage to chosen character.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 184,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "77f48553077c039331c07d2db0a31696cdd3c13f",
  },
  abilities: [
    {
      id: "xa7-1",
      type: "triggered",
      name: "MINOR INCONVENIENCE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "MINOR INCONVENIENCE When you play this character, you may choose and discard a card to deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
