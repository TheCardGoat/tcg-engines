import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanCreatedByTheVineEpicI18n } from "./224-mulan-created-by-the-vine-epic.i18n";

export const mulanCreatedByTheVineEpic: CharacterCard = {
  id: "51H",
  canonicalId: "ci_v6P",
  slug: "lorcana-ci_v6P",
  printings: [
    {
      id: "set13-224-epic",
      artId: "ci_v6P-epic",
      setCode: "set13",
      collectorNumber: "224",
      rarity: "epic",
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
  cardNumber: 224,
  rarity: "common",
  specialRarity: "epic",
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
  i18n: mulanCreatedByTheVineEpicI18n,
};
