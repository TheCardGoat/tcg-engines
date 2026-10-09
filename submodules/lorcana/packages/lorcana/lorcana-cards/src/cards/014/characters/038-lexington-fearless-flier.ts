import type { CharacterCard } from "@tcg/lorcana-types";
import { lexingtonFearlessFlierI18n } from "./038-lexington-fearless-flier.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const lexingtonFearlessFlier: CharacterCard = {
  id: "wsg",
  canonicalId: "ci_wsg",
  slug: "lorcana-ci_wsg",
  printings: [
    {
      id: "set14-038",
      artId: "set14-038",
      setCode: "set14",
      collectorNumber: "38",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-038"],
  cardType: "character",
  name: "Lexington",
  version: "Fearless Flier",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "014",
  cardNumber: 38,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_3d910edfd75c482f89e14aa58fef1f45",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
  abilities: [evasive, stoneByDay],
  i18n: lexingtonFearlessFlierI18n,
};
