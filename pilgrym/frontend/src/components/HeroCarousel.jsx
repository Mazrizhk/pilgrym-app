import React, { useEffect, useRef, useState } from 'react';

const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD = 50;

// Full-bleed swipeable slideshow used behind the Home hero. Renders as an
// absolutely-positioned background layer — sits as a sibling before the
// hero's text content, not a wrapper around it, so it can safely clip its
// sliding track with overflow-hidden without clipping anything else.
//
// Only the first slide carries the brand-teal tint — the rest are shown as
// the plain uploaded image, since slots 2-5 are meant to be handed to
// agencies as plain promotional banners.
const HeroCarousel = ({ images, onIndexChange }) => {
  const [index, setIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const dragState = useRef(null);
  const trackRef = useRef(null);

  const count = images.length;

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  useEffect(() => {
    if (count < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, index]);

  const goTo = (i) => setIndex(((i % count) + count) % count);

  const onPointerDown = (e) => {
    if (count < 2) return;
    dragState.current = { startX: e.clientX, width: trackRef.current?.offsetWidth || 1 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragState.current) return;
    setDragPx(e.clientX - dragState.current.startX);
  };

  const endDrag = () => {
    if (!dragState.current) return;
    const { width } = dragState.current;
    if (Math.abs(dragPx) > SWIPE_THRESHOLD || Math.abs(dragPx) > width * 0.15) {
      goTo(index + (dragPx < 0 ? 1 : -1));
    }
    dragState.current = null;
    setDragPx(0);
  };

  const dragPercent = dragState.current ? (dragPx / (dragState.current.width || 1)) * 100 : 0;

  return (
    <div className="absolute inset-0 select-none overflow-hidden">
      <div
        ref={trackRef}
        className="absolute left-0 top-0 flex h-full touch-pan-y"
        style={{
          width: `${count * 100}%`,
          transform: `translateX(calc(${-index * (100 / count)}% + ${dragPercent}%))`,
          transition: dragState.current ? 'none' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="relative h-full shrink-0" style={{ width: `${100 / count}%` }}>
            <img src={src} alt="" draggable={false} className="h-full w-full object-cover" />
            {i === 0 && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-900/80 via-primary-900/70 to-primary-900/90" />
            )}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:left-5"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M12.5 5L7.5 10l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 sm:right-5"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <div className="absolute bottom-44 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-32 lg:bottom-24">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-gold-400' : 'w-1.5 bg-white/50 hover:bg-white/75'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
