<script lang="ts">
  import { Image } from "@unpic/svelte";
  import {AspectRatio} from "$lib/design-system/primitives/aspect-ratio/index.js";
  import { buildLorcanaAssetUrl, getCdnFallbackUrl } from "$lib/config/public-url-config.js";
  import {
    CARD_IMAGE_DIMENSIONS,
    type ImageFormat,
  } from "$lib/design-system/simulator/cards/card-image-format.js";

  const {
    set,
    number,
    lang = "EN",
    crop = "full",
    alt,
    class: className = "",
    onLoad,
    onError,
  }: {
    set: string | number;
    number: number | string;
    lang?: string;
    crop?: ImageFormat;
    alt: string;
    class?: string;
    onLoad?: () => void;
    onError?: () => void;
  } = $props();

  function getPaddedSet(s: string | number): string {
    const setStr = String(s).trim();
    const setMatch = /^set(\d+)$/i.exec(setStr);

    if (setMatch) {
      const [, numPart] = setMatch;
      return numPart.padStart(3, "0");
    }

    if (/^\d+$/.test(setStr)) {
      return setStr.padStart(3, "0");
    }

    const promoMatch = /^(P|C|Q|G)(\d+)$/i.exec(setStr);
    if (promoMatch) {
      const [, prefix, numPart] = promoMatch;
      return `${prefix.toUpperCase()}${numPart.padStart(2, "0")}`;
    }

    return setStr.toUpperCase();
  }

  const imageUrl = $derived.by(() => {
    const paddedSet = getPaddedSet(set);
    const safeLang = lang.toUpperCase();

    // https://new-cdn.lorcanito.com/public/lorcana/EN/004/128.webp
    // https://new-cdn.lorcanito.com/public/lorcana/004/art_only/128.webp
    // https://new-cdn.lorcanito.com/public/lorcana/EN/004/art_and_name/128.webp

    const paddedNumber = String(number).padStart(3, "0");

    switch (crop) {
      case "art_only": {
        return buildLorcanaAssetUrl(`${paddedSet}/art_only/${paddedNumber}.webp`);
      }
      case "art_and_name": {
        return buildLorcanaAssetUrl(`${safeLang}/${paddedSet}/art_and_name/${paddedNumber}.webp`);
      }
      case "full":
      default: {
        return buildLorcanaAssetUrl(`${safeLang}/${paddedSet}/${paddedNumber}.webp`);
      }
    }
  });

  const dimensions = $derived(CARD_IMAGE_DIMENSIONS[crop]);

  const aspectRatio = $derived(dimensions.width / dimensions.height);

  let cdnFailed = $state(false);

  $effect(() => {
    imageUrl;
    cdnFailed = false;
  });

  const activeSrc = $derived(cdnFailed ? (getCdnFallbackUrl(imageUrl) ?? imageUrl) : imageUrl);
</script>

<AspectRatio ratio={aspectRatio} class="w-full h-full">
  <Image
    src={activeSrc}
    {alt}
    width={dimensions.width}
    height={dimensions.height}
    layout="constrained"
    class="object-cover {className}"
    onload={onLoad}
    onerror={() => {
      if (!cdnFailed && getCdnFallbackUrl(imageUrl) !== null) {
        cdnFailed = true;
      } else {
        onError?.();
      }
    }}
  />
</AspectRatio>

<style>
  :global(img) {
    display: block;
    image-rendering: high-quality;
  }
</style>
