import { installBrowserShims } from "./src/testing/browser-shims.ts";

installBrowserShims();
globalThis.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = true;
