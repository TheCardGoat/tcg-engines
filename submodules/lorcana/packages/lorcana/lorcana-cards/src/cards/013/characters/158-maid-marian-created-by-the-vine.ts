import type { CharacterCard } from "@tcg/lorcana-types";
import { maidMarianCreatedByTheVineI18n } from "./158-maid-marian-created-by-the-vine.i18n";

export const maidMarianCreatedByTheVine: CharacterCard = {
  id: "0is",
  canonicalId: "ci_0is",
  slug: "lorcana-ci_0is",
  printings: [
    {
      id: "set13-158",
      artId: "set13-158",
      setCode: "set13",
      collectorNumber: "158",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-158"],
  cardType: "character",
  name: "Maid Marian",
  version: "Created by the Vine",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "013",
  cardNumber: 158,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_e98b0e36a62142ce9181966e14a1c930",
  },
  text: [
    {
      title: "INKFLOW",
      description:
        "Whenever one of your Floodborn characters is banished, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Floodborn", "Princess", "Vineling"],
  abilities: [
    {
      id: "0is-1",
      name: "INKFLOW",
      type: "triggered",
      text: "INKFLOW Whenever one of your Floodborn characters is banished, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: {
          controller: "you",
          cardType: "character",
          filters: [
            {
              type: "has-classification",
              classification: "Floodborn",
            },
          ],
        },
        timing: "whenever",
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
  i18n: maidMarianCreatedByTheVineI18n,
};
