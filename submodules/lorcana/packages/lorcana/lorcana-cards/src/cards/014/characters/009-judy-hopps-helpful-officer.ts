import type { CharacterCard } from "@tcg/lorcana-types";
import { judyHoppsHelpfulOfficerI18n } from "./009-judy-hopps-helpful-officer.i18n";

export const judyHoppsHelpfulOfficer: CharacterCard = {
  id: "SRT",
  canonicalId: "ci_SRT",
  slug: "lorcana-ci_SRT",
  printings: [
    {
      id: "set14-009",
      artId: "set14-009",
      setCode: "set14",
      collectorNumber: "9",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-009"],
  cardType: "character",
  name: "Judy Hopps",
  version: "Helpful Officer",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 9,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a20ade77fd92426eacb8dbf72861a997",
  },
  text: [
    {
      title: "TO THE RESCUE",
      description: "When you play this character, remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Detective"],
  abilities: [
    {
      id: "SRT-1",
      name: "TO THE RESCUE",
      type: "triggered",
      text: "TO THE RESCUE When you play this character, remove up to 2 damage from chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "remove-damage",
        amount: { type: "up-to", value: 2 },
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: judyHoppsHelpfulOfficerI18n,
};
