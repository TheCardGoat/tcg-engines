import type { CharacterCard } from "@tcg/lorcana-types";
import { pterodactylJanieDollSidsToyI18n } from "./128-pterodactyl-janie-doll-sids-toy.i18n";

export const pterodactylJanieDollSidsToy: CharacterCard = {
  id: "7me",
  canonicalId: "ci_7me",
  reprints: ["set12-128"],
  cardType: "character",
  name: "Pterodactyl Janie Doll",
  version: "Sid's Toy",
  inkType: ["ruby"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 128,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_97451c08fce84aa7a3685f87f9b40438",
  },
  text: [
    {
      title: "DOUBLE TRANSPLANT",
      description:
        "During your turn, when this character is banished, each opponent loses 1 lore and you gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Toy"],
  abilities: [
    {
      id: "7me-1",
      name: "DOUBLE TRANSPLANT",
      text: "DOUBLE TRANSPLANT During your turn, when this character is banished, each opponent loses 1 lore and you gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "lose-lore",
            amount: 1,
            target: "EACH_OPPONENT",
          },
          {
            type: "gain-lore",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: pterodactylJanieDollSidsToyI18n,
};
