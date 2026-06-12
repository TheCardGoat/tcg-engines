import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineQueenOfAgrabahI18n } from "./149-jasmine-queen-of-agrabah.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const jasmineQueenOfAgrabah: CharacterCard = {
  id: "Abg",
  canonicalId: "ci_Abg",
  reprints: ["set1-149"],
  cardType: "character",
  name: "Jasmine",
  version: "Queen of Agrabah",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 149,
  rarity: "rare",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6b26bc2dda6e49bba695529a039dcaee",
    tcgPlayer: 508857,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "CARETAKER",
      description:
        "When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess", "Queen"],
  abilities: [
    shift(3),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 2 },
          target: "YOUR_CHARACTERS",
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "8w9-2",
      name: "CARETAKER",
      text: "CARETAKER When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 2 },
          target: "YOUR_CHARACTERS",
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "8w9-3",
      name: "CARETAKER",
      text: "CARETAKER When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: jasmineQueenOfAgrabahI18n,
};
