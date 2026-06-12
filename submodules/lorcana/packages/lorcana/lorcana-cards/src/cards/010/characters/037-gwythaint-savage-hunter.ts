import type { CharacterCard } from "@tcg/lorcana-types";
import { evasive } from "../../../helpers/abilities/evasive";
import { gwythaintSavageHunterI18n } from "./037-gwythaint-savage-hunter.i18n";

export const gwythaintSavageHunter: CharacterCard = {
  id: "t21",
  canonicalId: "ci_t21",
  reprints: ["set10-037"],
  cardType: "character",
  name: "Gwythaint",
  version: "Savage Hunter",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 37,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_69ea9fcabac1418eae3f2dc3a51254bf",
    tcgPlayer: 658292,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "SWOOPING STRIKE",
      description:
        "Whenever this character quests, each opponent chooses and exerts one of their ready characters.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Dragon"],
  abilities: [
    evasive,
    {
      id: "t21-2",
      name: "SWOOPING STRIKE",
      text: "SWOOPING STRIKE Whenever this character quests, each opponent chooses and exerts one of their ready characters.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "exert",
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          cardTypes: ["character"],
          zones: ["play"],
          filter: [
            {
              type: "status",
              status: "ready",
            },
          ],
        },
      },
    },
  ],
  i18n: gwythaintSavageHunterI18n,
};
