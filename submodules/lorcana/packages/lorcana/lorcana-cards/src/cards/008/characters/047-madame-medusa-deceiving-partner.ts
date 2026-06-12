import type { CharacterCard } from "@tcg/lorcana-types";
import { madameMedusaDeceivingPartnerI18n } from "./047-madame-medusa-deceiving-partner.i18n";

export const madameMedusaDeceivingPartner: CharacterCard = {
  id: "9f8",
  canonicalId: "ci_9f8",
  reprints: ["set8-047"],
  cardType: "character",
  name: "Madame Medusa",
  version: "Deceiving Partner",
  inkType: ["amethyst", "ruby"],
  franchise: "Rescuers",
  set: "008",
  cardNumber: 47,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c25b03f0800041229325ec211c5e132c",
    tcgPlayer: 631382,
  },
  text: [
    {
      title: "DOUBLE-CROSS",
      description:
        "When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              amount: 2,
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                excludeSelf: true,
              },
              type: "deal-damage",
            },
            {
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [
                  {
                    type: "cost-comparison",
                    comparison: "less-or-equal",
                    value: 2,
                  },
                ],
              },
              type: "return-to-hand",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "dvp-1",
      name: "DOUBLE-CROSS",
      text: "DOUBLE-CROSS When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: madameMedusaDeceivingPartnerI18n,
};
