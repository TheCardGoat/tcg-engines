import type { CharacterCard } from "@tcg/lorcana-types";
import { annaEagerAcolyteI18n } from "./056-anna-eager-acolyte.i18n";

export const annaEagerAcolyte: CharacterCard = {
  id: "Bnt",
  canonicalId: "ci_Bnt",
  reprints: ["set5-056"],
  cardType: "character",
  name: "Anna",
  version: "Eager Acolyte",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 56,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_63be1159dcec47dba6234bf124f86c75",
    tcgPlayer: 561954,
  },
  text: [
    {
      title: "GROWING POWERS",
      description:
        "When you play this character, each opponent chooses and exerts one of their ready characters.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen"],
  abilities: [
    {
      id: "Bnt-1",
      name: "GROWING POWERS",
      text: "GROWING POWERS When you play this character, each opponent chooses and exerts one of their ready characters.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "exert",
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          cardTypes: ["character"],
          zones: ["play"],
          filter: [
            {
              type: "status",
              status: "ready",
            },
          ],
        },
      },
    },
  ],
  i18n: annaEagerAcolyteI18n,
};
