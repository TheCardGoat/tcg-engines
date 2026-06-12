import type { CharacterCard } from "@tcg/lorcana-types";
import { dashParrLavaRunnerI18n } from "./061-dash-parr-lava-runner.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const dashParrLavaRunner: CharacterCard = {
  id: "vhe",
  canonicalId: "ci_vhe",
  reprints: ["set12-061"],
  cardType: "character",
  name: "Dash Parr",
  version: "Lava Runner",
  inkType: ["amethyst"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 61,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_cdc217218de441d8b92b3ea9c8041cab",
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "RECORD TIME",
      description: "This character can quest the turn he's played.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    rush,
    {
      id: "vhe-2",
      name: "RECORD TIME",
      type: "static",
      text: "RECORD TIME This character can quest the turn he's played.",
      effect: {
        type: "restriction",
        restriction: "can-quest-turn-played",
        target: "SELF",
      },
    },
  ],
  i18n: dashParrLavaRunnerI18n,
};
