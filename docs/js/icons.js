/**
 * icons.js
 * Lightweight inline-SVG icon set (24x24, stroke-based) used throughout the site.
 * Each icon is plain markup — no build step, no external icon font.
 * Usage: icon('arrow-right', 'w-4 h-4')
 */
(function (global) {
  var ICONS = {
    "chevron-down": '<path d="M6 9l6 6 6-6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "arrow-up-right": '<path d="M7 17L17 7M8 7h9v9"/>',
    check: '<path d="M5 13l4 4L19 7"/>',
    mail: '<path d="M4 5h16v14H4z"/><path d="M4 6l8 7 8-7"/>',
    "map-pin": '<path d="M12 22s7-6.3 7-12a7 7 0 10-14 0c0 5.7 7 12 7 12z"/><circle cx="12" cy="10" r="2.4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    quote: '<path d="M7 8a3 3 0 00-3 3v2a3 3 0 003 3M7 8V7M17 8a3 3 0 00-3 3v2a3 3 0 003 3M17 8V7"/>',
    "file-search": '<path d="M13 3H6v18h12V9z"/><path d="M13 3l6 6h-6z"/><circle cx="10.5" cy="15" r="2.1"/><path d="M12.1 16.6L13.5 18"/>',
    "shield-check": '<path d="M12 3l7 3v6c0 4.6-3 8.2-7 9-4-.8-7-4.4-7-9V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
    radio: '<circle cx="12" cy="12" r="2.2"/><path d="M8.3 15.7a5.6 5.6 0 010-7.4M15.7 8.3a5.6 5.6 0 010 7.4M5.3 18.7a10 10 0 010-13.4M18.7 5.3a10 10 0 010 13.4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4.5a3.2 3.2 0 010 6.3M21 20c0-2.8-2-5.1-4.7-5.8"/>',
    cpu: '<rect x="7" y="7" width="10" height="10" rx="1.2"/><rect x="10" y="10" width="4" height="4"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
    "flask-conical": '<path d="M9 3h6M10 3v6.5L4.7 19a1.8 1.8 0 001.6 2.7h11.4a1.8 1.8 0 001.6-2.7L14 9.5V3"/><path d="M7.5 15h9"/>',
    microscope: '<path d="M6 21h11M9 21v-3.5a4 4 0 118 0M11.5 13.5L8 10a2.6 2.6 0 10-3.6 3.6l1 1"/><path d="M13 6l4 4M15 4l3 3"/>',
    "graduation-cap": '<path d="M2 9.5L12 5l10 4.5-10 4.5-10-4.5z"/><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5"/><path d="M21 9.5V15"/>',
    building: '<rect x="5" y="3" width="14" height="18"/><path d="M9 7h1.4M13.6 7H15M9 11h1.4M13.6 11H15M9 15h1.4M13.6 15H15M10 21v-3h4v3"/>',
    "arrow-right-btn": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "git-branch": '<circle cx="6" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="8" r="2.2"/><path d="M6 7.2V17M6 12c4 0 6-2 6-4.4V9"/><path d="M18 10.2V13"/>',
    "pie-chart": '<path d="M12 3a9 9 0 109 9h-9z"/><path d="M12 3a9 9 0 019 9"/>',
    newspaper: '<rect x="3" y="5" width="13" height="14" rx="1"/><path d="M16 8h5v9a2 2 0 01-2 2H6"/><path d="M6.5 9h6M6.5 12h6M6.5 15h4"/>',
    "book-open": '<path d="M12 6.5c-1.7-1.3-4-2-6.5-2-1 0-1.5.4-1.5 1v11c0 .6.5 1 1.5 1 2.5 0 4.8.7 6.5 2 1.7-1.3 4-2 6.5-2 1 0 1.5-.4 1.5-1v-11c0-.6-.5-1-1.5-1-2.5 0-4.8.7-6.5 2z"/><path d="M12 6.5v13"/>',
    "file-text": '<path d="M13 3H6v18h12V9z"/><path d="M13 3l6 6h-6z"/><path d="M8.5 13h7M8.5 16h7M8.5 10h3"/>',
    award: '<circle cx="12" cy="8" r="5.5"/><path d="M8.7 12.8L7 21l5-2.6L17 21l-1.7-8.2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/>',
    "folder-kanban": '<path d="M3 6.5A1.5 1.5 0 014.5 5H9l2 2.2h8.5A1.5 1.5 0 0121 8.7V18a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18z"/><path d="M8 11v4M12 11v6M16 11v3"/>',
    tags: '<path d="M3 11V4h7l10 10-7 7z"/><circle cx="7" cy="8" r="1.4"/>',
    network: '<circle cx="12" cy="4.5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 6.5V12M12 12L6.4 17.2M12 12l5.6 5.2"/>',
    "check-circle-2": '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.3l2.4 2.4 4.6-5.2"/>',
    "scale": '<path d="M12 3v18M8 21h8M5 7l7-3 7 3M5 7l-3 6a3.2 3.2 0 006 0zM19 7l-3 6a3.2 3.2 0 006 0z"/>',
  };

  function iconMarkup(name, cls, size) {
    var body = ICONS[name] || "";
    var classAttr = cls ? ' class="' + cls + '"' : "";
    var s = size || 24;
    return (
      '<svg' + classAttr + ' width="' + s + '" height="' + s + '" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' + body + "</svg>"
    );
  }

  // Replace every <i data-icon="name" class="..."></i> found in the document with real SVG markup.
  function hydrateIcons(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-icon]");
    nodes.forEach(function (node) {
      var name = node.getAttribute("data-icon");
      var cls = node.getAttribute("data-icon-class") || "";
      var size = node.getAttribute("data-icon-size");
      node.outerHTML = iconMarkup(name, cls, size ? parseInt(size, 10) : undefined);
    });
  }

  global.AubeIcons = { iconMarkup: iconMarkup, hydrateIcons: hydrateIcons };
})(window);
