import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flitteringSpike } from "./flittering-spike.ts";

export const flitteringSpikeI18n = defineFamilyI18n(flitteringSpike, {
  en: {
    name: "Flittering Spike",
    typeText: "Lightning Action - Attack",
    text: "If you've played an instant card this chain link, this gets +2{p}.\nWhen this hits, create a Lightning Flow token.",
  },
});

export const {
  red: flitteringSpikeRedI18n,
  yellow: flitteringSpikeYellowI18n,
  blue: flitteringSpikeBlueI18n,
} = flitteringSpikeI18n.cards;
