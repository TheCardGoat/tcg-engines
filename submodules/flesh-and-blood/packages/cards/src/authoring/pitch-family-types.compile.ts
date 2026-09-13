import type {
  DefinedPitchFamily,
  ExactPitchFamilyMap,
  PitchFamilyIdentity,
  PitchFamilyMap,
  PitchFamilyParameters,
} from "./pitch-family.ts";

type Expect<Condition extends true> = Condition;
type IsAssignable<From, To> = From extends To ? true : false;

type CompleteMapIsAccepted = Expect<
  IsAssignable<{ readonly red: 3; readonly yellow: 2; readonly blue: 1 }, PitchFamilyMap<number>>
>;

export type MissingBlueIsRejected = Expect<
  IsAssignable<{ readonly red: 3; readonly yellow: 2 }, PitchFamilyMap<number>> extends false
    ? true
    : false
>;

export type PartialMapIsAcceptedWhenColorsAreExplicit = Expect<
  IsAssignable<{ readonly red: 1 }, PitchFamilyMap<number, "red">>
>;

export type SingleColorIdentityIsAccepted = Expect<
  IsAssignable<
    {
      readonly slug: "single-red";
      readonly shared: {
        readonly typeBox: {
          readonly metatypes: readonly [];
          readonly supertypes: readonly [];
          readonly types: readonly ["Action"];
          readonly subtypes: readonly [];
        };
      };
      readonly variants: {
        readonly red: {
          readonly canonicalId: "single-red-id";
          readonly slug: "single-red-red";
        };
      };
    },
    PitchFamilyIdentity<"red">
  >
>;

export type SingleColorFamilyDoesNotExposeBlue = Expect<
  "blue" extends keyof DefinedPitchFamily<PitchFamilyMap<undefined, "red">, "red">["cards"]
    ? false
    : true
>;

export type ExtraColorIsRejected = Expect<
  ExactPitchFamilyMap<{
    readonly red: 3;
    readonly yellow: 2;
    readonly blue: 1;
    readonly purple: 4;
  }> extends never
    ? true
    : false
>;

export type DirectFactoryParametersRejectExtraColor = Expect<
  IsAssignable<
    { readonly red: 3; readonly yellow: 2; readonly blue: 1; readonly purple: 4 },
    PitchFamilyParameters<{
      readonly red: 3;
      readonly yellow: 2;
      readonly blue: 1;
      readonly purple: 4;
    }>
  > extends false
    ? true
    : false
>;

export type PitchFamilyCompileContract = CompleteMapIsAccepted;
