var search = (function() {

  var bind = {};

  bind.input = function() {
    var searchInput = helper.e(".search-input");
    searchInput.addEventListener("input", function() {
      check();
    }, false);
  };

  bind.clear = function() {
    var searchClear = helper.e(".search-clear");
    searchClear.addEventListener("click", function() {
      mod.searching.close();
      render.clear.input();
      render.clear.button();
      render.searching();
      link.groupAndItems();
    }, false);
  };

  var mod = {};

  mod.searching = {
    open: function() {
      helper.setObject({
        object: state.get.current(),
        path: "search",
        newValue: true
      });
    },
    close: function() {
      helper.setObject({
        object: state.get.current(),
        path: "search",
        newValue: false
      });
    }
  };

  var get = function() {
    var searchInput = helper.e(".search-input");
    var string = searchInput.value.toLowerCase().replace(/\s/g, "");
    if (state.get.current().search) {
      var searchedBookmarks = {
        total: 0,
        matching: []
      };
      searchedBookmarks.total = bookmarks.get().length;
      bookmarks.get().forEach(function(arrayItem, index) {
        var currentGroup = JSON.parse(JSON.stringify(arrayItem));
        var matchingItems = [];
        currentGroup.items.forEach(function(arrayItem, index) {
          var matchUrl = (arrayItem.url != null) && (arrayItem.url.replace(/^https?\:\/\//i, "").replace(/\/$/, "").toLowerCase().includes(string));
          var matchName = (arrayItem.name != null) && (arrayItem.name.toLowerCase().replace(/\s/g, "").includes(string));
          if (matchUrl || matchName) {
            currentGroup.items.splice(index, 1);
            matchingItems.push(JSON.parse(JSON.stringify(arrayItem)));
          };
        });
        if (matchingItems.length > 0) {
          currentGroup.items = matchingItems;
          searchedBookmarks.matching.push(currentGroup);
        };
        var count = 0;
        searchedBookmarks.matching.forEach(function(arrayItem, index) {
          count = count + arrayItem.items.length
        });
        searchedBookmarks.total = count;
      });
      return searchedBookmarks;
    };
  };

  var render = {};

  render.engine = function() {
    var search = helper.e(".search");
    var searchInput = helper.e(".search-input");
    var placeholder = "";
    if (state.get.current().link.show) {
      placeholder = "Find bookmarks or search";
    } else {
      placeholder = "Search";
    };
    placeholder = placeholder + " " + state.get.current().header.search.engine[state.get.current().header.search.engine.selected].name;
    searchInput.setAttribute("placeholder", placeholder);
    search.setAttribute("action", state.get.current().header.search.engine[state.get.current().header.search.engine.selected].url);
  };

  render.clear = {};

  render.clear.input = function() {
    var searchInput = helper.e(".search-input");
    searchInput.value = "";
    searchInput.focus();
  };

  render.clear.button = function() {
    var searchClear = helper.e(".search-clear");
    if (state.get.current().search) {
      searchClear.removeAttribute("disabled");
    } else {
      searchClear.setAttribute("disabled", "");
    };
  };

  render.focus = function() {
    if (state.get.current().header.search.focus) {
      window.addEventListener("load", function(event) {
        helper.e(".search-input").focus();
      });
    };
  };

  render.searching = function() {
    var html = helper.e("html");
    if (state.get.current().search) {
      helper.addClass(html, "is-header-searching");
    } else {
      helper.removeClass(html, "is-header-searching");
    };
  };

  render.check = function() {
    var searchInput = helper.e(".search-input");
    if (searchInput.value.replace(/\s/g, "") != "") {
      mod.searching.open();
    } else {
      mod.searching.close();
    };
  };

  var check = function() {
    render.check();
    render.searching();
    render.clear.button();
    link.groupAndItems();
  };

  var init = function() {
    bind.input();
    bind.clear();
    mod.searching.close();
    render.engine();
    render.focus();
    render.searching();
  };

  // exposed methods
  return {
    init: init,
    get: get,
    render: render,
    check: check
  };

})();
