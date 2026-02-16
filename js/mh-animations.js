(function () {

  
  // Elements to watch
  const mhAnimations = document.querySelectorAll('[data-mh-animation]');

  // Remove 'no-js' class if present, because JavaScript is running
  if (document.documentElement.classList.contains('no-js')) {
    document.documentElement.classList.remove('no-js');
  }

  // Add 'js' class to <html> so CSS can apply JavaScript-specific styles
  if (!document.documentElement.classList.contains('js')) {
    document.documentElement.classList.add('js');
  }

  // Feature detection
  if ('IntersectionObserver' in window) {

    // animation observer options
    let animationObserverOptions = {
      root: null,
      rootMargin: '0px 0px -20% 0px',
      threshold: 0.1
    }

    // one observer for all mh animations
    let animationObserver = new IntersectionObserver(animationObserverCallback, animationObserverOptions);

    // animation observer handler
    function animationObserverCallback(entries, animationObserver) {
      entries.forEach((entry, index) => {
        // Each entry describes an intersection change for one observed
        // target element:
        //   entry.boundingClientRect
        //   entry.intersectionRatio
        //   entry.intersectionRect
        //   entry.isIntersecting
        //   entry.rootBounds
        //   entry.target
        //   entry.time
        if (entry.isIntersecting) {
          // add will-change when in view
          if (!entry.target.classList.contains('animated')){
            entry.target.style.willChange = 'opacity, transform';
          }

          // add animated class
          if (entry.target.dataset.mhAnimation) {
            entry.target.classList.add(entry.target.dataset.mhAnimation, 'mh-animation--animated');
          }

          // add/handle text effect
          if (entry.target.dataset.textEffectDelay) {
            let delay = parseInt(entry.target.dataset.textEffectDelay);
            window.setTimeout(function () {
              entry.target.classList.add('animated');
            }, delay);
          } else {
            entry.target.classList.add('animated');
          }

          // on animation end, remove will-change
          entry.target.addEventListener('animationend', function mhAnimationCallback() {
            entry.target.style.willChange = 'auto';
            entry.target.removeEventListener('animationend', mhAnimationCallback);
          });

          // stop observing once animated
          animationObserver.unobserve(entry.target);
        }
      });
    }

    // init animation spy
    mhAnimations.forEach(mhAnimation => { animationObserver.observe(mhAnimation) });

  }
})();