import type { CharacterCard } from "@tcg/lorcana-types";
import { megaraLiberatedOneI18n } from "./080-megara-liberated-one.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const megaraLiberatedOne: CharacterCard = {
  id: "q5j",
  canonicalId: "ci_q5j",
  reprints: ["set4-080"],
  cardType: "character",
  name: "Megara",
  version: "Liberated One",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 80,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6cb1a1b4a1e447b19a2a22c63e15dec9",
    tcgPlayer: 549622,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "PEOPLE ALWAYS DO CRAZY THINGS",
      description: "Whenever you play a character named Hercules, you may ready this character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    ward,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "ready",
        },
        type: "optional",
      },
      id: "1qr-2",
      name: "PEOPLE ALWAYS DO CRAZY THINGS",
      text: "PEOPLE ALWAYS DO CRAZY THINGS Whenever you play a character named Hercules, you may ready this character.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
          name: "Hercules",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: megaraLiberatedOneI18n,
};
