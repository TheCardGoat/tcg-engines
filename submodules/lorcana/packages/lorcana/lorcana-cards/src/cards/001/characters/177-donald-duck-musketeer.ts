import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckMusketeerI18n } from "./177-donald-duck-musketeer.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const donaldDuckMusketeer: CharacterCard = {
  id: "8Ze",
  canonicalId: "ci_8Ze",
  reprints: ["set1-177"],
  cardType: "character",
  name: "Donald Duck",
  version: "Musketeer",
  inkType: ["steel"],
  set: "001",
  cardNumber: 177,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e854c2e94f504118b3618ae2eb10a195",
    tcgPlayer: 508907,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "STAY ALERT!",
      description:
        "During your turn, your Musketeer characters gain Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  abilities: [
    bodyguard,
    {
      condition: {
        type: "during-turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: {
          count: "all",
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Musketeer",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "1te-2",
      name: "STAY ALERT!",
      text: "STAY ALERT! During your turn, your Musketeer characters gain Evasive.",
      type: "static",
    },
  ],
  i18n: donaldDuckMusketeerI18n,
};
