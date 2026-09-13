import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { planarChaos } from "./planar-chaos.ts";
const textByColor = {
  red: "Create a Gate to i'Arathael token.\nThe next Gate to i'Arathael token you activate this turn can target an action card with blood debt in any banished zone.\nGo again",
} as const;
export const planarChaosI18n = defineFamilyI18n(planarChaos, {
  en: {
    name: "Planar Chaos",
    typeText: "Shadow Action",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { red: planarChaosRedI18n } = planarChaosI18n.cards;
