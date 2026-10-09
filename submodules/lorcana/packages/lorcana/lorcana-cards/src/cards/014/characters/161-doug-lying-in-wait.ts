import type { CharacterCard } from "@tcg/lorcana-types";
import { dougLyingInWaitI18n } from "./161-doug-lying-in-wait.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const dougLyingInWait: CharacterCard = {
  id: "gXx",
  canonicalId: "ci_gXx",
  slug: "lorcana-ci_gXx",
  printings: [
    {
      id: "set14-161",
      artId: "set14-161",
      setCode: "set14",
      collectorNumber: "161",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-161"],
  cardType: "character",
  name: "Doug",
  version: "Lying in Wait",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 161,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_aa87b77fe87746c591ca72bd326b4a63",
  },
  text: "Ward",
  classifications: ["Storyborn", "Ally"],
  abilities: [ward],
  i18n: dougLyingInWaitI18n,
};
