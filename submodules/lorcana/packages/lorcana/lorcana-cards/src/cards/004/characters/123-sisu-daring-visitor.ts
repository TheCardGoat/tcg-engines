import type { CharacterCard } from "@tcg/lorcana-types";
import { sisuDaringVisitorI18n } from "./123-sisu-daring-visitor.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const sisuDaringVisitor: CharacterCard = {
  id: "W3s",
  canonicalId: "ci_zcv",
  reprints: ["set4-123", "set9-119"],
  cardType: "character",
  name: "Sisu",
  version: "Daring Visitor",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cardNumber: 123,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_76066fccc9724d34b6e7a238e52bee61",
    tcgPlayer: 650055,
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
