import type { CharacterCard } from "@tcg/lorcana-types";
import { wasabiMethodicalEngineerP2ChallengeI18n } from "./p2-013-wasabi-methodical-engineer-challenge.i18n";

export const wasabiMethodicalEngineerP2Challenge: CharacterCard = {
  id: "iKn",
  canonicalId: "ci_3z5",
  slug: "lorcana-ci_3z5",
  printings: [
    {
      id: "set6-p2-013-challenge",
      artId: "ci_3z5-challenge",
      setCode: "set6",
      collectorNumber: "13",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set6-149"],
  cardType: "character",
  name: "Wasabi",
  version: "Methodical Engineer",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 13,
  rarity: "special",
  specialRarity: "challenge",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_40ef816e4c7a43cba37bb9f51a586626",
    tcgPlayer: "578231",
  },
  text: [
    {
      title: "BLADES OF FURY",
      description:
        "When you play this character, you may banish chosen item. Its player gains 1 lore.",
    },
    {
      title: "QUICK REFLEXES",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["item"],
              },
              type: "banish",
            },
            {
              amount: 1,
              target: "CARD_OWNER",
              type: "gain-lore",
            },
          ],
        },
        type: "optional",
      },
      id: "l5t-1",
      name: "BLADES OF FURY",
      text: "BLADES OF FURY When you play this character, you may banish chosen item. Its player gains 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "l5t-2",
      name: "QUICK REFLEXES",
      text: "QUICK REFLEXES During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: wasabiMethodicalEngineerP2ChallengeI18n,
};
