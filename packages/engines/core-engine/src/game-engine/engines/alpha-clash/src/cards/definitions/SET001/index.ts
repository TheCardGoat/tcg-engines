/**
 * Alpha Clash Set 001 - Card exports
 *
 * Exports all cards from the first Alpha Clash set
 */

import { CLASH_CARDS } from "./clash/clash";
import { CONTENDERS } from "./contenders/contenders";

export const AC001_CARDS = {
  ...CONTENDERS,
  ...CLASH_CARDS,
};
