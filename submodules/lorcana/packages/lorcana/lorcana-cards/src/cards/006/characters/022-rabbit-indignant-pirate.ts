import type { CharacterCard } from "@tcg/lorcana-types";
import { rabbitIndignantPirateI18n } from "./022-rabbit-indignant-pirate.i18n";

export const rabbitIndignantPirate: CharacterCard = {
  id: "p9G",
  canonicalId: "ci_p9G",
  reprints: ["set6-022"],
  cardType: "character",
  name: "Rabbit",
  version: "Indignant Pirate",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  cardNumber: 22,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6656edfc61dd4cc0846fee37f6c8e7b9",
    tcgPlayer: 587238,
  },
  text: [
    {
      title: "BE MORE CAREFUL",
      description:
        "When you play this character, you may remove up to 1 damage from chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Pirate"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 1 },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "1cx-1",
      name: "BE MORE CAREFUL",
      text: "BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: rabbitIndignantPirateI18n,
};
