import type { CharacterCard } from "@tcg/lorcana-types";
import { diabloMaleficentsSpyI18n } from "./071-diablo-maleficents-spy.i18n";

export const diabloMaleficentsSpy: CharacterCard = {
  id: "hgt",
  canonicalId: "ci_hgt",
  reprints: ["set4-071"],
  cardType: "character",
  name: "Diablo",
  version: "Maleficent's Spy",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "004",
  cardNumber: 71,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_abd789362dc8479c8dc89e89859b6a6a",
    tcgPlayer: 550574,
  },
  text: [
    {
      title: "SCOUT AHEAD",
      description: "When you play this character, you may look at each opponent's hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "EACH_OPPONENT",
          type: "reveal-hand",
        },
        type: "optional",
      },
      id: "hgt-1",
      name: "SCOUT AHEAD",
      text: "SCOUT AHEAD When you play this character, you may look at each opponent's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: diabloMaleficentsSpyI18n,
};
