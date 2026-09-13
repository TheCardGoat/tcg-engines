import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ingestTheUnknown } from "./ingest-the-unknown.ts";

export const ingestTheUnknownI18n = defineFamilyI18n(ingestTheUnknown, {
  en: {
    name: "Ingest the Unknown",
    typeText: "Shadow Brute Action - Attack",
    text: "When this attacks, banish the top card of your deck. This gets +X{p}, where X is the banished card's base {p}.\nBlood Debt",
  },
});

export const { yellow: ingestTheUnknownYellowI18n } = ingestTheUnknownI18n.cards;
