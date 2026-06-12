<script lang="ts" module>
export type AvatarFallbackProps = {
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
	data-slot="avatar-fallback"
	class={cn(
		"bg-muted flex size-full items-center justify-center rounded-full text-xs font-medium",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
