import type { CharacterCard } from "@tcg/lorcana-types";

export const davidXanatosSteelClanLeader: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "xa7-1",
      name: "MINOR INCONVENIENCE",
      text: "MINOR INCONVENIENCE When you play this character, you may choose and discard a card to deal 2 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 184,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "77f48553077c039331c07d2db0a31696cdd3c13f",
  },
  franchise: "Gargoyles",
  fullName: "David Xanatos - Steel Clan Leader",
  id: "xa7",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "David Xanatos",
  set: "010",
  strength: 3,
  text: "MINOR INCONVENIENCE When you play this character, you may choose and discard a card to deal 2 damage to chosen character.",
  version: "Steel Clan Leader",
  willpower: 2,
};
