/**
 * Sets Generator
 *
 * Generates sets.json from input card sets.
 */

import type { InputCardSet, SetDefinition } from "../types";

/**
 * Map set ID to set code
 * First 5 sets have named codes, rest use numeric codes
 */
const SET_ID_TO_CODE: Record<string, string> = {
  set1: "TFC",
  set2: "ROF",
  set3: "ITI",
  set4: "URR",
  set5: "SSK",
  set6: "AZS",
  set7: "ARC",
  set8: "ROJ",
  set9: "FAB",
  set10: "WIW",
  quest1: "DT1",
  quest2: "PH1",
  gateway1: "GW1",
};

/**
 * Get set code from set ID
 */
function getSetCode(setId: string): string {
  if (SET_ID_TO_CODE[setId]) {
    return SET_ID_TO_CODE[setId];
  }

  // Extract number from setId and format as 3-digit code
  const match = setId.match(/\d+/);
  if (match) {
    return match[0].padStart(3, "0");
  }

  return setId.toUpperCase().slice(0, 3);
}

/**
 * Transform input card set to output set definition
 */
function transformSet(inputSet: InputCardSet): SetDefinition {
  return {
    id: inputSet.id,
    name: inputSet.name,
    code: getSetCode(inputSet.id),
    sortNumber: inputSet.sort_number,
    type: inputSet.type,
    thumbnailUrl: inputSet.thumbnail_image_url,
  };
}

/**
 * Generate sets record from input card sets
 */
export function generateSets(
  inputSets: InputCardSet[],
): Record<string, SetDefinition> {
  const sets: Record<string, SetDefinition> = {};

  for (const inputSet of inputSets) {
    const setDef = transformSet(inputSet);
    sets[setDef.id] = setDef;
  }

  return sets;
}

/**
 * Update set with total cards count
 */
export function updateSetTotalCards(
  sets: Record<string, SetDefinition>,
  setId: string,
  totalCards: number,
): void {
  if (sets[setId]) {
    sets[setId].totalCards = totalCards;
  }
}
