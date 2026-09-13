import type { FabCardFace } from "@tcg/flesh-and-blood-types/authoring";
import type {
  FabCanonicalFaceRef,
  FabCanonicalIdentityRef,
  FabFlipLayoutOptions,
  FabTranscendLayoutOptions,
  FabTwinLayoutOptions,
} from "./layouts.ts";

type Expect<Condition extends true> = Condition;
type IsAssignable<From, To> = From extends To ? true : false;

type Front = FabCanonicalIdentityRef<"front-id">;
type Back = FabCanonicalIdentityRef<"back-id">;
type OtherFront = FabCanonicalIdentityRef<"other-front-id">;
type Face<Identity extends FabCanonicalIdentityRef> = FabCanonicalFaceRef<Identity>;

type FlipRequiresFamily = Expect<
  IsAssignable<
    { readonly front: Face<Front>; readonly back: Face<Back> },
    FabFlipLayoutOptions<Front, Back>
  > extends false
    ? true
    : false
>;

export type FlipRejectsUnknownFamily = Expect<
  IsAssignable<
    {
      readonly family: "transcend";
      readonly front: Face<Front>;
      readonly back: Face<Back>;
    },
    FabFlipLayoutOptions<Front, Back>
  > extends false
    ? true
    : false
>;

export type PairedLayoutsRejectTheSameCanonicalIdentity = Expect<
  IsAssignable<
    { readonly front: Face<Front>; readonly back: Face<Front> },
    FabTwinLayoutOptions<Front, Front>
  > extends false
    ? true
    : false
>;

export type SharedTranscendBackSupportsAnotherFront = Expect<
  IsAssignable<
    { readonly front: Face<OtherFront>; readonly back: Face<Back> },
    FabTranscendLayoutOptions<OtherFront, Back>
  >
>;

export type SplitRequiresBothFaces = Expect<
  IsAssignable<
    { readonly left: FabCardFace },
    { readonly left: FabCardFace; readonly right: FabCardFace }
  > extends false
    ? true
    : false
>;

export type LayoutCompileContract = FlipRequiresFamily;
