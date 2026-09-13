import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { convulsionsFromTheBellowsOfHell } from "./convulsions-from-the-bellows-of-hell.ts";

export const convulsionsFromTheBellowsOfHellI18n = defineFamilyI18n(
  convulsionsFromTheBellowsOfHell,
  {
    en: {
      name: "Convulsions from the Bellows of Hell",
      text: ({
        powerBonus,
      }) => `As an additional cost to play Convulsions from the Bellows of Hell, banish 3 random cards from your graveyard.
If a card with 6 or more {p} is banished this way, the next attack action card you play this turn gains +${powerBonus}{p} and dominate.
Go again`,
      typeText: "Shadow Brute Action",
    },
  },
);

export const {
  red: convulsionsFromTheBellowsOfHellRedI18n,
  yellow: convulsionsFromTheBellowsOfHellYellowI18n,
  blue: convulsionsFromTheBellowsOfHellBlueI18n,
} = convulsionsFromTheBellowsOfHellI18n.cards;
