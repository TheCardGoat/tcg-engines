import { describe, expect, it } from "vite-plus/test";

import { spatialTargetNoun } from "./PromptContainer.tsx";

describe("PromptContainer compact spatial copy", () => {
  it("uses a plural noun for the 'one of your' construction", () => {
    expect(spatialTargetNoun("Unit", 1, "bottom")).toBe("Units");
  });

  it("keeps a single enemy target singular", () => {
    expect(spatialTargetNoun("Unit", 1, "top")).toBe("Unit");
  });
});
