import type { CharacterCard } from "@tcg/lorcana-types";
import { eeyoreInTheWayEnchantedI18n } from "./226-eeyore-in-the-way-enchanted.i18n";

export const eeyoreInTheWayEnchanted: CharacterCard = {
  id: "wXy",
  canonicalId: "ci_e9D",
  slug: "lorcana-ci_e9D",
  printings: [
    {
      id: "set11-226-enchanted",
      artId: "ci_e9D-enchanted",
      setCode: "set11",
      collectorNumber: "226",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set11-045"],
  cardType: "character",
  name: "Eeyore",
  version: "In the Way",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "011",
  cardNumber: 226,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 9,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_758bab20496f4673991e53ac59f1bcaa",
    tcgPlayer: "675279",
  },
  text: [
    {
      title: "THANKS FOR NOTICIN' ME",
      description: "For each exerted character in play, you pay 1 {I} less to play this character.",
    },
    {
      title: "SORRY ABOUT THAT",
      description:
        "When you play this character, for each opposing player, you may choose a character of theirs. They can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1ey-1",
      name: "THANKS FOR NOTICIN' ME",
      effect: {
        type: "cost-reduction",
        amount: {
          type: "filtered-count",
          filters: [
            {
              type: "exerted",
            },
          ],
          cardType: "character",
          owner: "any",
          zones: ["play"],
        },
      },
      sourceZones: ["hand"],
      type: "static",
      text: "THANKS FOR NOTICIN' ME For each exerted character in play, you pay 1 {I} less to play this character.",
    },
    {
      id: "1ey-2",
      effect: {
        type: "for-each-opponent",
        effect: {
          type: "optional",
          chooser: "CONTROLLER",
          effect: {
            type: "restriction",
            restriction: "cant-ready",
            duration: "until-start-of-next-turn",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "opponent",
              selector: "chosen",
              zones: ["play"],
            },
          },
        },
      },
      name: "SORRY ABOUT THAT",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "SORRY ABOUT THAT When you play this character, for each opposing player, you may choose a character of theirs. They can't ready at the start of their next turn.",
    },
  ],
  i18n: eeyoreInTheWayEnchantedI18n,
};
