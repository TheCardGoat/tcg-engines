import type { CharacterCard } from "@tcg/lorcana-types";
import { fredGiantsizedI18n } from "./098-fred-giant-sized.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const fredGiantsized: CharacterCard = {
  id: "Hxd",
  canonicalId: "ci_Hxd",
  reprints: ["set8-098"],
  cardType: "character",
  name: "Fred",
  version: "Giant-Sized",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "008",
  cardNumber: 98,
  rarity: "rare",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_c4073b6ba72a428e9e213027b112d48f",
    tcgPlayer: 632710,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "I LIKE WHERE THIS IS HEADING",
      description:
        "Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(5),
    {
      effect: {
        type: "reveal-until-match",
        target: "CONTROLLER",
        cardType: "character",
        classification: "Floodborn",
        putInto: "hand",
        shuffle: true,
      },
      id: "1d3-2",
      name: "I LIKE WHERE THIS IS HEADING",
      text: "I LIKE WHERE THIS IS HEADING Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: fredGiantsizedI18n,
};
