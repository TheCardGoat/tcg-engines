import type { CharacterCard } from "@tcg/op-types";
import { op08BiscuitWarrior072I18n } from "./072-biscuit-warrior.i18n.ts";

export const op08BiscuitWarrior072: CharacterCard = {
  id: "OP08-072",
  canonicalId: "OP08-072",
  slug: "biscuit-warrior",
  name: "Biscuit Warrior",
  printings: [
    {
      id: "OP08-072",
      artId: "OP08-072",
      setCode: "OP08",
      collectorNumber: "072",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-072.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP08",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  effect:
    "Under the rules of this game, you may have any number of this card in your deck. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op08BiscuitWarrior072I18n,
};
