import type { CharacterCard } from "@tcg/lorcana-types";
import { vincenzoSantoriniOnTheRunI18n } from "./124-vincenzo-santorini-on-the-run.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const vincenzoSantoriniOnTheRun: CharacterCard = {
  id: "yND",
  canonicalId: "ci_yND",
  reprints: ["set12-124"],
  cardType: "character",
  name: "Vincenzo Santorini",
  version: "On the Run",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 124,
  rarity: "rare",
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_acfc5c2bdabb45ebbc852642fb30bab7",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "NEUTRALIZE",
      description: "Opposing items can't ready at the start of their players' turns.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    evasive,
    {
      id: "yND-2",
      name: "NEUTRALIZE",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
      text: "NEUTRALIZE Opposing items can't ready at the start of their players' turns.",
    },
  ],
  i18n: vincenzoSantoriniOnTheRunI18n,
};
