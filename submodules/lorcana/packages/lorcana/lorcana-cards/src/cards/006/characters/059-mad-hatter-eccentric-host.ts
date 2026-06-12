import type { CharacterCard } from "@tcg/lorcana-types";
import { madHatterEccentricHostI18n } from "./059-mad-hatter-eccentric-host.i18n";

export const madHatterEccentricHost: CharacterCard = {
  id: "u3f",
  canonicalId: "ci_u3f",
  reprints: ["set6-059"],
  cardType: "character",
  name: "Mad Hatter",
  version: "Eccentric Host",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  cardNumber: 59,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_374115dba006482aa076efca3e52635a",
    tcgPlayer: 593022,
  },
  text: [
    {
      title: "WE'LL HAVE TO LOOK INTO THIS",
      description:
        "Whenever this character quests, you may look at the top card of chosen player's deck. Put it on top of their deck or into their discard.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 1,
          target: "CHOSEN_PLAYER",
          destinations: [
            {
              zone: "deck-top",
              min: 0,
              max: 1,
            },
            {
              zone: "discard",
              remainder: true,
            },
          ],
        },
        type: "optional",
      },
      id: "u3f-1",
      name: "WE'LL HAVE TO LOOK INTO THIS",
      text: "WE'LL HAVE TO LOOK INTO THIS Whenever this character quests, you may look at the top card of chosen player's deck. Put it on top of their deck or into their discard.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: madHatterEccentricHostI18n,
};
