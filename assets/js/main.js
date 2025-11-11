const ECeta = (() => {
  const selectors = {
    header: '.header',
    drawer: '.nav-drawer',
    drawerPanel: '.nav-drawer__panel',
    drawerToggle: '[data-drawer-toggle]',
    drawerLinks: '.nav-drawer__link',
    fadeItems: '[data-animate="fade"]'
  };

  const state = {
    observer: null,
    isDrawerOpen: false,
    lastFocusedElement: null,
    focusTrapHandler: null
  };

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const handleScroll = () => {
    const header = document.querySelector(selectors.header);
    if (!header) return;
    const isScrolled = window.scrollY > 10;
    header.classList.toggle('header--scrolled', isScrolled);
  };

  const lockScroll = (shouldLock) => {
    document.body.classList.toggle('is-lock-scroll', shouldLock);
  };

  const setToggleState = (expanded) => {
    document.querySelectorAll(selectors.drawerToggle).forEach((button) => {
      button.setAttribute('aria-expanded', String(expanded));
    });
  };

  const trapFocus = (event) => {
    const drawer = document.querySelector(selectors.drawerPanel);
    if (!drawer) return;
    const focusable = drawer.querySelectorAll(focusableSelectors);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const enableFocusTrap = () => {
    if (state.focusTrapHandler) return;
    state.focusTrapHandler = (event) => trapFocus(event);
    document.addEventListener('keydown', state.focusTrapHandler);
  };

  const disableFocusTrap = () => {
    if (!state.focusTrapHandler) return;
    document.removeEventListener('keydown', state.focusTrapHandler);
    state.focusTrapHandler = null;
  };

  const toggleDrawer = (force) => {
    const drawer = document.querySelector(selectors.drawer);
    const drawerPanel = document.querySelector(selectors.drawerPanel);
    if (!drawer || !drawerPanel) return;

    const willOpen = typeof force === 'boolean' ? force : !state.isDrawerOpen;
    drawer.classList.toggle('nav-drawer--open', willOpen);
    drawer.setAttribute('aria-hidden', String(!willOpen));
    lockScroll(willOpen);
    setToggleState(willOpen);
    state.isDrawerOpen = willOpen;

    if (willOpen) {
      state.lastFocusedElement = document.activeElement;
      const focusable = drawerPanel.querySelectorAll(focusableSelectors);
      if (focusable.length) {
        focusable[0].focus();
      }
      enableFocusTrap();
    } else {
      disableFocusTrap();
      if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
        state.lastFocusedElement.focus();
      }
      state.lastFocusedElement = null;
    }
  };

  const initDrawer = () => {
    const toggleButtons = document.querySelectorAll(selectors.drawerToggle);
    const drawer = document.querySelector(selectors.drawer);
    if (!toggleButtons.length || !drawer) return;

    toggleButtons.forEach((button) => {
      button.addEventListener('click', () => toggleDrawer());
    });

    const drawerLinks = document.querySelectorAll(selectors.drawerLinks);
    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => toggleDrawer(false));
    });

    drawer.addEventListener('click', (event) => {
      if (event.target === drawer) {
        toggleDrawer(false);
      }
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
    const drawer = document.querySelector(selectors.drawer);
    if (drawer) {
      drawer.setAttribute('aria-hidden', 'true');
    }
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
