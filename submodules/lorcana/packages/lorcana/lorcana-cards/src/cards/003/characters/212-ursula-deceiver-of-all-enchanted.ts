import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaDeceiverOfAllEnchantedI18n } from "./212-ursula-deceiver-of-all-enchanted.i18n";

export const ursulaDeceiverOfAllEnchanted: CharacterCard = {
  id: "bW0",
  canonicalId: "ci_hfF",
  slug: "lorcana-ci_hfF",
  printings: [
    {
      id: "set3-212-enchanted",
      artId: "ci_hfF-enchanted",
      setCode: "set3",
      collectorNumber: "212",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set3-091"],
  cardType: "character",
  name: "Ursula",
  version: "Deceiver of All",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "003",
  cardNumber: 212,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7c5be60911d844b48189f3a042abdcfa",
    tcgPlayer: "539164",
  },
  text: [
    {
      title: "WHAT",
      description:
        "A DEAL Whenever this character sings a song, you may play that song again from your discard for free, then put it on the bottom of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              cost: "free",
              filter: {
                cardType: "song",
              },
              from: "discard",
              type: "play-card",
            },
            {
              condition: {
                type: "if-you-do",
              },
              then: {
                target: {
                  ref: "previous-target",
                },
                type: "put-on-bottom",
              },
              type: "conditional",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      trigger: {
        event: "sing",
        on: "SELF",
        timing: "whenever",
      },
      id: "vf1-1",
      name: "WHAT A DEAL",
      text: "WHAT A DEAL Whenever this character sings a song, you may play that song again from your discard for free, then put it on the bottom of your deck.",
      type: "triggered",
    },
  ],
  i18n: ursulaDeceiverOfAllEnchantedI18n,
};
