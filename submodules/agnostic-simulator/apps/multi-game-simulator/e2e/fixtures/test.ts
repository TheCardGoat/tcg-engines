import { test as base } from "@playwright/test";
import { SimulatorPage } from "../poms/SimulatorPage";

/**
 * Spec-level fixture: every test gets a `simulator` POM bound to the page.
 * Use `import { test, expect } from "../fixtures/test"` in specs.
 */
export const test = base.extend<{ simulator: SimulatorPage }>({
  simulator: async ({ page }, use) => {
    await use(new SimulatorPage(page));
  },
});

export { expect } from "@playwright/test";
