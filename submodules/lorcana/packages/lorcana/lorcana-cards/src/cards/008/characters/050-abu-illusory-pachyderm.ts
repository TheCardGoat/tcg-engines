import type { CharacterCard } from "@tcg/lorcana-types";
import { abuIllusoryPachydermI18n } from "./050-abu-illusory-pachyderm.i18n";
import { vanish } from "../../../helpers/abilities/vanish";

export const abuIllusoryPachyderm: CharacterCard = {
  id: "Ath",
  canonicalId: "ci_Ath",
  reprints: ["set8-050"],
  cardType: "character",
  name: "Abu",
  version: "Illusory Pachyderm",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 50,
  rarity: "uncommon",
  cost: 6,
  strength: 3,
  willpower: 7,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_befc74dca10e458ba4a71a1f4ac05e7e",
    tcgPlayer: 631384,
  },
  text: [
    {
      title: "Vanish",
      description: "(When an opponent chooses this character for an action, banish them.)",
    },
    {
      title: "GRASPING TRUNK",
      description:
        "Whenever this character quests, gain lore equal to the {L} of chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
  abilities: [
    vanish,
    {
      id: "Ath-2",
      name: "GRASPING TRUNK",
      text: "GRASPING TRUNK Whenever this character quests, gain lore equal to the {L} of chosen opposing character.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: {
          type: "lore-value-of",
          target: "CHOSEN_OPPOSING_CHARACTER",
        },
        target: "CONTROLLER",
      },
    },
  ],
  i18n: abuIllusoryPachydermI18n,
};
