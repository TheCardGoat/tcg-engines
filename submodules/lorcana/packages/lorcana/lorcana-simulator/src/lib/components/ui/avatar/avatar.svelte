<script lang="ts" module>
export type AvatarProps = {
	class?: string;
};
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="avatar"
	class={cn(
		"relative flex size-8 shrink-0 overflow-hidden rounded-full",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
