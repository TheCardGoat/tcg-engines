import { parseAbilityText } from "./src/parser";

const input = "Evasive";
console.log("Testing parseAbilityText with:", input);

const result = parseAbilityText(input);
console.log("Result:", JSON.stringify(result, null, 2));

if (result.success && result.ability && result.ability.text) {
  console.log("SUCCESS: text property exists:", result.ability.text);
} else {
  console.log("FAILURE: text property missing or parse failed");
}
