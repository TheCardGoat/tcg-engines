import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinOnTheEdgeOfAdventureEpicI18n } from "./211-aladdin-on-the-edge-of-adventure-epic.i18n";

export const aladdinOnTheEdgeOfAdventureEpic: CharacterCard = {
  id: "i8r",
  canonicalId: "ci_ioY",
  slug: "lorcana-ci_ioY",
  printings: [
    {
      id: "set11-211-epic",
      artId: "ci_ioY-epic",
      setCode: "set11",
      collectorNumber: "211",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set11-081"],
  cardType: "character",
  name: "Aladdin",
  version: "On the Edge of Adventure",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "011",
  cardNumber: 211,
  rarity: "common",
  specialRarity: "epic",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_629d577b144c424286035635ec968b4a",
    tcgPlayer: "677146",
  },
  text: [
    {
      title: "QUICK ON HIS FEET",
      description:
        "Whenever you play an action, this character gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "11s-1",
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
        duration: "until-start-of-next-turn",
      },
      name: "QUICK ON HIS FEET",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
      text: "QUICK ON HIS FEET Whenever you play an action, this character gains Evasive until the start of your next turn.",
    },
  ],
  i18n: aladdinOnTheEdgeOfAdventureEpicI18n,
};
