import { describe, it } from "vite-plus/test";
import { expectBlockerAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { eb01GaplantTr5HrairooUnit1054 } from "./054-gaplant-tr-5-hrairoo-unit-1.ts";

describe('Gaplant TR-5 "Hrairoo" Unit 1 (EB01-054)', () => {
  it("<Blocker> rests this Unit and redirects an attack to it", () => {
    expectBlockerAbility(eb01GaplantTr5HrairooUnit1054);
  });
});
