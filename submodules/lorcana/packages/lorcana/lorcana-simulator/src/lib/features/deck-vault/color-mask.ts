import {
  LORCANA_INK_NAMES,
  type LorcanaInkName,
} from "@/features/simulator/model/lorcana-colors.js";

/** Convert a bitmask of ink colors to an array of ink names. */
export function colorMaskToInks(colorMask: number): LorcanaInkName[] {
  return LORCANA_INK_NAMES.filter((_, index) => (colorMask & (1 << index)) !== 0);
}
