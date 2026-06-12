import type { CharacterCard } from "@tcg/lorcana-types";
import { mrSmeeCaptainOfTheJollyRogerI18n } from "./176-mr-smee-captain-of-the-jolly-roger.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const mrSmeeCaptainOfTheJollyRoger: CharacterCard = {
  id: "ma6",
  canonicalId: "ci_ma6",
  reprints: ["set6-176"],
  cardType: "character",
  name: "Mr. Smee",
  version: "Captain of the Jolly Roger",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 176,
  rarity: "common",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_6a19afc00c8b45769267ad82f20e0929",
    tcgPlayer: 592004,
  },
  text: [
    {
      title: "Shift 4",
      description:
        "(You may pay 4 {I} to play this on top of one of your characters named Mr. Smee.)",
    },
    {
      title: "RAISE THE COLORS",
      description:
        "When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Pirate", "Captain"],
  abilities: [
    shift("Mr. Smee", 4),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: {
            cardTypes: ["character"],
            excludeSelf: true,
            filters: [{ type: "has-classification", classification: "Pirate" }],
            owner: "you",
            type: "filtered-count",
            zones: ["play"],
          },
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
      id: "ma6-2",
      name: "RAISE THE COLORS",
      text: "RAISE THE COLORS When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: mrSmeeCaptainOfTheJollyRogerI18n,
};
