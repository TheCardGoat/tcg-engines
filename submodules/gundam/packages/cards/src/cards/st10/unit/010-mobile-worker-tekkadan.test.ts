import { describe, it } from "vite-plus/test";
import { expectBlockerAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { st10MobileWorkerTekkadan010 } from "./010-mobile-worker-tekkadan.ts";

describe("Mobile Worker (Tekkadan) (ST10-010)", () => {
  it("<Blocker> rests this Unit and redirects an attack to it", () => {
    expectBlockerAbility(st10MobileWorkerTekkadan010);
  });
});
