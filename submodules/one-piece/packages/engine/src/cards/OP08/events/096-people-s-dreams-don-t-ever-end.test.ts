import { describe, test } from "vite-plus/test";
import { op08PeopleSDreamsDonTEverEnd096 } from "../../../../../cards/src/cards/OP08/events/096-people-s-dreams-don-t-ever-end.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-096 People's Dreams Don't Ever End!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08PeopleSDreamsDonTEverEnd096);
  });
});
