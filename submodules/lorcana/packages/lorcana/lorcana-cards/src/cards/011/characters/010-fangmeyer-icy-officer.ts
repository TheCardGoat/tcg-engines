import type { CharacterCard } from "@tcg/lorcana-types";
import { fangmeyerIcyOfficerI18n } from "./010-fangmeyer-icy-officer.i18n";

export const fangmeyerIcyOfficer: CharacterCard = {
  id: "pOQ",
  canonicalId: "ci_pOQ",
  reprints: ["set11-010"],
  cardType: "character",
  name: "Fangmeyer",
  version: "Icy Officer",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "011",
  cardNumber: 10,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_f3392db6475445bbb5ad6f608dc86c4b",
    tcgPlayer: 674827,
  },
  text: [
    {
      title: "REQUEST REINFORCEMENTS",
      description:
        "When you play this character, you may return a Detective character card from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Detective"],
  abilities: [
    {
      id: "119-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "character",
          filter: {
            classification: "Detective",
          },
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      name: "REQUEST REINFORCEMENTS",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "REQUEST REINFORCEMENTS When you play this character, you may return a Detective character card from your discard to your hand.",
    },
  ],
  i18n: fangmeyerIcyOfficerI18n,
};
