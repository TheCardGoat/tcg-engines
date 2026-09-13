import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { spikePitTrap } from "./spike-pit-trap.ts";

export const spikePitTrapI18n = defineFamilyI18n(spikePitTrap, {
  en: {
    name: "Spike Pit Trap",
    text: "Legendary Riptide Specialization\nWhen this defends and the attacking hero has played or activated a reaction this chain link, put the top card of their deck into their graveyard, then they lose X{h}, where X is the number of cards in their graveyard with that name.",
    typeText: "Ranger Defense Reaction - Trap",
  },
});

export const { blue: spikePitTrapBlueI18n } = spikePitTrapI18n.cards;
