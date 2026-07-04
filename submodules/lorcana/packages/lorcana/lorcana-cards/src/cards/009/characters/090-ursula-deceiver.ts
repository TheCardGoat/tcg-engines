import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaDeceiverI18n } from "./090-ursula-deceiver.i18n";

export const ursulaDeceiver: CharacterCard = {
  id: "Y9v",
  canonicalId: "ci_Y9v",
  slug: "lorcana-ci_Y9v",
  printings: [
    {
      id: "set9-090",
      artId: "set9-090",
      setCode: "set9",
      collectorNumber: "90",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set3-d23-003", "set3-090", "set9-090"],
  cardType: "character",
  name: "Ursula",
  version: "Deceiver",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "009",
  cardNumber: 90,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_af9ce05b294a4ecdb8e7401fff74a992",
    tcgPlayer: "650029",
  },
  text: [
    {
      title: "YOU'LL NEVER EVEN MISS IT",
      description:
        "When you play this character, chosen opponent reveals their hand and discards a song card of your choice.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "OPPONENT",
          },
          {
            type: "discard",
            amount: 1,
            target: "OPPONENT",
            from: "hand",
            chosen: true,
            chosenBy: "you",
            filter: {
              cardType: "song",
            },
          },
        ],
      },
      id: "d21-1",
      name: "YOU'LL NEVER EVEN MISS IT",
      text: "YOU'LL NEVER EVEN MISS IT When you play this character, chosen opponent reveals their hand and discards a song card of your choice.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: ursulaDeceiverI18n,
};
