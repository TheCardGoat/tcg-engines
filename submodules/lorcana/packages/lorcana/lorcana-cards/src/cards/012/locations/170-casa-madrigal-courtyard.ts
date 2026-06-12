import type { LocationCard } from "@tcg/lorcana-types";
import { casaMadrigalCourtyardI18n } from "./170-casa-madrigal-courtyard.i18n";

export const casaMadrigalCourtyard: LocationCard = {
  id: "xbQ",
  canonicalId: "ci_xbQ",
  reprints: ["set12-170"],
  cardType: "location",
  name: "Casa Madrigal",
  version: "Courtyard",
  inkType: ["sapphire"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 170,
  rarity: "common",
  cost: 4,
  willpower: 7,
  moveCost: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_69c16dd8004b4fbf8051c91ac50bc6cb",
  },
  text: [
    {
      title: "HEALING HOME",
      description:
        "Whenever a character quests while here, you may remove up to 2 damage from the. Then, you may remove up to 2 damage from this location.",
    },
  ],
  abilities: [
    {
      id: "xbQ-1",
      name: "Healing Home",
      type: "triggered",
      text: "Healing Home Whenever a character quests while here, you may remove up to 2 damage from them. Then, you may remove up to 2 damage from this location.",
      trigger: {
        event: "quest",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "remove-damage",
              amount: {
                type: "up-to",
                value: 2,
              },
              target: {
                selector: "all",
                count: 1,
                reference: "trigger-subject",
              },
            },
          },
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "remove-damage",
              amount: {
                type: "up-to",
                value: 2,
              },
              target: {
                selector: "all",
                count: 1,
                reference: "source",
              },
            },
          },
        ],
      },
    },
  ],
  i18n: casaMadrigalCourtyardI18n,
};
