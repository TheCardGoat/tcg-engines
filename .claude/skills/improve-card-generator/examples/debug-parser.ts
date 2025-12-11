import { parseAbilityText } from "../../src/parser";

// Replace this with the text you want to debug
const text =
  "During your turn, whenever this character banishes another character in a challenge, you may ready this character.";

console.log("Parsing:", text);
const result = parseAbilityText(text);

if (result.success) {
  console.log("✅ Success!");
  console.log(JSON.stringify(result.data, null, 2));
} else {
  console.error("❌ Error:");
  console.error(result.error);
}
