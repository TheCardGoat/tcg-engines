import type { LocationCard } from "@tcg/lorcana-types";
import { sleepyHollowTheBridgeI18n } from "./136-sleepy-hollow-the-bridge.i18n";

export const sleepyHollowTheBridge: LocationCard = {
  id: "eWQ",
  canonicalId: "ci_eWQ",
  reprints: ["set10-136"],
  cardType: "location",
  name: "Sleepy Hollow",
  version: "The Bridge",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  cardNumber: 136,
  rarity: "uncommon",
  cost: 3,
  willpower: 6,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_98339be4f48249779fb2ae2de3e9b757",
    tcgPlayer: 660018,
  },
  text: [
    {
      title: "HEAD FOR THE BRIDGE!",
      description:
        "Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              duration: "until-start-of-next-turn",
              keyword: "Evasive",
              target: {
                selector: "all",
                count: 1,
                reference: "trigger-subject",
              },
              type: "gain-keyword",
            },
            {
              target: {
                selector: "self",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["location"],
              },
              type: "banish",
            },
            {
              amount: 2,
              type: "gain-lore",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "z63-1",
      name: "HEAD FOR THE BRIDGE!",
      text: "HEAD FOR THE BRIDGE! Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: sleepyHollowTheBridgeI18n,
};
