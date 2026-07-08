import type { LocationCard } from "@tcg/lorcana-types";
import { vineEntranceOminousPassagewayI18n } from "./207-vine-entrance-ominous-passageway.i18n";

export const vineEntranceOminousPassageway: LocationCard = {
  id: "Rb1",
  canonicalId: "ci_Rb1",
  slug: "lorcana-ci_Rb1",
  printings: [
    {
      id: "set13-207",
      artId: "set13-207",
      setCode: "set13",
      collectorNumber: "207",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-207"],
  cardType: "location",
  name: "Vine Entrance",
  version: "Ominous Passageway",
  inkType: ["steel"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 207,
  rarity: "rare",
  cost: 3,
  willpower: 7,
  moveCost: 1,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Root of Power",
      description:
        "The first time a Floodborn character moves here each turn, you may deal 1 damage to chosen character.",
    },
  ],
  abilities: [
    {
      type: "triggered",
      name: "ROOT OF POWER",
      text: "ROOT OF POWER The first time a Floodborn character moves here each turn, you may deal 1 damage to chosen character.",
      trigger: {
        event: "move",
        on: "CHARACTERS_HERE",
        restrictions: [
          {
            type: "first-time-each-turn",
          },
        ],
        timing: "when",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          reference: "trigger-subject",
          filters: [
            {
              type: "has-classification",
              classification: "Floodborn",
            },
          ],
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
  i18n: vineEntranceOminousPassagewayI18n,
};
