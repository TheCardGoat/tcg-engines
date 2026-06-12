import type { CharacterCard } from "@tcg/lorcana-types";
import { jetsamUrsulasSpyI18n } from "./046-jetsam-ursulas-spy.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const jetsamUrsulasSpy: CharacterCard = {
  id: "0Bx",
  canonicalId: "ci_0Bx",
  reprints: ["set1-046"],
  cardType: "character",
  name: "Jetsam",
  version: "Ursula’s Spy",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 46,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3725a62bd3aa40a086ad041a84a910d3",
    tcgPlayer: 503317,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "SINISTER SLITHER",
      description: "Your characters named Flotsam gain Evasive.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    evasive,
    {
      effect: {
        keyword: "Evasive",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Flotsam",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "cdv-2",
      name: "SINISTER SLITHER",
      text: "SINISTER SLITHER Your characters named Flotsam gain Evasive.",
      type: "static",
    },
  ],
  i18n: jetsamUrsulasSpyI18n,
};
