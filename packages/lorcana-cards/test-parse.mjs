import { parseEffect } from "./src/parser/v2/effects/index.ts";

const result = parseEffect(
  "Choose one: Banish chosen character. Return chosen character to their player's hand.",
);
console.log("Result:", JSON.stringify(result, null, 2));
