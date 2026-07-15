<script lang="ts" module>
export type AvatarImageProps = {
	class?: string;
	src?: string;
	alt?: string;
};
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils";
	import type { HTMLImgAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		src,
		alt = "",
		...restProps
	}: WithElementRef<HTMLImgAttributes> = $props();
</script>

{#if src}
	<img
		bind:this={ref}
		data-slot="avatar-image"
		{src}
		{alt}
		class={cn("aspect-square size-full object-cover", className)}
		{...restProps}
	/>
{/if}
