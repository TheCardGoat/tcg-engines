import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellPeterPansAllyI18n } from "./058-tinker-bell-peter-pans-ally.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const tinkerBellPeterPansAlly: CharacterCard = {
  id: "52N",
  canonicalId: "ci_52N",
  reprints: ["set1-058"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Peter Pan’s Ally",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "001",
  cardNumber: 58,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_3ac122b5a08e42ac986aa536da6c1000",
    tcgPlayer: 507488,
  },
  text: "Evasive LOYAL AND DEVOTED Your characters named Peter Pan gain Challenger +1. (They get +1 while challenging.)",
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [
    evasive,
    {
      id: "52N-2",
      name: "LOYAL AND DEVOTED",
      text: "LOYAL AND DEVOTED Your characters named Peter Pan gain Challenger +1.",
      type: "static",
      effect: {
        keyword: "Challenger",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Peter Pan",
            },
          ],
        },
        type: "gain-keyword",
        value: 1,
      },
    },
  ],
  i18n: tinkerBellPeterPansAllyI18n,
};
