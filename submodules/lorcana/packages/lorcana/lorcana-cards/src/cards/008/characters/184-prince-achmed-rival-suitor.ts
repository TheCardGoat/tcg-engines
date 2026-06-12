import type { CharacterCard } from "@tcg/lorcana-types";
import { princeAchmedRivalSuitorI18n } from "./184-prince-achmed-rival-suitor.i18n";

export const princeAchmedRivalSuitor: CharacterCard = {
  id: "cUt",
  canonicalId: "ci_cUt",
  reprints: ["set8-184"],
  cardType: "character",
  name: "Prince Achmed",
  version: "Rival Suitor",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 184,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7330464a904f4bc48287806c802ca7f1",
    tcgPlayer: 631684,
  },
  text: [
    {
      title: "UNWELCOME PROPOSAL",
      description: "When you play this character, you may exert chosen Princess character.",
    },
  ],
  classifications: ["Storyborn", "Prince"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [{ type: "has-classification", classification: "Princess" }],
          },
          type: "exert",
        },
        type: "optional",
      },
      id: "148-1",
      name: "UNWELCOME PROPOSAL",
      text: "UNWELCOME PROPOSAL When you play this character, you may exert chosen Princess character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: princeAchmedRivalSuitorI18n,
};
