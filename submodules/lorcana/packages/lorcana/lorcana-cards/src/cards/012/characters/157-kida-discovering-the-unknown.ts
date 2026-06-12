import type { CharacterCard } from "@tcg/lorcana-types";
import { kidaDiscoveringTheUnknownI18n } from "./157-kida-discovering-the-unknown.i18n";

export const kidaDiscoveringTheUnknown: CharacterCard = {
  id: "SiA",
  canonicalId: "ci_SiA",
  reprints: ["set12-157"],
  cardType: "character",
  name: "Kida",
  version: "Discovering the Unknown",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 157,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_37f859395b1f4878a5826f20394fe58e",
  },
  text: [
    {
      title: "READ THE RUNES",
      description:
        "Whenever this character quests, if 2 or more cards were put into your discard this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "SiA-1",
      name: "READ THE RUNES",
      type: "triggered",
      text: "READ THE RUNES Whenever this character quests, if 2 or more cards were put into your discard this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "turn-metric",
        metric: "discard-cards-entered",
        ownerScope: "you",
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
      },
    },
  ],
  i18n: kidaDiscoveringTheUnknownI18n,
};
