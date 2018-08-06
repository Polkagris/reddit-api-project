// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"reddit-api.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  search: function search(searchTerm, searchLimit, sortBy) {
    console.log('It works..!');
    // Fetch the reddit-api by searchTerm, limit and sort
    return fetch('http://www.reddit.com/search.json?q=' + searchTerm + '&limit=' + searchLimit + '&sort=' + sortBy)
    // Graps the results as json
    .then(function (res) {
      return res.json();
    })
    // Grabs the data and maps out only the data in the array
    .then(function (data) {
      return data.data.children.map(function (data) {
        return data.data;
      });
    }).catch(function (err) {
      return console.log(err);
    });
    console.log(data.data.children);
  }
};
},{}],"index.js":[function(require,module,exports) {
'use strict';

var _redditApi = require('./reddit-api');

var _redditApi2 = _interopRequireDefault(_redditApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchForm = document.getElementById('search-form');
// Grab input text
// Declare reddit
var searchInput = document.getElementById('search-input');

// Add event listener to search input
searchForm.addEventListener('submit', function (e) {
  // Grab search-term
  var searchTerm = searchInput.value;
  // Grab sort-by: new and relevance depending on checked
  var sortBy = document.querySelector('input[name="sortby"]:checked').value;
  // Get limit
  var searchLimit = document.querySelector('#limit').value;

  // Check if input is empty
  if (searchInput.value == '') {
    // Run function that shows a message with two parameters: message and className
    showMessage('Please fill in the search-field', 'alert-danger');
  }

  // Clear seach field
  searchInput.value = '';

  // Search reddit
  _redditApi2.default.search(searchTerm, searchLimit, sortBy).then
  // Grab the data in results
  (function (results) {
    console.log(results);
    // Variable to store the results from the search
    var output = '<div class="card-columns">';

    // Loop through each object and append content
    results.forEach(function (post) {
      // Check if there is an image, if not set it to generic reddit icon-image
      var image = post.preview ? post.preview.images[0].source.url : 'https://cdn.vox-cdn.com/thumbor/FXJtC7HR05_Eweus_7SQVdTleOk=/0x0:640x427/1200x800/filters:focal(269x163:371x265)/cdn.vox-cdn.com/uploads/chorus_image/image/59028817/reddit_logo_640.0.jpg';
      // If image is not there use reddit image
      // Output HTML content
      output += '<div class="card">\n                <img class="card-img-top" src=' + image + ' alt="Card image cap">\n                <div class="card-body">\n                <h5 class="card-title">' + post.title + '</h5>\n                <p class="card-text">' + short(post.selftext, 100) + '</p>\n                <a href=' + post.url + ' target="_blank" class="btn btn-primary">Read more</a>\n                <hr><span class="badge badge-secondary">Subreddit: ' + post.subreddit + '</span>\n                <span class="badge badge-dark">Score: ' + post.score + '</span>\n              </div>\n          </div>';
    });

    // Append closing div tag to output
    output += '</div>';
    // Set results-div to res and set its innerHTML to output
    var res = document.getElementById('results');
    res.innerHTML = output;
  });
  // Prevent from submitting
  e.preventDefault();
});

// Show alert message function
function showMessage(message, className) {
  // If alert already exists return nothing
  if (document.querySelector('.alert') !== null) {
    return;
  }
  // Create div that holds the alert message
  var dangerDiv = document.createElement('div');
  // Create the content that is to be displayed
  // dangerDiv.classList.add(`alert ${className}`);
  //dangerDiv.className(`alert ${className}`);
  dangerDiv.className = 'alert ' + className;
  dangerDiv.appendChild(document.createTextNode(message));
  // Grab parent element to dangerDiv
  var parentElementBefore = document.getElementById('search-container');
  var searchElement = document.getElementById('search');
  //  Insert new div into parent element bedre searchElement
  parentElementBefore.insertBefore(dangerDiv, searchElement);
  // Timeout function - display alert for 1 seconds then remove element
  setTimeout(function () {
    document.querySelector('.alert').remove();
  }, 2000);
}

// Truncate selftext over 100 characters - function
function short(text, limit) {
  var shortened = text.indexOf(" ", limit);
  if (shortened == -1) return text;
  return text.substring(0, shortened);
};
},{"./reddit-api":"reddit-api.js"}],"..\\..\\..\\AppData\\Roaming\\npm\\node_modules\\parcel-bundler\\src\\builtins\\hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '54149' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["..\\..\\..\\AppData\\Roaming\\npm\\node_modules\\parcel-bundler\\src\\builtins\\hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/reddit-api.24cc92b2.map