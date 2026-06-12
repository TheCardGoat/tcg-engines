import type { ActionCard } from "@tcg/lorcana-types";
import { whosWithMeI18n } from "./131-whos-with-me.i18n";

export const whosWithMe: ActionCard = {
  id: "OM9",
  canonicalId: "ci_OM9",
  reprints: ["set5-131"],
  cardType: "action",
  name: "Who's With Me?",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "005",
  cardNumber: 131,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_534a9b86f32b472ab15ec30d254d76e3",
    tcgPlayer: 560637,
  },
  text: [
    {
      title: "Your characters get +2 {S} this turn.",
    },
    {
      title:
        "Whenever one of your characters with Reckless challenges another character this turn, gain 2 lore.",
    },
  ],
  abilities: [
    {
      id: "4hv-1",
      type: "action",
      text: "Your characters get +2 {S} this turn. Whenever one of your characters with Reckless challenges another character this turn, gain 2 lore.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            duration: "this-turn",
            modifier: 2,
            stat: "strength",
            target: "YOUR_CHARACTERS",
          },
          {
            type: "create-triggered-ability",
            lifecycle: {
              kind: "floating",
              duration: "this-turn",
            },
            ability: {
              trigger: {
                event: "challenge",
                on: "YOUR_CHARACTERS",
                timing: "whenever",
                attacker: {
                  filters: [
                    {
                      type: "has-keyword",
                      keyword: "Reckless",
                    },
                  ],
                },
                defender: {},
              },
              effect: {
                type: "gain-lore",
                amount: 2,
                target: "CONTROLLER",
              },
            },
          },
        ],
      },
    },
  ],
  i18n: whosWithMeI18n,
};
