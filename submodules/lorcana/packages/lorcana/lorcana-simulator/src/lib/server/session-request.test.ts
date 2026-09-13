import { describe, expect, it } from "bun:test";
import {
  createBestEffortApiRequestInit,
  createSessionLookupRequestInit,
  shouldResolveSession,
} from "./session-request.js";

describe("session request resilience", () => {
  it("does not resolve sessions for static asset requests", () => {
    expect(shouldResolveSession("/idle/favicon.svg")).toBe(false);
    expect(shouldResolveSession("/assets/app.js")).toBe(false);
    expect(shouldResolveSession("/matchmaking")).toBe(true);
  });

  it("bounds the session lookup duration", async () => {
    const init = createSessionLookupRequestInit("session=abc", 1);

    expect(init.headers).toEqual({ cookie: "session=abc" });
    expect(init.signal?.aborted).toBe(false);

    await Bun.sleep(10);

    expect(init.signal?.aborted).toBe(true);
  });

  it("combines caller cancellation with the timeout", () => {
    const controller = new AbortController();
    const init = createBestEffortApiRequestInit({ signal: controller.signal });

    controller.abort();
    expect(init.signal?.aborted).toBe(true);
  });

  it("still times out when a caller signal remains active", async () => {
    const controller = new AbortController();
    const init = createBestEffortApiRequestInit({ signal: controller.signal }, 1);

    await Bun.sleep(10);

    expect(init.signal?.aborted).toBe(true);
  });
});
