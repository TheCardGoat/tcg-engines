import type { CharacterCard } from "@tcg/lorcana-types";
import { beastWolfsbaneI18n } from "./070-beast-wolfsbane.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const beastWolfsbane: CharacterCard = {
  id: "bXY",
  canonicalId: "ci_bXY",
  reprints: ["set1-070"],
  cardType: "character",
  name: "Beast",
  version: "Wolfsbane",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 70,
  rarity: "legendary",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_cd3d8417b8544063ae6a41766d24b130",
    tcgPlayer: 501404,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "ROAR",
      description: "When you play this character, exert all opposing damaged characters.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
  abilities: [
    rush,
    {
      id: "bXY-2",
      name: "ROAR",
      text: "ROAR When you play this character, exert all opposing damaged characters.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "exert",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "damaged",
            },
          ],
        },
      },
    },
  ],
  i18n: beastWolfsbaneI18n,
};
