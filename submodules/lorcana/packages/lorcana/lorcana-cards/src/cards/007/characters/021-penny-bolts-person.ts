import type { CharacterCard } from "@tcg/lorcana-types";
import { pennyBoltsPersonI18n } from "./021-penny-bolts-person.i18n";

export const pennyBoltsPerson: CharacterCard = {
  id: "PYz",
  canonicalId: "ci_PYz",
  reprints: ["set7-021"],
  cardType: "character",
  name: "Penny",
  version: "Bolt's Person",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "007",
  cardNumber: 21,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_32c3d2920fe747bbb4ee7e95f78523d8",
    tcgPlayer: 619416,
  },
  text: [
    {
      title: "ENDURING LOYALTY",
      description:
        "When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "remove-damage",
              amount: { type: "up-to", value: 2 },
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            {
              type: "gain-keyword",
              keyword: "Resist",
              value: 1,
              duration: "until-start-of-next-turn",
              target: { ref: "previous-target" },
            },
          ],
        },
        type: "optional",
      },
      id: "i2f-1",
      name: "ENDURING LOYALTY",
      text: "ENDURING LOYALTY When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: pennyBoltsPersonI18n,
};
