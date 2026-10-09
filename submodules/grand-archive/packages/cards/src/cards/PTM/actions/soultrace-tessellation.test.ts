import { describe } from "vitest";
import { soultraceTessellation } from "./soultrace-tessellation.ts";
import { provePreparedTargetAction } from "../../../testing/prepared-target-action.ts";
/** @covers 7ePq6I4uZ8-a1
 * @covers 7ePq6I4uZ8-a2
 */
describe("soultraceTessellation", () => {
  for (const banished of [0, 2, 3, 5, 6])
    provePreparedTargetAction({
      card: soultraceTessellation,
      targetId: "target-unit",
      effect: "sheen",
      banished,
    });
});
