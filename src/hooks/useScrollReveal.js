import { useEffect } from 'react';

/**
 * useScrollReveal
 * Performs single-trigger IntersectionObserver scroll reveals.
 * Triggers when element enters ~10-15% of viewport.
 * Respects prefers-reduced-motion.
 */
export default function useScrollReveal(containerRef, deps = []) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const container = containerRef?.current ?? document;
    const targets = [];

    if (container.matches && container.matches('.reveal, .reveal-stagger, .reveal-image')) {
      targets.push(container);
    }
    if (container.querySelectorAll) {
      container.querySelectorAll('.reveal, .reveal-stagger, .reveal-image').forEach((el) => {
        targets.push(el);
      });
    }

    if (!targets.length) return;

    if (prefersReducedMotion) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Animate once per element when it first enters viewport
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12, // 10-15% of viewport
        rootMargin: '0px 0px -30px 0px'
      }
    );

    targets.forEach((el) => observer.observe(el));

    // Safety timer to prevent hidden content if IntersectionObserver isn't supported or fails
    const fallbackTimer = setTimeout(() => {
      targets.forEach((el) => el.classList.add('is-visible'));
    }, 1000);

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
