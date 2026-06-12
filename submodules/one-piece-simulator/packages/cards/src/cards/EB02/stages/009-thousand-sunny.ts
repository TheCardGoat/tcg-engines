import type { StageCard } from "@tcg/op-types";
import { eb02ThousandSunny009I18n } from "./009-thousand-sunny.i18n.ts";

export const eb02ThousandSunny009: StageCard = {
  id: "EB02-009",
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "EB02",
  cost: 2,
  traits: ["Straw Hat Crew"],
  effect:
    '[Activate: Main] You may rest this Stage: Give up to 1 of your currently given DON!! cards to 1 of your "Straw Hat Crew" type Characters.',
  i18n: eb02ThousandSunny009I18n,
};
