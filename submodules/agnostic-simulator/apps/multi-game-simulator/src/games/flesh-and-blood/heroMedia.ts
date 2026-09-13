import { useEffect, useState } from "react";

// SYNC CONTRACT: keep hero-name matching, CDN index resolution, and subscriber
// eligibility aligned with platform/apps/web/src/lib/flesh-and-blood/hero-media.ts.
// React and Svelte cannot share this runtime code, so changes must update both.
const HERO_ASSET_BASE = "https://cdn.tcg.online/public/fab/simulator/heroes/";
const HERO_INDEX_URL = `${HERO_ASSET_BASE}index.json`;

interface HeroAssetRecord {
  readonly slug?: string;
  readonly name: string;
  readonly portrait: string;
  readonly background: string;
  readonly video?: string;
}
interface HeroAssetIndex {
  readonly heroes: readonly HeroAssetRecord[];
}
export interface FabHeroMedia {
  readonly portraitUrl: string;
  readonly backgroundUrl: string;
  readonly videoUrl?: string;
}

let indexRequest: Promise<HeroAssetIndex | null> | undefined;
export function loadHeroIndex(): Promise<HeroAssetIndex | null> {
  indexRequest ??= fetch(HERO_INDEX_URL)
    .then((response) => (response.ok ? response.json() : null))
    .then((value): HeroAssetIndex | null =>
      value && typeof value === "object" && Array.isArray((value as HeroAssetIndex).heroes)
        ? (value as HeroAssetIndex)
        : null,
    )
    .catch(() => null);
  return indexRequest;
}

function heroLookupKey(name: string | undefined): string | undefined {
  const firstWord = name?.trim().split(/\s+/)[0];
  const normalized = firstWord?.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
  return normalized || undefined;
}

function normalizedHeroIdentity(name: string | undefined): string | undefined {
  const normalized = name
    ?.trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return normalized || undefined;
}

export function useFabHeroMedia(heroName: string | undefined): FabHeroMedia | null {
  const [media, setMedia] = useState<FabHeroMedia | null>(null);
  useEffect(() => {
    const key = heroLookupKey(heroName);
    if (!key) {
      setMedia(null);
      return;
    }
    let active = true;
    void loadHeroIndex().then((index) => {
      const identity = normalizedHeroIdentity(heroName);
      const asset =
        index?.heroes.find(
          (candidate) =>
            normalizedHeroIdentity(candidate.slug) === identity ||
            normalizedHeroIdentity(candidate.name) === identity,
        ) ?? index?.heroes.find((candidate) => heroLookupKey(candidate.name) === key);
      if (!active) return;
      setMedia(
        asset
          ? {
              portraitUrl: new URL(asset.portrait, HERO_ASSET_BASE).href,
              backgroundUrl: new URL(asset.background, HERO_ASSET_BASE).href,
              ...(asset.video ? { videoUrl: new URL(asset.video, HERO_ASSET_BASE).href } : {}),
            }
          : null,
      );
    });
    return () => {
      active = false;
    };
  }, [heroName]);
  return media;
}

export function isFabSubscriber(subscriptionTier: string | undefined): boolean {
  const tier = subscriptionTier?.toLocaleLowerCase().trim();
  return Boolean(tier && !["free", "free account", "practice", "unknown"].includes(tier));
}
