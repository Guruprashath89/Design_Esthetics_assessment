import { useEffect } from 'react';

/**
 * useScrollLinkedReveal
 * Directly links element entrance transforms & opacity to exact window scroll position.
 * As user scrolls down, elements smoothly translate upward and fade in.
 * If user stops scrolling, elements stay at exact progress.
 * If user scrolls backward, elements smoothly reverse.
 * Uses requestAnimationFrame for 60fps performance without React re-renders.
 */
export default function useScrollLinkedReveal(containerRef, deps = []) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const updateScrollLinkedElements = () => {
      const container = containerRef?.current ?? document;
      const elements = container.querySelectorAll('.scroll-linked, .scroll-linked-stagger');

      if (!elements.length) {
        ticking = false;
        return;
      }

      const windowHeight = window.innerHeight;
      const startRange = windowHeight * 0.95; // Animation begins when top of element hits 95% viewport height
      const endRange = windowHeight * 0.62;   // Animation completes when top hits 62% viewport height
      const rangeDistance = startRange - endRange;

      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        
        // Base raw progress (0 to 1)
        let rawProgress = (startRange - rect.top) / rangeDistance;
        rawProgress = Math.max(0, Math.min(1, rawProgress));

        // Apply slight stagger offset if element has scroll-linked-stagger class
        let progress = rawProgress;
        if (el.classList.contains('scroll-linked-stagger')) {
          const staggerIndex = Number(el.dataset.staggerIndex || index % 4);
          const staggerOffset = Math.min(staggerIndex * 0.12, 0.36);
          progress = Math.max(0, Math.min(1, (rawProgress - staggerOffset) / (1 - staggerOffset)));
        }

        // Apply smooth interpolation: easeOutCubic (1 - (1 - p)^3)
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const translateY = (1 - easedProgress) * 24; // 24px initial offset
        const opacity = easedProgress;

        el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
        el.style.opacity = opacity.toFixed(3);
      });

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollLinkedElements);
        ticking = true;
      }
    };

    // Initial check on mount
    updateScrollLinkedElements();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
