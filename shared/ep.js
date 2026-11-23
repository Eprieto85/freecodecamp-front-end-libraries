/* Shared language switcher (EN / ES / FR).
   Each page defines window.EP_PAGE_T = { en: {...}, es: {...}, fr: {...} } BEFORE loading this file.
   - Static text:   <span data-i18n="key"></span>   (and data-i18n-placeholder="key" for inputs)
   - React / JS:    EP.t("key"), and EP.useLang() inside React components to re-render on change
*/
(function () {
  var LANGS = ["en", "es", "fr"];

  var COMMON = {
    en: {
      badge: "freeCodeCamp · Front-End Libraries",
      sig_built: "Built by",
      sig_role: "Front-End Developer in training",
      sig_all: "All projects"
    },
    es: {
      badge: "freeCodeCamp · Bibliotecas Front-End",
      sig_built: "Creado por",
      sig_role: "Desarrollador Front-End en formación",
      sig_all: "Todos los proyectos"
    },
    fr: {
      badge: "freeCodeCamp · Bibliothèques Front-End",
      sig_built: "Créé par",
      sig_role: "Développeur Front-End en formation",
      sig_all: "Tous les projets"
    }
  };

  var PAGE = window.EP_PAGE_T || { en: {}, es: {}, fr: {} };
  var lang = "en";

  try {
    var saved = localStorage.getItem("ep-lang");
    if (LANGS.indexOf(saved) > -1) lang = saved;
  } catch (e) { /* storage may be unavailable */ }

  function t(key) {
    var v = PAGE[lang] && PAGE[lang][key];
    if (v === undefined) v = COMMON[lang][key];
    if (v === undefined) v = (PAGE.en && PAGE.en[key]) || COMMON.en[key];
    return v === undefined ? key : v;
  }

  function apply() {
    document.documentElement.lang = lang;

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].innerHTML = t(nodes[i].getAttribute("data-i18n"));
    }

    var inputs = document.querySelectorAll("[data-i18n-placeholder]");
    for (var j = 0; j < inputs.length; j++) {
      inputs[j].setAttribute("placeholder", t(inputs[j].getAttribute("data-i18n-placeholder")));
    }

    var titleKey = document.body.getAttribute("data-i18n-title");
    if (titleKey) document.title = t(titleKey);

    var buttons = document.querySelectorAll(".ep-lb");
    for (var k = 0; k < buttons.length; k++) {
      buttons[k].classList.toggle("active", buttons[k].getAttribute("data-lang") === lang);
    }
  }

  function setLang(next) {
    if (LANGS.indexOf(next) === -1) return;
    lang = next;
    try { localStorage.setItem("ep-lang", lang); } catch (e) { /* ignore */ }
    apply();
    window.dispatchEvent(new CustomEvent("ep-lang", { detail: lang }));
  }

  window.EP = {
    get lang() { return lang; },
    t: t,
    setLang: setLang,
    // React hook: re-renders the component when the language changes
    useLang: function () {
      var R = window.React;
      var state = R.useState(lang);
      var setState = state[1];
      R.useEffect(function () {
        function onChange(e) { setState(e.detail); }
        window.addEventListener("ep-lang", onChange);
        return function () { window.removeEventListener("ep-lang", onChange); };
      }, []);
      return state[0];
    }
  };

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".ep-lb");
    if (btn) setLang(btn.getAttribute("data-lang"));
  });

  apply();
})();
