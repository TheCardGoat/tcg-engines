import { describe, expect, it } from "bun:test";
import { serializeErrorDetails } from "./error-details.js";

describe("serializeErrorDetails", () => {
  it("keeps the nested socket failure that Node fetch exposes as cause", () => {
    const socketError = Object.assign(new Error("connect ECONNREFUSED 10.0.0.5:8080"), {
      code: "ECONNREFUSED",
      errno: -111,
      syscall: "connect",
      address: "10.0.0.5",
      port: 8080,
    });
    const fetchError = new TypeError("fetch failed", { cause: socketError });

    expect(serializeErrorDetails(fetchError)).toEqual({
      name: "TypeError",
      message: "fetch failed",
      cause: {
        name: "Error",
        message: "connect ECONNREFUSED 10.0.0.5:8080",
        code: "ECONNREFUSED",
        errno: -111,
        syscall: "connect",
        address: "10.0.0.5",
        port: 8080,
      },
    });
  });

  it("bounds nested aggregate errors", () => {
    const error = Object.assign(new Error("many connections failed"), {
      errors: Array.from({ length: 6 }, (_, index) => new Error(`connection ${index}`)),
    });

    expect(serializeErrorDetails(error).errors).toHaveLength(5);
  });
});
