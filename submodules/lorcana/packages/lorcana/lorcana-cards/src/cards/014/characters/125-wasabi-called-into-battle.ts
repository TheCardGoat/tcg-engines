import type { CharacterCard } from "@tcg/lorcana-types";
import { wasabiCalledIntoBattleI18n } from "./125-wasabi-called-into-battle.i18n";

export const wasabiCalledIntoBattle: CharacterCard = {
  id: "j34",
  canonicalId: "ci_j34",
  slug: "lorcana-ci_j34",
  printings: [
    {
      id: "set14-125",
      artId: "set14-125",
      setCode: "set14",
      collectorNumber: "125",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-125"],
  cardType: "character",
  name: "Wasabi",
  version: "Called into Battle",
  inkType: ["ruby"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 125,
  rarity: "super_rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_e374a2bd0f3c42bb87ab9f365f9b91fe",
  },
  text: [
    {
      title: "TWIN BLADES",
      description:
        "During your turn, whenever this character deals damage to another character in a challenge, deal damage equal to this character's {S} to another chosen character.",
    },
    {
      title: "BRING THE HEAT",
      description: "While you have an ink drop, this character gets +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Super", "Hero", "Inventor"],
  abilities: [
    {
      id: "j34-1",
      name: "TWIN BLADES",
      type: "triggered",
      text: "TWIN BLADES During your turn, whenever this character deals damage to another character in a challenge, deal damage equal to this character's {S} to another chosen character.",
      trigger: {
        event: "deal-damage",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "in-challenge",
          },
          {
            type: "defender-is-character",
          },
        ],
      },
      effect: {
        type: "deal-damage",
        amount: {
          type: "strength-of",
          target: "SELF",
        },
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
        },
      },
    },
    {
      id: "j34-2",
      name: "BRING THE HEAT",
      type: "static",
      text: "BRING THE HEAT While you have an ink drop, this character gets +2 {S}.",
      condition: {
        type: "resource-count",
        what: "ink-drops",
        controller: "you",
        comparison: "greater-or-equal",
        value: 1,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  i18n: wasabiCalledIntoBattleI18n,
};
