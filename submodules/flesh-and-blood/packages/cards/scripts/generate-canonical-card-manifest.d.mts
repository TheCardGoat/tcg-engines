export interface CanonicalManifestEntry {
  readonly canonicalId: string;
  readonly exportName: string;
  readonly i18nExportName: string;
  readonly module: string;
  readonly i18nModule: string;
  readonly primaryType: string;
  readonly stableFamilyKey: string;
}

export interface CanonicalManifestCatalog {
  readonly cards: readonly {
    readonly canonicalId: string;
    readonly slug: string;
    readonly types: readonly string[];
  }[];
}

export function buildExpectedCanonicalManifest(input: {
  readonly catalog: CanonicalManifestCatalog;
  readonly sourceRoot: string;
}): {
  readonly manifest: readonly CanonicalManifestEntry[];
  readonly implementationGaps: readonly {
    readonly module: string;
    readonly canonicalIds: readonly string[];
  }[];
};
