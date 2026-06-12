import type { CharacterCard } from "@tcg/lorcana-types";
import { jetsamRiffraffI18n } from "./076-jetsam-riffraff.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const jetsamRiffraff: CharacterCard = {
  id: "j0a",
  canonicalId: "ci_j0a",
  reprints: ["set3-076"],
  cardType: "character",
  name: "Jetsam",
  version: "Riffraff",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "003",
  cardNumber: 76,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d3950786da4a4d3497090ce82253a144",
    tcgPlayer: 532928,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "EERIE PAIR",
      description: "Your characters named Flotsam gain Ward.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    ward,
    {
      effect: {
        keyword: "Ward",
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
      id: "1py-2",
      name: "EERIE PAIR",
      text: "EERIE PAIR Your characters named Flotsam gain Ward.",
      type: "static",
    },
  ],
  i18n: jetsamRiffraffI18n,
};
