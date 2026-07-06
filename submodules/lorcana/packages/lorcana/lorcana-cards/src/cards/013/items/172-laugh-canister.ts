import type { ItemCard } from "@tcg/lorcana-types";
import { laughCanisterI18n } from "./172-laugh-canister.i18n";

export const laughCanister: ItemCard = {
  id: "3R1",
  canonicalId: "ci_3R1",
  slug: "lorcana-ci_3R1",
  printings: [
    {
      id: "set13-172",
      artId: "set13-172",
      setCode: "set13",
      collectorNumber: "172",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-172"],
  cardType: "item",
  name: "Laugh Canister",
  inkType: ["sapphire"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 172,
  rarity: "rare",
  cost: 3,
  inkable: false,
  text: [
    {
      title: "Copycat",
      description:
        "{E} — Put the top card of your deck into your inkwell facedown and exerted. Chosen opponent may put the top card of their deck into their inkwell facedown and exerted.",
    },
  ],
  abilities: [
    {
      type: "activated",
      name: "COPYCAT",
      text: "COPYCAT {E} — Put the top card of your deck into your inkwell facedown and exerted. Chosen opponent may put the top card of their deck into their inkwell facedown and exerted.",
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "put-into-inkwell",
            source: "top-of-deck",
            target: "CONTROLLER",
            facedown: true,
            exerted: true,
          },
          {
            type: "optional",
            chooser: "OPPONENT",
            effect: {
              type: "put-into-inkwell",
              source: "top-of-deck",
              target: "OPPONENT",
              facedown: true,
              exerted: true,
            },
          },
        ],
      },
    },
  ],
  i18n: laughCanisterI18n,
};
