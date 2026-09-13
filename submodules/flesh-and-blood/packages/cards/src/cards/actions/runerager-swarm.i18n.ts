import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { runeragerSwarm } from "./runerager-swarm.ts";

export const runeragerSwarmI18n = defineFamilyI18n(runeragerSwarm, {
  en: {
    name: "Runerager Swarm",
    text: "If you've played or created an aura this turn, this gets go again.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: runeragerSwarmRedI18n,
  yellow: runeragerSwarmYellowI18n,
  blue: runeragerSwarmBlueI18n,
} = runeragerSwarmI18n.cards;
