import { describe, expect, it } from "bun:test";
import { flounderVoiceOfReason } from "./145-flounder-voice-of-reason";

describe("Flounder - Voice of Reason", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(flounderVoiceOfReason.vanilla).toBe(true);
    expect(flounderVoiceOfReason.abilities).toBeUndefined();
  });
});
