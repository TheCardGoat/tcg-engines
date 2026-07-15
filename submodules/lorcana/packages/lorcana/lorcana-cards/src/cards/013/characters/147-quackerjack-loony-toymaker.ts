import type { CharacterCard } from "@tcg/lorcana-types";
import { quackerjackLoonyToymakerI18n } from "./147-quackerjack-loony-toymaker.i18n";

export const quackerjackLoonyToymaker: CharacterCard = {
  id: "Lhx",
  canonicalId: "ci_Lhx",
  slug: "lorcana-ci_Lhx",
  printings: [
    {
      id: "set13-147",
      artId: "set13-147",
      setCode: "set13",
      collectorNumber: "147",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set13-147"],
  cardType: "character",
  name: "Quackerjack",
  version: "Loony Toymaker",
  inkType: ["sapphire"],
  franchise: "Darkwing Duck",
  set: "013",
  cardNumber: 147,
  rarity: "legendary",
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_16b794fd9cf642e3853383e2c06593bc",
  },
  text: [
    {
      title: "EVIL DESIGN",
      description:
        "When you play this character and whenever he quests, put the top 4 cards of your deck into your discard. You may deal 1 damage to chosen character for each item card put into your discard this way.",
    },
  ],
  classifications: ["Storyborn", "Super", "Villain", "Inventor"],
  abilities: [
    {
      type: "triggered",
      name: "EVIL DESIGN",
      text: "EVIL DESIGN When you play this character and whenever he quests, put the top 4 cards of your deck into your discard. You may deal 1 damage to chosen character for each item card put into your discard this way.",
      trigger: {
        events: ["play", "quest"],
        on: "SELF",
        timing: "when-or-whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "mill",
            amount: 4,
            target: "CONTROLLER",
          },
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "count",
                  what: "discarded-item-cards",
                },
                {
                  type: "deal-damage",
                  amount: {
                    type: "trigger-amount",
                  },
                  target: {
                    selector: "chosen",
                    count: 1,
                    owner: "any",
                    zones: ["play"],
                    cardTypes: ["character"],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
  i18n: quackerjackLoonyToymakerI18n,
};
