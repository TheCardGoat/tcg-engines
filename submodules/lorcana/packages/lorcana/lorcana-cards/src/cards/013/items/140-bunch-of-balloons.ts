import type { ItemCard } from "@tcg/lorcana-types";
import { bunchOfBalloonsI18n } from "./140-bunch-of-balloons.i18n";

export const bunchOfBalloons: ItemCard = {
  id: "PAC",
  canonicalId: "ci_PAC",
  slug: "lorcana-ci_PAC",
  printings: [
    {
      id: "set13-140",
      artId: "set13-140",
      setCode: "set13",
      collectorNumber: "140",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-140"],
  cardType: "item",
  name: "Bunch of Balloons",
  inkType: ["ruby"],
  franchise: "Up",
  set: "013",
  cardNumber: 140,
  rarity: "rare",
  cost: 1,
  inkable: true,
  text: [
    {
      title: "Float Away",
      description:
        "When you play this item, choose a location of yours. While this item is in play, that location gains Evasive. (Only characters with Evasive can challenge it.)",
    },
    {
      title: "Out of Sight",
      description: "3 {I} — Return this item to your hand.",
    },
  ],
  abilities: [
    {
      id: "PAC-1",
      name: "FLOAT AWAY",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        duration: "while-in-play",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["location"],
        },
      },
      text: "FLOAT AWAY When you play this item, choose a location of yours. While this item is in play, that location gains Evasive.",
    },
    {
      id: "PAC-2",
      name: "OUT OF SIGHT",
      type: "activated",
      cost: {
        ink: 3,
      },
      effect: {
        type: "return-to-hand",
        target: "THIS_ITEM",
      },
      text: "OUT OF SIGHT 3 {I} - Return this item to your hand.",
    },
  ],
  i18n: bunchOfBalloonsI18n,
};
