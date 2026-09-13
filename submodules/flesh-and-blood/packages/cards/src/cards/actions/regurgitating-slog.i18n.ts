import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { regurgitatingSlog } from "./regurgitating-slog.ts";

export const regurgitatingSlogI18n = defineFamilyI18n(regurgitatingSlog, {
  en: {
    name: "Regurgitating Slog",
    text: "As an additional cost to play Regurgitating Slog, you may banish a card named Sloggism from your graveyard. If you do, Regurgitating Slog gains dominate.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: regurgitatingSlogRedI18n,
  yellow: regurgitatingSlogYellowI18n,
  blue: regurgitatingSlogBlueI18n,
} = regurgitatingSlogI18n.cards;
