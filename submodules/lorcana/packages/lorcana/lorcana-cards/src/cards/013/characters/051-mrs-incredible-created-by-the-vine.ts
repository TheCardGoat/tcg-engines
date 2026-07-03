import type { CharacterCard } from "@tcg/lorcana-types";
import { mrsIncredibleCreatedByTheVineI18n } from "./051-mrs-incredible-created-by-the-vine.i18n";

export const mrsIncredibleCreatedByTheVine: CharacterCard = {
  id: "qAV",
  canonicalId: "ci_qAV",
  slug: "lorcana-ci_qAV",
  printings: [
    {
      id: "set13-051",
      artId: "set13-051",
      setCode: "set13",
      collectorNumber: "51",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-051"],
  cardType: "character",
  name: "Mrs. Incredible",
  version: "Created by the Vine",
  inkType: ["amethyst"],
  franchise: "Incredibles",
  set: "013",
  cardNumber: 51,
  rarity: "rare",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_da620721c46c4391ba18edcc056bb599",
  },
  text: [
    {
      title: "TORRENT",
      description:
        "Whenever one of your Floodborn characters quests, you pay 1{I} less for the next character you shift this turn.",
    },
  ],
  classifications: ["Floodborn", "Super", "Vineling"],
  abilities: [
    {
      id: "qAV-1",
      name: "TORRENT",
      type: "triggered",
      text: "TORRENT Whenever one of your Floodborn characters quests, you pay 1 {I} less for the next character you shift this turn.",
      trigger: {
        event: "quest",
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
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
        playMethod: "shift",
        duration: "next-play-this-turn",
      },
    },
  ],
  i18n: mrsIncredibleCreatedByTheVineI18n,
};
