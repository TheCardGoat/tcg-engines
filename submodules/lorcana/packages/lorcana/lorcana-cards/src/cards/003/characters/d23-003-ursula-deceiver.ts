import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaDeceiverD23I18n } from "./d23-003-ursula-deceiver.i18n";

export const ursulaDeceiverD23: CharacterCard = {
  id: "I40",
  canonicalId: "ci_Y9v",
  slug: "lorcana-ci_Y9v",
  printings: [
    {
      id: "set3-d23-003",
      artId: "set3-d23-003",
      setCode: "set3",
      collectorNumber: "3",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set3-d23-003", "set3-090", "set9-090"],
  cardType: "character",
  name: "Ursula",
  version: "Deceiver",
  inkType: ["emerald"],
  franchise: "D23",
  set: "003",
  cardNumber: 3,
  rarity: "special",
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
      title: "You'll Never Even Miss It",
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
  i18n: ursulaDeceiverD23I18n,
};
