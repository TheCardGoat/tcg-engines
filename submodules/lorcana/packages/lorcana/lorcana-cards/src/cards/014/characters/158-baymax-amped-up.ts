import type { CharacterCard } from "@tcg/lorcana-types";
import { baymaxAmpedUpI18n } from "./158-baymax-amped-up.i18n";

export const baymaxAmpedUp: CharacterCard = {
  id: "07k",
  canonicalId: "ci_07k",
  slug: "lorcana-ci_07k",
  printings: [
    {
      id: "set14-158",
      artId: "set14-158",
      setCode: "set14",
      collectorNumber: "158",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set14-158"],
  cardType: "character",
  name: "Baymax",
  version: "Amped Up",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 158,
  rarity: "legendary",
  cost: 7,
  strength: 5,
  willpower: 8,
  lore: 2,
  inkable: true,
  text: [
    {
      title:
        "Shift Remove 2 ink drops (You may remove 2 ink drops to play this on top of one of your characters named Baymax.)",
    },
    {
      title: "Supercharge",
      description:
        "If you would get an ink drop, you may put the top card of your deck into your inkwell facedown and exerted instead.",
    },
  ],
  classifications: ["Dreamborn", "Super", "Hero", "Robot"],
  abilities: [
    {
      id: "BAY-1",
      name: "Shift Remove 2 ink drops",
      type: "keyword",
      keyword: "Shift",
      text: "Shift Remove 2 ink drops (You may remove 2 ink drops to play this on top of one of your characters named Baymax.)",
      shiftTarget: "Baymax",
      cost: { inkDrops: 2 },
    },
    {
      id: "baymax-1",
      name: "Supercharge",
      type: "static",
      text: "Supercharge If you would get an ink drop, you may put the top card of your deck into your inkwell facedown and exerted instead.",
      effect: {
        type: "restriction",
        restriction: "would-gain-ink-drop-replacement",
        target: "SELF",
      },
    },
  ],
  i18n: baymaxAmpedUpI18n,
};
