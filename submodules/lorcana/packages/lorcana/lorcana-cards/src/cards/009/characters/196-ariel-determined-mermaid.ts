import type { CharacterCard } from "@tcg/lorcana-types";
import { arielDeterminedMermaidI18n } from "./196-ariel-determined-mermaid.i18n";

export const arielDeterminedMermaid: CharacterCard = {
  id: "xm0",
  canonicalId: "ci_uu8",
  slug: "lorcana-ci_uu8",
  printings: [
    {
      id: "set9-196",
      artId: "set9-196",
      setCode: "set9",
      collectorNumber: "196",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set4-174", "set9-196"],
  cardType: "character",
  name: "Ariel",
  version: "Determined Mermaid",
  inkType: ["steel"],
  franchise: "Little Mermaid",
  set: "009",
  cardNumber: 196,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8e9017b673fa48039cb919188a8dae7a",
    tcgPlayer: "650129",
  },
  text: [
    {
      title: "I WANT MORE",
      description: "Whenever you play a song, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "gsz-1",
      name: "I WANT MORE",
      text: "I WANT MORE Whenever you play a song, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: arielDeterminedMermaidI18n,
};
