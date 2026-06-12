import type { CharacterCard } from "@tcg/lorcana-types";
import { jumbaJookibaProlificInventorI18n } from "./019-jumba-jookiba-prolific-inventor.i18n";

export const jumbaJookibaProlificInventor: CharacterCard = {
  id: "mgC",
  canonicalId: "ci_mgC",
  reprints: ["set11-019"],
  cardType: "character",
  name: "Jumba Jookiba",
  version: "Prolific Inventor",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 19,
  rarity: "rare",
  cost: 8,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_aa9fd9e677e946f0ab5f0148b0874568",
    tcgPlayer: 673070,
  },
  text: [
    {
      title: "WELCOMING CROWD",
      description:
        "For each character you have in play, you pay 1 {I} less to play this character.",
    },
    {
      title: "I AM HELPING",
      description:
        "Whenever this character quests, you may remove all damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien", "Inventor"],
  abilities: [
    // WELCOMING CROWD: For each character you have in play, you pay 1 less to play this character.
    {
      id: "mgC-1",
      name: "WELCOMING CROWD",
      type: "static",
      sourceZones: ["hand"],
      effect: {
        type: "cost-reduction",
        amount: {
          type: "filtered-count",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [],
        },
      },
      text: "WELCOMING CROWD For each character you have in play, you pay 1 {I} less to play this character.",
    },
    // I AM HELPING: Whenever this character quests, you may remove all damage from chosen character.
    {
      id: "mgC-2",
      name: "I AM HELPING",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "remove-damage",
          amount: "all",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "I AM HELPING Whenever this character quests, you may remove all damage from chosen character.",
    },
  ],
  i18n: jumbaJookibaProlificInventorI18n,
};
