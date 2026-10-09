import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimNosyNeighborI18n } from "./146-madam-mim-nosy-neighbor.i18n";

export const madamMimNosyNeighbor: CharacterCard = {
  id: "vTV",
  canonicalId: "ci_vTV",
  slug: "lorcana-ci_vTV",
  printings: [
    {
      id: "set14-146",
      artId: "set14-146",
      setCode: "set14",
      collectorNumber: "146",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-146"],
  cardType: "character",
  name: "Madam Mim",
  version: "Nosy Neighbor",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 146,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ef21e2b7ae6349d4afa590b90a7041c6",
  },
  text: [
    {
      title: "NO HIDING",
      description: "When you play this character, look at chosen opponent's hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "mim-nosy-1",
      name: "NO HIDING",
      type: "triggered",
      text: "NO HIDING When you play this character, look at chosen opponent's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "reveal-hand",
        target: "OPPONENT",
        visibility: "controller",
      },
    },
  ],
  i18n: madamMimNosyNeighborI18n,
};
