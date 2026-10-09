import { describe } from "vitest";
import { danteProdigalSwain } from "./dante-prodigal-swain.ts";
import { elysianTestSubject } from "../../PRD/tokens/elysian-test-subject.ts";
import { proveSummonOnEnter } from "../../../testing/summon-on-enter.ts";
/** @covers apVtyt48u3-a1 */
describe("danteProdigalSwain", () => {
  proveSummonOnEnter({
    card: danteProdigalSwain,
    token: elysianTestSubject,
    cost: 1,
    count: 1,
    abilityId: "apVtyt48u3-a1",
    materialize: true,
  });
});
