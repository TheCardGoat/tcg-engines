<script lang="ts">
let {
  set,
  number,
  lang = "EN",
  crop = "full",
  alt,
  class: className = "",
  ...rest
}: {
  set: string | number;
  number: number;
  lang?: string;
  crop?: "full" | "art_only" | "art_and_name";
  alt: string;
  class?: string;
} = $props();

function getPaddedSet(s: string | number): string {
  const setStr = String(s);
  // If it's just a number like "6" or 6, pad it to "006".
  // If it's "set6", we might need to extract the number or just use it if the legacy format allows.
  // Based on the user request:
  // https://cdn.assets.lorcanito.com/assets/images/cards/EN/006/143.webp
  // The set is "006". "set6" in the data maps to this.

  // Check if it starts with "set"
  if (setStr.startsWith("set")) {
    const numPart = setStr.replace("set", "");
    return numPart.padStart(3, "0");
  }

  // Otherwise assume it's a number
  return setStr.padStart(3, "0");
}

let imageUrl = $derived.by(() => {
  const paddedSet = getPaddedSet(set);
  const safeLang = lang.toUpperCase();

  // https://cdn.assets.lorcanito.com/assets/images/cards/EN/006/143.webp
  // https://cdn.assets.lorcanito.com/assets/images/cards/006/art_only/143.webp
  // https://cdn.assets.lorcanito.com/assets/images/cards/EN/006/art_and_name/143.webp

  const paddedNumber = String(number).padStart(3, "0");

  switch (crop) {
    case "art_only":
      return `https://cdn.assets.lorcanito.com/assets/images/cards/${paddedSet}/art_only/${paddedNumber}.webp`;
    case "art_and_name":
      return `https://cdn.assets.lorcanito.com/assets/images/cards/${safeLang}/${paddedSet}/art_and_name/${paddedNumber}.webp`;
    case "full":
    default:
      return `https://cdn.assets.lorcanito.com/assets/images/cards/${safeLang}/${paddedSet}/${paddedNumber}.webp`;
  }
});
</script>

<img
  src={imageUrl}
  {alt}
  class="object-cover {className}"
  loading="lazy"
  {...rest}
/>
