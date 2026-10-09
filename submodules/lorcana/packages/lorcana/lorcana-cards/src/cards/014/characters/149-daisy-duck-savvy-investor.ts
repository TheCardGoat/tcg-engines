import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckSavvyInvestorI18n } from "./149-daisy-duck-savvy-investor.i18n";

export const daisyDuckSavvyInvestor: CharacterCard = {
  id: "kE4",
  canonicalId: "ci_kE4",
  slug: "lorcana-ci_kE4",
  printings: [
    {
      id: "set14-149",
      artId: "set14-149",
      setCode: "set14",
      collectorNumber: "149",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-149"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Savvy Investor",
  inkType: ["sapphire"],
  set: "014",
  cardNumber: 149,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  text: [
    {
      title: "Save for the Future",
      description:
        "When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "daisy-1",
      name: "Save for the Future",
      type: "triggered",
      text: "Save for the Future When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
          chosenBy: "you",
        },
      },
    },
  ],
  i18n: daisyDuckSavvyInvestorI18n,
};
