import type { CharacterCard } from "@tcg/lorcana-types";
import { hiroHamadaPioneeringInventorI18n } from "./150-hiro-hamada-pioneering-inventor.i18n";

export const hiroHamadaPioneeringInventor: CharacterCard = {
  id: "EvA",
  canonicalId: "ci_EvA",
  slug: "lorcana-ci_EvA",
  printings: [
    {
      id: "set14-150",
      artId: "set14-150",
      setCode: "set14",
      collectorNumber: "150",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-150"],
  cardType: "character",
  name: "Hiro Hamada",
  version: "Pioneering Inventor",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 150,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c3250b91153c47ebb081f8ea5a461da0",
  },
  text: [
    {
      title: "NIFTY TECH",
      description: "While you have an item in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero", "Inventor"],
  abilities: [
    {
      id: "hiro-1",
      name: "NIFTY TECH",
      type: "static",
      text: "NIFTY TECH While you have an item in play, this character gets +1 {L}.",
      condition: {
        type: "has-item-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 1,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    },
  ],
  i18n: hiroHamadaPioneeringInventorI18n,
};
