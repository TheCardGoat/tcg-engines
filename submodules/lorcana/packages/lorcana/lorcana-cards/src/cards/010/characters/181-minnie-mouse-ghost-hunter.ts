import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseGhostHunterI18n } from "./181-minnie-mouse-ghost-hunter.i18n";

export const minnieMouseGhostHunter: CharacterCard = {
  id: "0cC",
  canonicalId: "ci_CEB",
  reprints: ["set10-181"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Ghost Hunter",
  inkType: ["steel"],
  set: "010",
  cardNumber: 181,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1ad6e15d73174d7ab0d55b27d770e14d",
    tcgPlayer: 660364,
  },
  text: [
    {
      title: "SEARCH THE SHADOWS",
      description:
        "When you play this character, chosen Detective character gains Alert this turn. (They can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Alert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Detective",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "oy7-1",
      name: "SEARCH THE SHADOWS",
      text: "SEARCH THE SHADOWS When you play this character, chosen Detective character gains Alert this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: minnieMouseGhostHunterI18n,
};
