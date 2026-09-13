import { describe, expect, it } from "vitest";
import {
  defineFlipLayout,
  defineLayoutFace,
  defineSplitLayout,
  defineTranscendLayout,
  defineTwinLayout,
  toRuntimeCardLayout,
  type FabCanonicalIdentityRef,
} from "./layouts.ts";

const emptyFace = (name: string) => ({
  name,
  typeText: "Generic Action",
  types: ["Generic", "Action"] as const,
  traits: [],
  text: "",
  keywords: [],
  abilities: [],
});

describe("typed FAB layout authoring", () => {
  it("keeps a split card under one physical canonical identity", () => {
    const identity = { canonicalId: "split-id" } as const;
    const layout = defineSplitLayout(identity, {
      left: emptyFace("Left"),
      right: emptyFace("Right"),
    });

    expect(layout).toEqual({
      kind: "split",
      physicalCanonicalId: "split-id",
      faces: [emptyFace("Left"), emptyFace("Right")],
    });
    expect(toRuntimeCardLayout(layout)).toEqual({
      kind: "split",
      faces: [emptyFace("Left"), emptyFace("Right")],
    });
  });

  it("derives stable physical face ids for flip and twin layouts", () => {
    const front = defineLayoutFace({ canonicalId: "front-id" } as const, emptyFace("Front"));
    const back = defineLayoutFace({ canonicalId: "back-id" } as const, emptyFace("Back"));

    const flip = defineFlipLayout({ family: "invocation", front, back });
    const twin = defineTwinLayout({ front, back });

    expect(flip).toMatchObject({
      kind: "flip",
      family: "invocation",
      physicalCanonicalId: "front-id",
      frontCanonicalId: "front-id",
      backCanonicalId: "back-id",
      front: { canonicalId: "front-id", faceId: "front-id:face:front" },
      back: { canonicalId: "back-id", faceId: "front-id:face:back" },
    });
    expect(toRuntimeCardLayout(flip)).toEqual({
      kind: "flip",
      family: "invocation",
      front: { ...emptyFace("Front"), faceId: "front-id:face:front" },
      back: { ...emptyFace("Back"), faceId: "front-id:face:back" },
    });
    expect(twin).toMatchObject({
      kind: "twin",
      front: { faceId: "front-id:face:front" },
      back: { faceId: "front-id:face:back" },
    });
  });

  it("reuses one canonical transcend back without leaking a prior physical face id", () => {
    const innerChi = defineLayoutFace(
      { canonicalId: "inner-chi-id" } as const,
      emptyFace("Inner Chi"),
    );
    const first = defineTranscendLayout({
      front: defineLayoutFace({ canonicalId: "first-front" } as const, emptyFace("First")),
      back: innerChi,
    });
    const second = defineTranscendLayout({
      front: defineLayoutFace({ canonicalId: "second-front" } as const, emptyFace("Second")),
      back: innerChi,
    });

    expect(first.backCanonicalId).toBe("inner-chi-id");
    expect(second.backCanonicalId).toBe("inner-chi-id");
    expect(first.back.faceId).toBe("first-front:face:back");
    expect(second.back.faceId).toBe("second-front:face:back");
    expect(innerChi.face).not.toHaveProperty("faceId");
  });

  it("runtime-validates distinct identities when generated identity types are widened", () => {
    const frontIdentity: FabCanonicalIdentityRef = { canonicalId: "same-id" };
    const backIdentity: FabCanonicalIdentityRef = { canonicalId: "same-id" };
    expect(() =>
      defineTwinLayout({
        front: defineLayoutFace(frontIdentity, emptyFace("Front")),
        back: defineLayoutFace(backIdentity, emptyFace("Back")),
      }),
    ).toThrow("distinct front and back canonical identities");
  });
});
