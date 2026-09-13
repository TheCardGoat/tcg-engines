import { describe, it } from "vite-plus/test";
import { expectDeployPlacesActiveExResources } from "../../../test-helpers/unit-deploy-behavior-test-helpers.ts";
import { eb01GSelf038 } from "./038-g-self.ts";

describe("G-Self (EB01-038)", () => {
  it("【Deploy】 places exactly 1 active EX Resource", () => {
    expectDeployPlacesActiveExResources(eb01GSelf038, 1);
  });
});
