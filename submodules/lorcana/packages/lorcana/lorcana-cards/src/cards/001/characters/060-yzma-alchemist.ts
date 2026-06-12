import type { CharacterCard } from "@tcg/lorcana-types";
import { yzmaAlchemistI18n } from "./060-yzma-alchemist.i18n";

export const yzmaAlchemist: CharacterCard = {
  id: "WU8",
  canonicalId: "ci_WU8",
  reprints: ["set1-060"],
  cardType: "character",
  name: "Yzma",
  version: "Alchemist",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "001",
  cardNumber: 60,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fd1e38170964420294911187ef450c55",
    tcgPlayer: 492715,
  },
  text: [
    {
      title: "YOU'RE EXCUSED",
      description:
        "Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "WU8-1",
      name: "YOU'RE EXCUSED",
      text: "YOU'RE EXCUSED Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "scry",
        amount: 1,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "deck-top",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
    },
  ],
  i18n: yzmaAlchemistI18n,
};
