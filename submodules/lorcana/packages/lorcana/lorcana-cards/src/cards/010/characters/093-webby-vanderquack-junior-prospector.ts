import type { CharacterCard } from "@tcg/lorcana-types";
import { webbyVanderquackJuniorProspectorI18n } from "./093-webby-vanderquack-junior-prospector.i18n";

import { shift } from "../../../helpers/abilities/shift";
import { ward } from "../../../helpers/abilities/ward";

export const webbyVanderquackJuniorProspector: CharacterCard = {
  id: "JR6",
  canonicalId: "ci_N9X",
  slug: "lorcana-ci_N9X",
  printings: [
    {
      id: "set10-093",
      artId: "set10-093",
      setCode: "set10",
      collectorNumber: "93",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set10-093"],
  cardType: "character",
  name: "Webby Vanderquack",
  version: "Junior Prospector",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 93,
  rarity: "legendary",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c607f55525894e1bbdb8121eed6bf886",
    tcgPlayer: "660173",
  },
  text: [
    {
      title: "Shift 2 {I}",
    },
    {
      title: "Ward",
    },
    {
      title: "WORK SMARTER",
      description:
        "Whenever this character quests, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    shift(2),
    ward,
    {
      condition: {
        type: "comparison",
        left: {
          type: "cards-in-inkwell",
          controller: "opponent",
        },
        comparison: "greater",
        right: {
          type: "cards-in-inkwell",
          controller: "you",
        },
      },
      effect: {
        type: "optional",
        effect: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
      },
      id: "y1i-3",
      name: "WORK SMARTER",
      text: "WORK SMARTER Whenever this character quests, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: webbyVanderquackJuniorProspectorI18n,
};
