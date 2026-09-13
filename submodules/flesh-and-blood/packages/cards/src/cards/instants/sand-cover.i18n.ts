import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sandCover } from "./sand-cover.ts";

export const sandCoverI18n = defineFamilyI18n(sandCover, {
  en: {
    name: "Sand Cover",
    typeText: "Draconic Illusionist Instant",
    text: ({ wardAmount }) => `Target ash you control gains ward ${wardAmount} until end of turn.`,
  },
});

export const {
  red: sandCoverRedI18n,
  yellow: sandCoverYellowI18n,
  blue: sandCoverBlueI18n,
} = sandCoverI18n.cards;
