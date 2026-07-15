import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanCreatedByTheVineI18n } from "./192-mulan-created-by-the-vine.i18n";

export const mulanCreatedByTheVine: CharacterCard = {
  id: "v6P",
  canonicalId: "ci_v6P",
  slug: "lorcana-ci_v6P",
  printings: [
    {
      id: "set13-192",
      artId: "set13-192",
      setCode: "set13",
      collectorNumber: "192",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-192"],
  cardType: "character",
  name: "Mulan",
  version: "Created by the Vine",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "013",
  cardNumber: 192,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b029096c38df417993f00fb29603c9ff",
  },
  text: [
    {
      title: "DEMOLISH",
      description:
        "Whenever you play this or another Floodborn character, you may banish chosen item.",
    },
  ],
  classifications: ["Floodborn", "Princess", "Vineling"],
  abilities: [
    {
      id: "v6P-1",
      name: "DEMOLISH",
      type: "triggered",
      text: "DEMOLISH Whenever you play this or another Floodborn character, you may banish chosen item.",
      trigger: {
        event: "play",
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
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
      },
    },
  ],
  i18n: mulanCreatedByTheVineI18n,
};
