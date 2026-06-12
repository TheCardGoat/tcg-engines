import type { CharacterCard } from "@tcg/lorcana-types";
import { joshuaSweetFieldSurgeonI18n } from "./088-joshua-sweet-field-surgeon.i18n";

export const joshuaSweetFieldSurgeon: CharacterCard = {
  id: "zGi",
  canonicalId: "ci_zGi",
  reprints: ["set12-088"],
  cardType: "character",
  name: "Joshua Sweet",
  version: "Field Surgeon",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 88,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fd42305369ea44619d7dc7af6eb418a9",
  },
  text: [
    {
      title: "NO PATIENCE",
      description:
        "Whenever this character is challenged, chosen opponent chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        from: "hand",
        target: "OPPONENT",
        type: "discard",
      },
      id: "zgi-1",
      name: "NO PATIENCE",
      text: "NO PATIENCE Whenever this character is challenged, chosen opponent chooses and discards a card.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: joshuaSweetFieldSurgeonI18n,
};
