import type { CharacterCard } from "@tcg/lorcana-types";
import { lefouInstigatorI18n } from "./103-lefou-instigator.i18n";

export const lefouInstigator: CharacterCard = {
  id: "Kra",
  canonicalId: "ci_KDb",
  slug: "lorcana-ci_KDb",
  printings: [
    {
      id: "set9-103",
      artId: "set9-103",
      setCode: "set9",
      collectorNumber: "103",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set1-112", "set9-103"],
  cardType: "character",
  name: "LeFou",
  version: "Instigator",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "009",
  cardNumber: 103,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f3852a9841064672acd078eb9d2220a1",
    tcgPlayer: "650041",
  },
  text: [
    {
      title: "FAN THE FLAMES",
      description:
        "When you play this character, ready chosen character. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: {
              ref: "previous-target",
            },
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "kll-1",
      name: "FAN THE FLAMES",
      text: "FAN THE FLAMES When you play this character, ready chosen character. They can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: lefouInstigatorI18n,
};
