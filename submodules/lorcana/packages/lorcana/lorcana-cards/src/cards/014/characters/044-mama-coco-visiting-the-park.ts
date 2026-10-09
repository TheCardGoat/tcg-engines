import type { CharacterCard } from "@tcg/lorcana-types";
import { mamCocoVisitingTheParkI18n } from "./044-mama-coco-visiting-the-park.i18n";

export const mamCocoVisitingThePark: CharacterCard = {
  id: "Nxf",
  canonicalId: "ci_Nxf",
  slug: "lorcana-ci_Nxf",
  printings: [
    {
      id: "set14-044",
      artId: "set14-044",
      setCode: "set14",
      collectorNumber: "44",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-044"],
  cardType: "character",
  name: "Mamá Coco",
  version: "Visiting the Park",
  inkType: ["amethyst"],
  franchise: "Coco",
  set: "014",
  cardNumber: 44,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1db0bfec5cb74d138a10bfd514fa0d57",
  },
  text: [
    {
      title: "DISTANT MEMORY",
      description:
        "Whenever you put 1 or more cards into your discard from your deck, this character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "mama-coco-1",
      name: "DISTANT MEMORY",
      type: "triggered",
      text: "DISTANT MEMORY Whenever you put 1 or more cards into your discard from your deck, this character gets +1 {L} this turn.",
      trigger: {
        event: "discard",
        on: { controller: "you" },
        timing: "whenever",
        restrictions: [
          {
            type: "from-deck",
          },
        ],
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        duration: "this-turn",
        target: "SELF",
      },
    },
  ],
  i18n: mamCocoVisitingTheParkI18n,
};
