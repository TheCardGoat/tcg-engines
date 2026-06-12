import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinIntellectualVisionaryI18n } from "./159-merlin-intellectual-visionary.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const merlinIntellectualVisionary: CharacterCard = {
  id: "ngW",
  canonicalId: "ci_ngW",
  reprints: ["set5-159"],
  cardType: "character",
  name: "Merlin",
  version: "Intellectual Visionary",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 159,
  rarity: "legendary",
  cost: 6,
  strength: 3,
  willpower: 7,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_0a8dca5feb454968a2d13e5917127c45",
    tcgPlayer: 555272,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "OVERDEVELOPED BRAIN",
      description:
        "When you play this character, if you used Shift to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.",
    },
  ],
  classifications: ["Floodborn", "Mentor", "Sorcerer"],
  abilities: [
    shift(5),
    {
      condition: {
        type: "used-shift",
      },
      effect: {
        type: "optional",
        effect: {
          source: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["deck"],
          },
          putInto: "hand",
          shuffle: true,
          type: "search-deck",
        },
      },
      id: "1g2-2",
      name: "OVERDEVELOPED BRAIN",
      text: "OVERDEVELOPED BRAIN When you play this character, if you used Shift to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: merlinIntellectualVisionaryI18n,
};
