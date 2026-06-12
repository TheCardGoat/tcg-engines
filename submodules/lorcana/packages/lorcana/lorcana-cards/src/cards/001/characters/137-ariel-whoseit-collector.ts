import type { CharacterCard } from "@tcg/lorcana-types";
import { arielWhoseitCollectorI18n } from "./137-ariel-whoseit-collector.i18n";

export const arielWhoseitCollector: CharacterCard = {
  id: "5XS",
  canonicalId: "ci_5XS",
  reprints: ["set1-137"],
  cardType: "character",
  name: "Ariel",
  version: "Whoseit Collector",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 137,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a23c99ed9f3243969466fb000bd139dc",
    tcgPlayer: 502532,
  },
  text: [
    {
      title: "LOOK AT THIS STUFF",
      description: "Whenever you play an item, you may ready this character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "SELF",
          type: "ready",
        },
        type: "optional",
      },
      id: "c6b-1",
      name: "LOOK AT THIS STUFF",
      text: "LOOK AT THIS STUFF Whenever you play an item, you may ready this character.",
      trigger: {
        event: "play",
        on: "YOUR_ITEMS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: arielWhoseitCollectorI18n,
};
