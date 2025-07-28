import type { LorcanaEffect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { Classification, LorcanaAbilityCost } from "../ability-types";
import type {
  LorcanaBaseKeywordAbility,
  LorcanaKeywordAbility,
} from "./keyword";

// 10.8. Shift
// 10.8.1. The Shift keyword represents paying an alternate cost to play a character instead of paying the character's ink cost. Shift means "If you have a character in play with the same name as this card, you may play this character by paying their Shift cost instead of their ink cost. If you do, put this card on top of another character you have in play with the same name." This is called shifting.
// 10.8.2. The standard reminder text for Shift is "(You may [Pay Cost] to play this on top of one of your characters named [Character Name].)"
// 10.8.3. A shifted character takes on the state of the character it was placed on (e.g., it's dry if the character it was placed on was dry, it's exerted if the character it was placed on was exerted).
// 10.8.4. If an effect on a shifted character causes it to enter play exerted, it becomes exerted as it enters play.
// 10.8.5. A shifted character retains whatever damage was on the character it was placed on. It loses all text of the character it was placed on but keeps any effects that applied to that character when the shifted character enters play.
// 10.8.6. When a shifted character leaves play, all cards in its stack (i.e., the card it was played on and any other cards beneath that one)go to the same zone as the shifted character card does, and the cards are no longer considered to be in a stack.
export interface BaseShiftAbility extends LorcanaBaseKeywordAbility {
  keyword: "shift";
  shiftType: "standard" | "classification" | "universal" | "custom";
  costs: LorcanaAbilityCost[];
  effects: LorcanaEffect[]; // For "if you used Shift to play them" effects
}

interface StandardShiftAbility extends BaseShiftAbility {
  shiftType: "standard";
}

interface ClassificationShiftAbility extends BaseShiftAbility {
  shiftType: "classification";
  classification: Classification | Classification[];
}

interface UniversalShiftAbility extends BaseShiftAbility {
  shiftType: "universal";
}

export type ShiftAbility =
  | StandardShiftAbility
  | ClassificationShiftAbility
  | UniversalShiftAbility;

export const shiftAbility = (
  shift: number | LorcanaAbilityCost[],
  name: string | string[],
  text?: string,
): ShiftAbility => {
  const cost: LorcanaAbilityCost[] =
    typeof shift === "number" ? [{ ink: shift }] : shift;

  const nameAsText = typeof name === "string" ? name : name.join(" or ");
  return {
    type: "keyword",
    keyword: "shift",
    shiftType: "standard",
    costs: cost,
    name: `Shift ${shift}`,
    effects: [],
    text:
      text ||
      `**Shift** ${shift} _(You may pay ${shift} {I} to play this on top of one of your characters named ${nameAsText}.)_`,
  };
};

export const isShiftAbility = (
  ability?: LorcanaKeywordAbility,
): ability is ShiftAbility =>
  ability?.type === "keyword" && ability?.keyword === "shift";
