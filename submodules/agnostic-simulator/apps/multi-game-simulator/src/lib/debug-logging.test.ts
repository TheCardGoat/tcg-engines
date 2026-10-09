import { afterEach, expect, test, vi } from "vitest";
import { isGatewayPacketLoggingEnabled } from "@tcg/gateway-client";
import { logDebugSnapshot } from "./debug-logging";

vi.mock("@tcg/gateway-client", () => ({ isGatewayPacketLoggingEnabled: vi.fn() }));
afterEach(() => vi.restoreAllMocks());

test("logs a single copyable JSON line and freezes its values", () => {
  vi.mocked(isGatewayPacketLoggingEnabled).mockReturnValue(true);
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  const input = { version: 1, nested: { token: "private-token", count: 6 } };
  logDebugSnapshot("[hand-debug]", input);
  input.nested.count = 0;
  expect(log).toHaveBeenCalledWith(
    '[hand-debug] {"version":1,"nested":{"token":"[redacted]","count":6}}',
  );
});

test("does not log when packet diagnostics are disabled", () => {
  vi.mocked(isGatewayPacketLoggingEnabled).mockReturnValue(false);
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  logDebugSnapshot("[hand-debug]", { version: 1 });
  expect(log).not.toHaveBeenCalled();
});
