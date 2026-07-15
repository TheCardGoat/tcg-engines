import { describe, test } from "vite-plus/test";
import { eb03WillYouBeMyServant060 } from "../../../../../cards/src/cards/EB03/events/060-will-you-be-my-servant.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-060 Will You Be My Servant?", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03WillYouBeMyServant060);
  });
});
