import type { CharacterCard } from "@tcg/lorcana-types";
import { olafSnowmanOfActionI18n } from "./122-olaf-snowman-of-action.i18n";

export const olafSnowmanOfAction: CharacterCard = {
  id: "G4S",
  canonicalId: "ci_G4S",
  reprints: ["set11-122"],
  cardType: "character",
  name: "Olaf",
  version: "Snowman of Action",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 122,
  rarity: "rare",
  cost: 9,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_22e26220f81745b394485c0cb6ef2c2d",
    tcgPlayer: 676213,
  },
  text: [
    {
      title: "ABOUT TIME!",
      description:
        "For each action card in your discard, you pay 1 {I} less to play this character.",
    },
    {
      title: "CHAOTIC COLLISION",
      description: "When you play this character, each opponent loses 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "g8u-1",
      name: "ABOUT TIME!",
      effect: {
        type: "cost-reduction",
        amount: {
          type: "filtered-count",
          filters: [{ type: "card-type", cardType: "action" }],
          owner: "you",
          zones: ["discard"],
        },
      },
      sourceZones: ["hand"],
      type: "static",
      text: "ABOUT TIME! For each action card in your discard, you pay 1 {I} less to play this character.",
    },
    {
      id: "g8u-2",
      effect: {
        amount: 2,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      name: "CHAOTIC COLLISION",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "CHAOTIC COLLISION When you play this character, each opponent loses 2 lore.",
    },
  ],
  i18n: olafSnowmanOfActionI18n,
};
