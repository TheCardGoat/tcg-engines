import type {
  FabCardFace,
  FabCardLayout,
  FabFlipCardLayout,
  FabPairedCardFace,
  FabTranscendCardLayout,
  FabTwinCardLayout,
} from "@tcg/flesh-and-blood-types/authoring";

/**
 * The minimal contract supplied by the generated canonical identity registry.
 * Keeping the full generated record generic preserves its literal canonical id
 * without coupling layout authoring to a particular generated-file shape.
 */
export type FabCanonicalIdentityRef<CanonicalId extends string = string> = {
  readonly canonicalId: CanonicalId;
};

type IdentityId<Identity extends FabCanonicalIdentityRef> = Identity["canonicalId"];
type PhysicalFaceId<
  Identity extends FabCanonicalIdentityRef,
  Side extends "front" | "back",
> = `${IdentityId<Identity>}:face:${Side}`;

/**
 * A reusable canonical face definition. It intentionally has no physical
 * `faceId`: a shared back such as Inner Chi receives the id of each physical
 * transcend card only when the relationship is assembled.
 */
export type FabCanonicalFaceRef<
  Identity extends FabCanonicalIdentityRef = FabCanonicalIdentityRef,
> = {
  readonly identity: Identity;
  readonly face: Omit<FabPairedCardFace, "faceId">;
};

export type FabAuthoredPairedFace<
  PhysicalIdentity extends FabCanonicalIdentityRef,
  FaceIdentity extends FabCanonicalIdentityRef,
  Side extends "front" | "back",
> = FabPairedCardFace & {
  readonly canonicalId: IdentityId<FaceIdentity>;
  readonly faceId: PhysicalFaceId<PhysicalIdentity, Side>;
};

type DistinctBackIdentity<
  FrontIdentity extends FabCanonicalIdentityRef,
  BackIdentity extends FabCanonicalIdentityRef,
> =
  string extends IdentityId<BackIdentity>
    ? BackIdentity
    : IdentityId<FrontIdentity> extends IdentityId<BackIdentity>
      ? IdentityId<BackIdentity> extends IdentityId<FrontIdentity>
        ? never
        : BackIdentity
      : BackIdentity;

type PairedLayoutIdentityFields<
  FrontIdentity extends FabCanonicalIdentityRef,
  BackIdentity extends FabCanonicalIdentityRef,
> = {
  /** The physical card is registered under its reviewed front identity. */
  readonly physicalCanonicalId: IdentityId<FrontIdentity>;
  readonly frontCanonicalId: IdentityId<FrontIdentity>;
  readonly backCanonicalId: IdentityId<BackIdentity>;
  readonly front: FabAuthoredPairedFace<FrontIdentity, FrontIdentity, "front">;
  readonly back: FabAuthoredPairedFace<FrontIdentity, BackIdentity, "back">;
};

export type FabAuthoredFlipLayout<
  FrontIdentity extends FabCanonicalIdentityRef,
  BackIdentity extends FabCanonicalIdentityRef,
> = Omit<FabFlipCardLayout, "front" | "back"> &
  PairedLayoutIdentityFields<FrontIdentity, BackIdentity>;

export type FabAuthoredTwinLayout<
  FrontIdentity extends FabCanonicalIdentityRef,
  BackIdentity extends FabCanonicalIdentityRef,
> = Omit<FabTwinCardLayout, "front" | "back"> &
  PairedLayoutIdentityFields<FrontIdentity, BackIdentity>;

export type FabAuthoredTranscendLayout<
  FrontIdentity extends FabCanonicalIdentityRef,
  BackIdentity extends FabCanonicalIdentityRef,
> = Omit<FabTranscendCardLayout, "front" | "back"> &
  PairedLayoutIdentityFields<FrontIdentity, BackIdentity>;

export type FabAuthoredSplitLayout<Identity extends FabCanonicalIdentityRef> = Extract<
  FabCardLayout,
  { readonly kind: "split" }
> & {
  readonly physicalCanonicalId: IdentityId<Identity>;
};

/** Any reviewed authored layout whose physical object uses this canonical identity. */
export type FabAuthoredCardLayout<Identity extends FabCanonicalIdentityRef> =
  | FabAuthoredSplitLayout<Identity>
  | FabAuthoredFlipLayout<Identity, FabCanonicalIdentityRef>
  | FabAuthoredTwinLayout<Identity, FabCanonicalIdentityRef>
  | FabAuthoredTranscendLayout<Identity, FabCanonicalIdentityRef>;

type PairedLayoutOptions<
  FrontIdentity extends FabCanonicalIdentityRef,
  BackIdentity extends FabCanonicalIdentityRef,
> = {
  readonly front: FabCanonicalFaceRef<FrontIdentity>;
  readonly back: FabCanonicalFaceRef<DistinctBackIdentity<FrontIdentity, BackIdentity>>;
};

