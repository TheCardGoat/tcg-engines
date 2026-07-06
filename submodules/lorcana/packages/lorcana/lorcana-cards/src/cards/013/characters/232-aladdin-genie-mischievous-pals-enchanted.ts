import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinGenieMischievousPalsEnchantedI18n } from "./232-aladdin-genie-mischievous-pals-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const aladdinGenieMischievousPalsEnchanted: CharacterCard = {
  id: "bLm",
  canonicalId: "ci_qev",
  slug: "lorcana-ci_qev",
  printings: [
    {
      id: "set13-232-enchanted",
      artId: "ci_qev-enchanted",
      setCode: "set13",
      collectorNumber: "232",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set13-059"],
  cardType: "character",
  name: "Aladdin & Genie",
  version: "Mischievous Pals",
  inkType: ["amethyst", "emerald"],
  franchise: "Aladdin",
  set: "013",
  cardNumber: 232,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b0820bdd94db41b597a5bafeb75e9e96",
  },
  text: [
    {
      title: "Shift 3",
      description:
        "(You may pay 3 to play this on top of one of your characters named Aladdin or Genie.)",
    },
    {
      title: "SLEIGHT OF HAND",
      description:
        "When you play this character, you may put any number of cards from your hand on the bottom of your deck in any order. If you do, draw that number of cards plus 1.",
    },
  ],
  classifications: ["Storyborn", "Team", "Hero"],
  abilities: [
    shift("Aladdin or Genie", 3),
    {
      type: "triggered",
      name: "SLEIGHT OF HAND",
      text: "SLEIGHT OF HAND When you play this character, you may put any number of cards from your hand on the bottom of your deck in any order. If you do, draw that number of cards plus 1.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "put-on-bottom",
              ordering: "player-choice",
              target: {
                selector: "chosen",
                count: {
                  upTo: 99,
                },
                owner: "you",
                zones: ["hand"],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "draw",
                target: "CONTROLLER",
                amount: {
                  type: "difference",
                  left: {
                    type: "last-effect-target-count",
                  },
                  right: -1,
                },
              },
            },
          ],
        },
      },
    },
  ],
  i18n: aladdinGenieMischievousPalsEnchantedI18n,
};
