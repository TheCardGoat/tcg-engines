import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { royalOathguard } from "./royal-oathguard.ts";

/** @covers g3DQoQvyjI-a2 */
describe("Royal Oathguard — printed keywords", () => {
  proveKeywordGroup({
    card: royalOathguard,
    keywords: [
      {
        name: "intercept",
      },
      {
        name: "vigor",
      },
    ],
  });
});
