import type { CharacterCard } from "@tcg/lorcana-types";
import { sisuDaringVisitorI18n } from "./119-sisu-daring-visitor.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const sisuDaringVisitor: CharacterCard = {
  id: "352",
  canonicalId: "ci_zcv",
  slug: "lorcana-ci_zcv",
  printings: [
    {
      id: "set9-119",
      artId: "set9-119",
      setCode: "set9",
      collectorNumber: "119",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set4-123", "set9-119"],
  cardType: "character",
  name: "Sisu",
  version: "Daring Visitor",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "009",
  cardNumber: 119,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_76066fccc9724d34b6e7a238e52bee61",
    tcgPlayer: "650055",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "BRING ON THE HEAT!",
      description:
        "When you play this character, banish chosen opposing character with 1 {S} or less.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
  abilities: [
    evasive,
    {
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: 1,
            },
          ],
        },
      },
      id: "1y1-2",
      name: "BRING ON THE HEAT!",
      text: "BRING ON THE HEAT! When you play this character, banish chosen opposing character with 1 {S} or less.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: sisuDaringVisitorI18n,
};
