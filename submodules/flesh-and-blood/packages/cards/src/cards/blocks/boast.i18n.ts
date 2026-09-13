import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { boast } from "./boast.ts";

export const boastI18n = defineFamilyI18n(boast, {
  en: {
    name: "Boast",
    text: "This gets +X{d} while defending, where X is twice the number of clashes you've won this turn.",
    typeText: "Guardian Block",
  },
});

export const { blue: boastBlueI18n } = boastI18n.cards;
