import type { CharacterCard } from "@tcg/lorcana-types";
import { tamatoaHappyAsAClamEnchantedI18n } from "./219-tamatoa-happy-as-a-clam-enchanted.i18n";

export const tamatoaHappyAsAClamEnchanted: CharacterCard = {
  id: "wGT",
  canonicalId: "ci_rx2",
  slug: "lorcana-ci_rx2",
  printings: [
    {
      id: "set7-219-enchanted",
      artId: "ci_rx2-enchanted",
      setCode: "set7",
      collectorNumber: "219",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set7-162"],
  cardType: "character",
  name: "Tamatoa",
  version: "Happy as a Clam",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "007",
  cardNumber: 219,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f2493d13b19a45559af0e7ce96f079bc",
    tcgPlayer: "619747",
  },
  text: [
    {
      title: "COOLEST COLLECTION",
      description:
        "When you play this character, return up to 2 item cards from your discard to your hand.",
    },
    {
      title: "I'M BEAUTIFUL, BABY!",
      description: "Whenever this character quests, you may play an item for free.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: {
            upTo: 2,
          },
          owner: "you",
          zones: ["discard"],
          cardTypes: ["item"],
        },
      },
      id: "1i4-1",
      name: "COOLEST COLLECTION",
      text: "COOLEST COLLECTION When you play this character, return up to 2 item cards from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "item",
          cost: "free",
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "1i4-2",
      name: "I'M BEAUTIFUL, BABY!",
      text: "I'M BEAUTIFUL, BABY! Whenever this character quests, you may play an item for free.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: tamatoaHappyAsAClamEnchantedI18n,
};
