import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseMusketeerChampionI18n } from "./017-minnie-mouse-musketeer-champion.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const minnieMouseMusketeerChampion: CharacterCard = {
  id: "Wtk",
  canonicalId: "ci_AWE",
  reprints: ["set4-017"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Musketeer Champion",
  inkType: ["amber"],
  set: "004",
  cardNumber: 17,
  rarity: "common",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_b20587f1945e42d59b750f9b69cc4a6b",
    tcgPlayer: 550537,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "DRAMATIC ENTRANCE",
      description:
        "When you play this character, banish chosen opposing character with 5 {S} or more.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  abilities: [
    bodyguard,
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "greater-or-equal",
              value: 5,
            },
          ],
        },
        type: "banish",
      },
      id: "1kb-2",
      name: "DRAMATIC ENTRANCE",
      text: "DRAMATIC ENTRANCE When you play this character, banish chosen opposing character with 5 {S} or more.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: minnieMouseMusketeerChampionI18n,
};
