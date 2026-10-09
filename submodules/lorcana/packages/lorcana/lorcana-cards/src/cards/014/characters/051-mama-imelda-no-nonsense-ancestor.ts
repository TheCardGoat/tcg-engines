import type { CharacterCard } from "@tcg/lorcana-types";
import { mamImeldaNononsenseAncestorI18n } from "./051-mama-imelda-no-nonsense-ancestor.i18n";

export const mamImeldaNononsenseAncestor: CharacterCard = {
  id: "S0B",
  canonicalId: "ci_S0B",
  slug: "lorcana-ci_S0B",
  printings: [
    {
      id: "set14-051",
      artId: "set14-051",
      setCode: "set14",
      collectorNumber: "51",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-051"],
  cardType: "character",
  name: "Mamá Imelda",
  version: "No-Nonsense Ancestor",
  inkType: ["amethyst"],
  franchise: "Coco",
  set: "014",
  cardNumber: 51,
  rarity: "rare",
  cost: 4,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Let Me Through",
      description:
        "When you play this character, put 3 cards from your discard on the bottom of your deck in any order or banish her.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    {
      id: "S0B-1",
      name: "Let Me Through",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "or",
        optionLabels: [
          "put 3 cards from your discard on the bottom of your deck in any order",
          "banish her",
        ],
        options: [
          {
            type: "put-on-bottom",
            ordering: "player-choice",
            target: {
              cardTypes: ["card"],
              count: 3,
              owner: "you",
              selector: "chosen",
              zones: ["discard"],
            },
          },
          {
            type: "banish",
            target: "SELF",
          },
        ],
      },
      text: "Let Me Through When you play this character, put 3 cards from your discard on the bottom of your deck in any order or banish her.",
    },
  ],
  i18n: mamImeldaNononsenseAncestorI18n,
};
