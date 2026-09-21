import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { stargazersPortent } from "./stargazers-portent.ts";

/** @covers btjuxztaug-a1 */
describe("Stargazer's Portent — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: stargazersPortent, discount: 1 });
});
