import type { ItemCard } from "@tcg/lorcana-types";
import { gyroevacI18n } from "./100-gyro-evac.i18n";

export const gyroevac: ItemCard = {
  id: "EdK",
  canonicalId: "ci_EdK",
  reprints: ["set12-100"],
  cardType: "item",
  name: "Gyro-Evac",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 100,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_50ad67bd180c4d4a95abcf5ab4eb42bc",
  },
  text: [
    {
      title: "TAKE HER UP",
      description:
        "{E}, 1 {I} — Chosen character of yours gains Evasive until the start of your next turn.",
    },
    {
      title: "CRASH LANDING",
      description: "{E}, Banish this item — Each player loses 2 lore.",
    },
  ],
  abilities: [
    {
      id: "EdK-1",
      name: "TAKE HER UP",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        duration: "until-start-of-next-turn",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
        },
      },
      text: "TAKE HER UP {E}, 1 {I} — Chosen character of yours gains Evasive until the start of your next turn.",
    },
    {
      id: "EdK-2",
      name: "CRASH LANDING",
      type: "activated",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        type: "lose-lore",
        amount: 2,
        target: "EACH_PLAYER",
      },
      text: "CRASH LANDING {E}, Banish this item — Each player loses 2 lore.",
    },
  ],
  i18n: gyroevacI18n,
};
