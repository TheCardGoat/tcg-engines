import type { StageCard } from "@tcg/op-types";
import { op13OroJackson078I18n } from "./078-oro-jackson.i18n.ts";

export const op13OroJackson078: StageCard = {
  id: "OP13-078",
  cardType: "stage",
  color: ["purple"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  traits: ["Roger Pirates"],
  effect:
    '[Once Per Turn] When your Character with a type including "Roger Pirates" is removed from the field by your opponent\'s effect, add up to 1 DON!! card from your DON!! deck and rest it.',
  i18n: op13OroJackson078I18n,
};
