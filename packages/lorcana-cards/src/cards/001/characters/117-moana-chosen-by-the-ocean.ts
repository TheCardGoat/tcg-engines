import type { CharacterCard } from "@tcg/lorcana";

export const moanaChosenByTheOcean: CharacterCard = {
  id: "176",
  cardType: "character",
  name: "Moana",
  version: "Chosen by the Ocean",
  fullName: "Moana - Chosen by the Ocean",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "001",
  text: "THIS IS NOT WHO YOU ARE When you play this character, you may banish chosen character named Te Kā.",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 117,
  inkable: true,
  externalIds: {
    ravensburger: "045c9d82ec1f6de1fc7e93d21807204b5adf2985",
  },
  abilities: [
    {
      id: "176-1",
      text: "THIS IS NOT WHO YOU ARE When you play this character, you may banish chosen character named Te Kā.",
      name: "THIS IS NOT WHO YOU ARE",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
