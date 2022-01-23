<script>
	import '../app.css';
	const HEADER_TITLE = 'SHAPES';
	const navigationBar = [
		{ name: 'MINT', href: '/' },
		{ name: 'ABOUT', href: '/about' }
	];
</script>

<main class="h-screen">
	<div
		class="text-black tracking-widest decoration-2 font-mono text-2xl underline-offset-4 underline"
	>
		{HEADER_TITLE}
	</div>
	<div class="py-6">
		<div class="flex flex-wrap justify-center">
			{#each navigationBar as navItem}
				<a
					href={navItem.href}
					class="text-black tracking-widest underline-offset-4 decoration-2  px-5 py-2"
					>{navItem.name}</a
				>
			{/each}
		</div>
	</div>
	<slot />
	<div>
		<br />
		<br />
	</div>
</main>
