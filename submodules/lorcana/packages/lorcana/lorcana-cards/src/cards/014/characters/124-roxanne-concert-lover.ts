import type { CharacterCard } from "@tcg/lorcana-types";
import { roxanneConcertLoverI18n } from "./124-roxanne-concert-lover.i18n";

export const roxanneConcertLover: CharacterCard = {
  id: "H1h",
  canonicalId: "ci_H1h",
  slug: "lorcana-ci_H1h",
  printings: [
    {
      id: "set14-124",
      artId: "set14-124",
      setCode: "set14",
      collectorNumber: "124",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-124"],
  cardType: "character",
  name: "Roxanne",
  version: "Concert Lover",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 124,
  rarity: "rare",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_988048279b02486fafbe4902e68ece1b",
  },
  text: [
    {
      title: "TODAY'S THE DAY",
      description:
        "When you play this character, you may move her and one of your other characters to the same location for free. If you do, the other character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "H1h-1",
      name: "TODAY'S THE DAY",
      type: "triggered",
      text: "TODAY'S THE DAY When you play this character, you may move her and one of your other characters to the same location for free. If you do, the other character gets +1 {L} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-to-location",
              character: "ANOTHER_CHOSEN_CHARACTER_OF_YOURS",
              location: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["location"],
              },
              cost: "free",
            },
            {
              type: "move-to-location",
              character: "SELF",
              location: {
                ref: "previous-target",
              },
              cost: "free",
            },
            {
              type: "modify-stat",
              stat: "lore",
              modifier: 1,
              duration: "this-turn",
              target: {
                reference: "selected-first",
              },
            },
          ],
        },
      },
    },
  ],
  i18n: roxanneConcertLoverI18n,
};
