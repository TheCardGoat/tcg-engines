import { getFleshAndBloodAuthoredFace } from "@tcg/flesh-and-blood-cards/runtime-registry";
import type { FleshAndBloodCard } from "@tcg/flesh-and-blood-types";

/** Use the same localized, authored definition as a real match, including choice labels. */
export function previewCard(card: FleshAndBloodCard): FleshAndBloodCard {
  const localized = getFleshAndBloodAuthoredFace(card.canonicalId);
  if (!localized) throw new Error(`Preview card is absent from the runtime registry: ${card.slug}`);
  return localized;
}
