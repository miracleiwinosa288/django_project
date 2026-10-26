/* Shared light/dark theme handler.
 *
 * Loaded in <head> (not deferred) so the saved theme is applied to <html>
 * before the first paint — no flash of the wrong colour scheme.
 * The choice is remembered in localStorage and shared by the public site
 * and the Django admin.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "irich-theme";
  var root = document.documentElement;

  function readStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* Private mode / storage disabled: the theme just won't persist. */
    }
  }

  function preferredTheme() {
    var stored = readStoredTheme();
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    // Keep Bootstrap 5.3's own colour mode (btn-close, form controls…) in sync.
    root.setAttribute("data-bs-theme", theme);
    root.style.colorScheme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      var isDark = theme === "dark";
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );
      button.setAttribute(
        "title",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );
    });
  }

  // Apply immediately to avoid a flash of the wrong theme.
  applyTheme(preferredTheme());

  // Follow the OS setting until the visitor picks a theme explicitly.
  if (window.matchMedia) {
    var query = window.matchMedia("(prefers-color-scheme: light)");
    var onSystemChange = function (event) {
      if (!readStoredTheme()) {
        applyTheme(event.matches ? "light" : "dark");
      }
    };
    if (query.addEventListener) {
      query.addEventListener("change", onSystemChange);
    } else if (query.addListener) {
      query.addListener(onSystemChange);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(root.getAttribute("data-theme") || preferredTheme());

    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        var next =
          root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        storeTheme(next);
        applyTheme(next);
      });
    });
  });
})();
