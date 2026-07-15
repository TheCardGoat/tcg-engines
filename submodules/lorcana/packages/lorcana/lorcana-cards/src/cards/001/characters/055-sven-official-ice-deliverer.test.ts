import { describe, expect, it } from "bun:test";
import { svenOfficialIceDeliverer } from "./055-sven-official-ice-deliverer";

describe("Sven - Official Ice Deliverer", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(svenOfficialIceDeliverer.vanilla).toBe(true);
    expect(svenOfficialIceDeliverer.abilities).toBeUndefined();
  });
});
