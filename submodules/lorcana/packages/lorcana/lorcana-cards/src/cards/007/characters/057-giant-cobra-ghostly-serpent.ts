import type { CharacterCard } from "@tcg/lorcana-types";
import { giantCobraGhostlySerpentI18n } from "./057-giant-cobra-ghostly-serpent.i18n";
import { vanish } from "../../../helpers/abilities/vanish";

export const giantCobraGhostlySerpent: CharacterCard = {
  id: "FdJ",
  canonicalId: "ci_FdJ",
  reprints: ["set7-057"],
  cardType: "character",
  name: "Giant Cobra",
  version: "Ghostly Serpent",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "007",
  cardNumber: 57,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e83395def01e4f76b670fd014c79d440",
    tcgPlayer: 618174,
  },
  text: [
    {
      title: "Vanish",
      description: "(When an opponent chooses this character for an action, banish them.)",
    },
    {
      title: "MYSTERIOUS ADVANTAGE",
      description:
        "When you play this character, you may choose and discard a card to gain 2 lore.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
  abilities: [
    vanish,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
            {
              type: "conditional",
              condition: { type: "if-you-do" },
              then: {
                amount: 2,
                target: "CONTROLLER",
                type: "gain-lore",
              },
            },
          ],
        },
        type: "optional",
      },
      id: "1bh-2",
      name: "MYSTERIOUS ADVANTAGE",
      text: "MYSTERIOUS ADVANTAGE When you play this character, you may choose and discard a card to gain 2 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: giantCobraGhostlySerpentI18n,
};
