import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseDrumMajorI18n } from "./015-minnie-mouse-drum-major.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const minnieMouseDrumMajor: CharacterCard = {
  id: "p71",
  canonicalId: "ci_p71",
  reprints: ["set5-015"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Drum Major",
  inkType: ["amber"],
  set: "005",
  cardNumber: 15,
  rarity: "super_rare",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9b72fe4e823b447fbdd927b3dae1342a",
    tcgPlayer: 561600,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "PARADE ORDER",
      description:
        "When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(4),
    {
      condition: {
        type: "used-shift",
      },
      effect: {
        type: "optional",
        effect: {
          cardType: "character",
          putInto: "top-of-deck",
          reveal: true,
          shuffle: true,
          type: "search-deck",
        },
      },
      id: "o0p-2",
      name: "PARADE ORDER",
      text: "PARADE ORDER When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: minnieMouseDrumMajorI18n,
};
