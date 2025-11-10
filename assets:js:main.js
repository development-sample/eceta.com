const ECeta = (() => {
  const selectors = {
    header: '.header',
    drawer: '.nav-drawer',
    drawerToggle: '[data-drawer-toggle]',
    drawerLinks: '.nav-drawer__link',
    fadeItems: '[data-animate="fade"]'
  };

  const state = {
    observer: null,
    isDrawerOpen: false
  };

  const handleScroll = () => {
    const header = document.querySelector(selectors.header);
    if (!header) return;
    const isScrolled = window.scrollY > 10;
    header.classList.toggle('header--scrolled', isScrolled);
  };

  const lockScroll = (shouldLock) => {
    document.body.classList.toggle('is-lock-scroll', shouldLock);
  };

  const toggleDrawer = (force) => {
    const drawer = document.querySelector(selectors.drawer);
    if (!drawer) return;
    const willOpen = typeof force === 'boolean' ? force : !state.isDrawerOpen;
    drawer.classList.toggle('nav-drawer--open', willOpen);
    lockScroll(willOpen);
    state.isDrawerOpen = willOpen;
  };

  const initDrawer = () => {
    const toggleButtons = document.querySelectorAll(selectors.drawerToggle);
    if (!toggleButtons.length) return;
    toggleButtons.forEach((button) => {
      button.addEventListener('click', () => toggleDrawer());
    });

    const drawerLinks = document.querySelectorAll(selectors.drawerLinks);
    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => toggleDrawer(false));
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && state.isDrawerOpen) {
        toggleDrawer(false);
      }
    });
  };

  const initFadeObserver = () => {
    const fadeItems = document.querySelectorAll(selectors.fadeItems);
    if (!fadeItems.length) return;

    const reveal = (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    };

    state.observer = new IntersectionObserver(reveal, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.24
    });

    fadeItems.forEach((item) => {
      state.observer.observe(item);
    });
  };

  const init = () => {
    handleScroll();
    initDrawer();
    initFadeObserver();
    window.addEventListener('scroll', handleScroll, { passive: true });
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  ECeta.init();
});