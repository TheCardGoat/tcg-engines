import type { ActionCard } from "@tcg/lorcana-types";
import { peopleGonnaComeHereI18n } from "./200-people-gonna-come-here.i18n";

export const peopleGonnaComeHere: ActionCard = {
  id: "cie",
  canonicalId: "ci_cie",
  slug: "lorcana-ci_cie",
  printings: [
    {
      id: "set14-200",
      artId: "set14-200",
      setCode: "set14",
      collectorNumber: "200",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-200"],
  cardType: "action",
  name: "People Gonna Come Here",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "014",
  cardNumber: 200,
  rarity: "rare",
  cost: 7,
  inkable: true,
  text: "Play a location from your hand or discard for free. If a character sang this song, you may move them to that location for free.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Play a location from your hand or discard for free. If a character sang this song, you may move them to that location for free.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "play-card",
            from: ["hand", "discard"],
            cardType: "location",
            cost: "free",
          },
          {
            type: "conditional",
            condition: {
              type: "and",
              conditions: [
                { type: "if-you-do" },
                {
                  type: "play-context",
                  context: "characters-sang-this-song",
                  comparison: { operator: "gte", value: 1 },
                },
              ],
            },
            then: {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "move-to-location",
                cost: "free",
                character: {
                  selector: "all",
                  count: "all",
                  reference: "singers",
                },
                location: {
                  selector: "all",
                  count: 1,
                  reference: "chosen-or-source",
                  zones: ["play"],
                  cardTypes: ["location"],
                },
              },
            },
          },
        ],
      },
    },
  ],
  i18n: peopleGonnaComeHereI18n,
};