export type FabFlipLayoutOptions<
  FrontIdentity extends FabCanonicalIdentityRef,
  BackIdentity extends FabCanonicalIdentityRef,
> = PairedLayoutOptions<FrontIdentity, BackIdentity> & {
  /** Required by CR 9.1.3; it must never be inferred from display text. */
  readonly family: FabFlipCardLayout["family"];
};

export type FabTwinLayoutOptions<
  FrontIdentity extends FabCanonicalIdentityRef,
  BackIdentity extends FabCanonicalIdentityRef,
> = PairedLayoutOptions<FrontIdentity, BackIdentity>;

export type FabTranscendLayoutOptions<
  FrontIdentity extends FabCanonicalIdentityRef,
  BackIdentity extends FabCanonicalIdentityRef,
> = PairedLayoutOptions<FrontIdentity, BackIdentity>;

export function defineLayoutFace<const Identity extends FabCanonicalIdentityRef>(
  identity: Identity,
  face: Omit<FabPairedCardFace, "faceId">,
): FabCanonicalFaceRef<Identity> {
  return { identity, face };
}

export function defineSplitLayout<const Identity extends FabCanonicalIdentityRef>(
  identity: Identity,
  faces: { readonly left: FabCardFace; readonly right: FabCardFace },
): FabAuthoredSplitLayout<Identity> {
  return {
    kind: "split",
    physicalCanonicalId: identity.canonicalId,
    faces: [faces.left, faces.right],
  };
}

/** Removes authoring-only identity metadata at the executable card boundary. */
export function toRuntimeCardLayout(
  layout: FabAuthoredCardLayout<FabCanonicalIdentityRef>,
): FabCardLayout {
  if (layout.kind === "split") return { kind: "split", faces: layout.faces };
  const front = runtimePairedFace(layout.front);
  const back = runtimePairedFace(layout.back);
  return layout.kind === "flip"
    ? { kind: "flip", family: layout.family, front, back }
    : { kind: layout.kind, front, back };
}

export function defineFlipLayout<
  const FrontIdentity extends FabCanonicalIdentityRef,
  const BackIdentity extends FabCanonicalIdentityRef,
>(
  options: FabFlipLayoutOptions<FrontIdentity, BackIdentity>,
): FabAuthoredFlipLayout<FrontIdentity, BackIdentity> {
  return {
    ...pairedLayoutFields(options.front, options.back),
    kind: "flip",
    family: options.family,
  };
}

export function defineTwinLayout<
  const FrontIdentity extends FabCanonicalIdentityRef,
  const BackIdentity extends FabCanonicalIdentityRef,
>(
  options: FabTwinLayoutOptions<FrontIdentity, BackIdentity>,
): FabAuthoredTwinLayout<FrontIdentity, BackIdentity> {
  return {
    ...pairedLayoutFields(options.front, options.back),
    kind: "twin",
  };
}

export function defineTranscendLayout<
  const FrontIdentity extends FabCanonicalIdentityRef,
  const BackIdentity extends FabCanonicalIdentityRef,
>(
  options: FabTranscendLayoutOptions<FrontIdentity, BackIdentity>,
): FabAuthoredTranscendLayout<FrontIdentity, BackIdentity> {
  return {
    ...pairedLayoutFields(options.front, options.back),
    kind: "transcend",
  };
}

function pairedLayoutFields<
  const FrontIdentity extends FabCanonicalIdentityRef,
  const BackIdentity extends FabCanonicalIdentityRef,
>(
  front: FabCanonicalFaceRef<FrontIdentity>,
  back: FabCanonicalFaceRef<DistinctBackIdentity<FrontIdentity, BackIdentity>>,
): PairedLayoutIdentityFields<FrontIdentity, BackIdentity> {
  const physicalCanonicalId = front.identity.canonicalId;
  if (physicalCanonicalId === back.identity.canonicalId) {
    throw new Error("Paired FAB layout must use distinct front and back canonical identities");
  }
  return {
    physicalCanonicalId,
    frontCanonicalId: physicalCanonicalId,
    backCanonicalId: back.identity.canonicalId,
    front: {
      ...front.face,
      canonicalId: physicalCanonicalId,
      faceId: physicalFaceId(physicalCanonicalId, "front"),
    },
    back: {
      ...back.face,
      canonicalId: back.identity.canonicalId,
      faceId: physicalFaceId(physicalCanonicalId, "back"),
    },
  };
}

function physicalFaceId<const CanonicalId extends string, const Side extends "front" | "back">(
  canonicalId: CanonicalId,
  side: Side,
): `${CanonicalId}:face:${Side}` {
  // TypeScript does not retain generic template-literal interpolation, but the
  // construction itself is closed over the exact canonical id and side.
  return `${canonicalId}:face:${side}` as `${CanonicalId}:face:${Side}`;
}

function runtimePairedFace(face: FabPairedCardFace & { readonly canonicalId?: string }) {
  const { canonicalId: _canonicalId, ...runtimeFace } = face;
  return runtimeFace;
}
