import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { torrentOfTempo } from "./torrent-of-tempo.ts";

export const torrentOfTempoI18n = defineFamilyI18n(torrentOfTempo, {
  en: {
    name: "Torrent of Tempo",
    text: "When this hits, it gets go again.",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: torrentOfTempoRedI18n,
  yellow: torrentOfTempoYellowI18n,
  blue: torrentOfTempoBlueI18n,
} = torrentOfTempoI18n.cards;
