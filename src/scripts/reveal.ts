// Reveals [data-reveal="bottom|left|right"] elements as they enter the viewport,
// and starts any stat counters inside them. With reduced motion the element simply
// appears, without the slide or the count-up.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const slideClass: Record<string, string> = {
	bottom: "slide-from-bottom",
	left: "slide-from-left",
	right: "slide-from-right",
};

// The real value is already in the markup (and in an sr-only copy), so no-JS,
// reduced-motion and screen-reader users always get the final number.
function startCounter(el: HTMLElement, duration = 2000) {
	const target = Number(el.dataset.counterTarget || "0");
	const suffix = el.dataset.counterSuffix || "";
	const startTime = performance.now();
	function tick(now: number) {
		const progress = Math.min((now - startTime) / duration, 1);
		// ease-out so the count settles instead of stopping abruptly
		const eased = 1 - Math.pow(1 - progress, 3);
		el.textContent = Math.floor(target * eased).toLocaleString() + suffix;
		if (progress < 1) requestAnimationFrame(tick);
	}
	requestAnimationFrame(tick);
}

const observer = new IntersectionObserver(
	(entries) => {
		for (const { isIntersecting, target } of entries) {
			if (!isIntersecting || !(target instanceof HTMLElement)) continue;
			observer.unobserve(target);
			target.classList.remove("opacity-0");
			if (reduceMotion) continue;
			target.classList.add(slideClass[target.dataset.reveal ?? "bottom"]);
			target
				.querySelectorAll<HTMLElement>("[data-counter-target]")
				.forEach((el) => startCounter(el));
		}
	},
	{ threshold: 0.1 },
);

document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
