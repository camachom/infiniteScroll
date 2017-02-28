/* jshint indent: false, maxlen: false */
// allow data-pin-media on sourceless images for hoverbuttons

export default function (w, d, a) {
  debugger;
  var $ = w[a.k] = {
    'a': a,
    'd': d,
    'w': w,
    's': {},
    'f': (function () {
      return {

        // an empty array for callbacks to be added later
        callback : [],

        // console.log only if debug is on
        debug: function (obj, force) {
          if ($.v.config.debug || force) {
            if ($.w.console && $.w.console.log) {
              $.w.console.log(obj);
            } else {
              $.d.URL = $.d.URL + '#' + obj;
            }
          }
        },

        // add and remove event listeners in a cross-browser fashion
        listen : function (el, ev, fn, detach) {
          if (!detach) {
            // add listener
            if (typeof $.w.addEventListener !== 'undefined') {
              el.addEventListener(ev, fn, false);
            } else if (typeof $.w.attachEvent !== 'undefined') {
              el.attachEvent('on' + ev, fn);
            }
          } else {
            // remove listener
            if (typeof el.removeEventListener !== 'undefined') {
              el.removeEventListener(ev, fn, false);
            } else if (typeof el.detachEvent !== 'undefined') {
              el.detachEvent('on' + ev, fn);
            }
          }
        },

        // find an event's target element
        // via PPK (http://www.quirksmode.org/js/events_properties.html)
        getEl: function (e) {
          var el = null;
          if (e.target) {
            el = (e.target.nodeType === 3) ? e.target.parentNode : e.target;
          } else {
            el = e.srcElement;
          }
          return el;
        },

        // get a DOM property or text attribute
        get: function (el, att) {
          var v = '';
          if (typeof el[att] === 'string') {
            v = el[att];
          } else {
            v = el.getAttribute(att);
          }
          return v;
        },

        // get a data: attribute
        getData: function (el, att) {
          att = $.a.dataAttributePrefix + att;
          return $.f.get(el, att);
        },

        // set a DOM property or text attribute
        set: function (el, att, string) {
          if (typeof el[att] === 'string') {
            el[att] = string;
          } else {
            el.setAttribute(att, string);
          }
        },

        // create a DOM element
        make: function (obj) {
          var el = false, tag, att;
          for (tag in obj) {
            if (obj[tag].hasOwnProperty) {
              el = $.d.createElement(tag);
              for (att in obj[tag]) {
                if (obj[tag][att].hasOwnProperty) {
                  if (typeof obj[tag][att] === 'string') {
                    $.f.set(el, att, obj[tag][att]);
                  }
                }
              }
              break;
            }
          }
          return el;
        },

        // remove a DOM element
        kill: function (obj) {
          if (typeof obj === 'string') {
            obj = $.d.getElementById(obj);
          }
          if (obj && obj.parentNode) {
            obj.parentNode.removeChild(obj);
          }
        },

        // replace one DOM element with another
        replace: function (before, after) {
          if (typeof before === 'object' && typeof after === 'object') {
            $.w.setTimeout(function () {
              before.parentNode.insertBefore(after, before);
              $.w.setTimeout(function() {
                $.f.kill(before);
              }, 1);
            }, 1);
          }
        },

        // parse an URL, return values for specified keys in the query string
        parse: function (str, keys) {
          var query, pair, part, i, n, v, ret;
          ret = {};
          // remove url hash, split to find query
          query = str.split('#')[0].split('?');
          // found query?
          if (query[1]) {
            // split to pairs
            pair = query[1].split('&');
            // loop through pairs
            for (i = 0, n = pair.length; i < n; i = i + 1){
              // split on equals
              part = pair[i].split('=');
              // found exactly two parts?
              if (part.length === 2) {
                // first part is key; do we have a match in keys?
                if (keys[part[0]]) {
                  // attempt to decode this
                  try {
                    v = decodeURIComponent(part[1]);
                  } catch (e) {
                    v = part[1];
                  }
                  // yes: set return value for key to second part, which is value
                  ret[part[0]] = v;
                }
              }
            }
          }
          return ret;
        },

        // stop the default event action
        preventDefault: function(v) {
          if (v.preventDefault) {
            v.preventDefault();
          } else {
            v.returnValue = false;
          }
        },

        // return moz, webkit, ms, etc
        getVendorPrefix: function () {
          var x = /^(moz|webkit|ms)(?=[A-Z])/i;
        	var r = '';
        	for (var p in $.d.b.style) {
        		if (x.test(p)) {
        			r = '-' + p.match(x)[0].toLowerCase() + '-';
        			break;
        		}
        	}
        	return r;
        },

        // call an API endpoint; fire callback if specified
        call: function (url, callback) {
          var n, id, tag, msg, sep = '?';

          // $.f.callback starts as an empty array
          n = $.f.callback.length;

          // new SCRIPT tags get IDs so we can find them, query them, and delete them later
          id = $.a.k + '.f.callback[' + n + ']';

          // the callback will fire only when the API returns
          $.f.callback[n] = function (r) {
            // do we have output?
            if (r) {
              // do we need to log an error?
              if (r.status && r.status === 'failure') {
                // some errors don't have messages; fall back to status
                msg = r.message || r.status;
                // has the site operator specified a callback?
                if (typeof $.v.config.error === 'string') {
                  // does the callback function actually exist?
                  if (typeof $.w[$.v.config.error] === 'function') {
                    $.w[$.v.config.error](msg);
                  }
                }
                // scope gotcha: recreate id string from n instead of relying on it already being in id
                tag = $.d.getElementById($.a.k + '.f.callback[' + n + ']');
                // found it?
                if (tag) {
                  // does it have a src attribute?
                  if (tag.src) {
                    // log only the URL part
                    $.f.log('&type=api_error&code=' + r.code + '&msg=' + msg + '&url=' + encodeURIComponent(tag.src.split('?')[0]));
                  }
                }
              } else {
                // if a callback exists, pass the API output
                if (typeof callback === 'function') {
                  callback(r, n);
                }
              }
            }
            // clean up the SCRIPT tag after it's run
            $.f.kill(id);
          };

          // some calls may come with a query string already set
          if (url.match(/\?/)) {
            sep = '&';
          }

          // make and call the new SCRIPT tag
          $.d.b.appendChild( $.f.make({'SCRIPT': {
              'id': id,
              'type': 'text/javascript',
              'charset': 'utf-8',
              'src': url + sep + 'callback=' + id
            }
          }));
        },

        // super-light base-64 encoder; guaranteed to choke on Unicode
        // via Dave Chambers (https://github.com/davidchambers/Base64.js)
        btoa: function (s) {
          var d = 'data:image/svg+xml;base64,';
          if ($.w.btoa) {
            d = d + $.w.btoa(s);
          } else {
            for (
              var a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', b, c, i = 0;
              s.charAt(i | 0) || (a = '=', i % 1);
              d = d + a.charAt(63 & b >> 8 - i % 1 * 8)
            ) {
              c = s.charCodeAt(i += .75);
              b = b << 8 | c;
            }
          }
          return d;
        },

        // turn a path and some values into an SVG
        makeSVG: function (obj, fill) {
          var i, n, svg;

          // start svg
          svg = '<svg xmlns="http://www.w3.org/2000/svg" height="%h%px" width="%w%px" viewBox="%x1% %y1% %x2% %y2%"><g>';

          // height and width
          svg = svg.replace(/%h%/, obj.h);
          svg = svg.replace(/%w%/, obj.w);

          // view box defaults to 0, 0, w, h but can be overriden (side count bubble)
          svg = svg.replace(/%x1%/, obj.x1 || '0');
          svg = svg.replace(/%y1%/, obj.y1 || '0');
          svg = svg.replace(/%x2%/, obj.x2 || obj.w);
          svg = svg.replace(/%y2%/, obj.y2 || obj.h);

          // compute svg data for each path (round Pinterest logo has two)
          for (i = 0, n = obj.p.length; i < n; i = i + 1) {

            // start the path
            svg = svg + '<path d="' + obj.p[i].d + '"';

            // use alternate fill color if specified (white Pin It logotype)
            svg = svg + ' fill="#' + (fill || obj.p[i].f || '#000') + '"';

            // use stroke if specified (count bubbles)
            if (obj.p[i].s) {
              svg = svg + ' stroke="#' + obj.p[i].s + '" stroke-width="2"';
            }

            // done
            svg = svg + '></path>';
          }

          // end svg
          svg = svg + '</g></svg>';
          return $.f.btoa(svg);
        },

        // build stylesheet
        buildStyleSheet : function () {
          var css, rules, k, re, repl;
          css = $.f.make({'STYLE': {'type': 'text/css'}});
          rules = $.v.css;
          // each rule has our randomly-created key at its root to minimize style collisions
          rules = rules.replace(/\._/g, '.' + a.k + '_')

          // strings to replace in CSS rules
          var repl = {
            '%widgetBorderRadius%': '5px',
            '%buttonBorderRadius%': '3px',
            '%buttonBorderRadiusTall%': '3px',
            // SVG replacements
            '%above%': $.f.makeSVG($.a.svg.above),
            '%beside%': $.f.makeSVG($.a.svg.beside),
            '%likes%': $.f.makeSVG($.a.svg.likes),
            '%repins%': $.f.makeSVG($.a.svg.repins),
            '%menu%': $.f.makeSVG($.a.svg.menu),
            '%logo%': $.f.makeSVG($.a.svg.logo),
            '%pinterest%': $.f.makeSVG($.a.svg.pinterest),
            '%pinit_en_red%': $.f.makeSVG($.a.svg.pinit_en),
            '%pinit_en_white%': $.f.makeSVG($.a.svg.pinit_en, 'fff'),
            '%pinit_ja_red%': $.f.makeSVG($.a.svg.pinit_ja),
            '%pinit_ja_white%': $.f.makeSVG($.a.svg.pinit_ja, 'fff'),
            '%prefix%': $.f.getVendorPrefix()
          }

          $.f.makeSVG($.a.svg.pinit_en, 'fff');

          // replace everything in repl throughout rules
          for (k in repl) {
            if (repl[k].hasOwnProperty) {
              // re = new RegExp(k, 'g');
              rules = rules.replace(new RegExp(k, 'g'), repl[k]);
            }
          }

          // add rules to stylesheet
          if (css.styleSheet) {
            css.styleSheet.cssText = rules;
          } else {
            css.appendChild($.d.createTextNode(rules));
          }
          // add stylesheet to page
          if ($.d.h) {
            $.d.h.appendChild(css);
          } else {
            $.d.b.appendChild(css);
          }
        },

        // recursive function to make rules out of a Sass-like object
        presentation: function (obj, str) {
          // make CSS rules
          var name, i, k, pad, key, rules = '', selector = str || '';
          for (k in obj) {
            if (obj[k].hasOwnProperty) {
              // found a rule
              if (typeof obj[k] === 'string') {
                rules = rules + '\n  ' + k + ': ' + obj[k] + ';';
              }
            }
          }
          // add selector and rules to stylesheet
          if (selector && rules) {
            $.v.css = $.v.css + selector + ' { ' + rules + '\n}\n';
          }
          // any children we need to handle?
          for (k in obj) {
            if (obj[k].hasOwnProperty) {
              if (typeof obj[k] === 'object') {
                // replace & with parent selector
                // var key = k.replace(/&/g, selector);
                key = selector + ' ' + k;
                key = key.replace(/ &/g, '');
                key = key.replace(/,/g, ', ' + selector);
                $.f.presentation(obj[k], key);
              }
            }
          }
          // if this is our root, remove from current context and make stylesheet
          if (obj === $.a.styles) {
            $.w.setTimeout(function() {
              $.f.buildStyleSheet();
            }, 1);
          }
        },

        // send logging information
        log: function (str) {
          // query always starts with guid
          var query = '?guid=' + $.v.guid;
          // add test version if found
          if ($.a.tv) {
            query = query + '&tv=' + $.a.tv;
          }
          // add optional string &foo=bar
          if (str) {
            query = query + str;
          }
          // add user-specified logging tag, if present
          if ($.v.config.tag) {
            query = query + '&tag=' + $.v.config.tag;
          }
          // add the page we're looking at right now
          query = query + '&via=' + encodeURIComponent($.v.here);
          $.f.call($.a.endpoint.log + query);
        },

        // build a query
        buildQuery: function(params) {
          var query = '';
          for (var key in params) {
            if (params.hasOwnProperty(key) && params[key]) {
              if (query) {
                query = query + '&';
              }
              query = query + key + '=' + encodeURIComponent(params[key]);
            }
          }
          return query;
        },

        // things that happen on click, exposed for site operators to call if needed
        util: {
          // open pinmarklet
          pinAny: function () {
            $.f.debug('opening the grid');
            // TODO: send domain
            $.d.b.appendChild($.f.make({
              'SCRIPT': {
                'type': 'text/javascript',
                'charset': 'utf-8',
                'pinMethod': 'button',
                'guid': $.v.guid,
                'src': $.a.endpoint.bookmark + '?r=' + Math.random() * 99999999
              }
            }));
          },
          // pin an image
          pinOne: function (o) {
            if (o.href) {
              // parsing an URL, pinning
              var q = $.f.parse(o.href, {'url': true, 'media': true, 'description': true});
              // found valid URLs?
              if (q.url && q.url.match(/^http/i) && q.media && q.media.match(/^http/i)) {
                // log an error for Pin It buttons that don't have default descriptions
                if (!q.description) {
                  $.f.log('&type=config_warning&warning_msg=no_description&href=' + encodeURIComponent($.d.URL));
                  q.description = $.d.title;
                }
                // pop the pin form
                $.w.open(o.href, 'pin' + new Date().getTime(), $.a.pop.base.replace('%dim%', $.a.pop.small));
              } else {
                // log an error
                $.f.log('&type=config_error&error_msg=invalid_url&href=' + encodeURIComponent($.d.URL));
                // fire up the bookmarklet and hope for the best
                $.f.util.pinAny();
              }
            } else {
              // we're pinning an image
              if (o.media) {
                if (!o.url) {
                  $.f.log('&type=config_warning&warning_msg=no_url&href=' + encodeURIComponent($.d.URL));
                  o.url = $.d.URL;
                }
                if (!o.description) {
                  $.f.log('&type=config_warning&warning_msg=no_description&href=' + encodeURIComponent($.d.URL));
                  o.description = $.d.title;
                }
                // pop the pin form
                $.f.log('&type=button_pinit_custom');
                o.href = $.v.config.pinterest + '/pin/create/button/?guid=' + $.v.guid + '&url=' + encodeURIComponent(o.url) + '&media=' + encodeURIComponent(o.media) + '&description=' + encodeURIComponent(o.description);
                $.w.open(o.href, 'pin' + new Date().getTime(), $.a.pop.base.replace('%dim%', $.a.pop.small));
              } else {
                // no media
                $.f.log('&type=config_error&error_msg=no_media&href=' + encodeURIComponent($.d.URL));
                $.f.util.pinAny();
              }
            }
          },
          // open repin dialog from hoverbutton
          repinHoverButton: function (id) {
            $.f.util.repin(id, true);
          },
          // open repin dialog
          repin: function (data, fromHover) {
            var href, logType, pinId, pinterest;
            pinterest = $.v.config.pinterest;
            if (typeof data === 'object') {
              if (data.href) {
                pinterest = 'https://' + data.href.split('/')[2];
                pinId = data.href.split('/')[4];
              }
            } else {
              pinId = data;
            }
            if (parseInt(pinId)) {
              var href = pinterest + $.a.path.repin.replace('%s', pinId) + '?guid=' + $.v.guid;
              $.w.open(href, 'pin' + new Date().getTime(), $.a.pop.base.replace('%dim%', $.a.pop.small));
            } else {
              $.f.debug($.v.config.util + '.repin requires an integer pinId');
            }
          },
          // open follow dialog
          follow: function (o) {
            $.w.open(o.href, 'pin' + new Date().getTime(), $.a.pop.base.replace('%dim%', $.a.pop.large));
          },
          // play or pause animated GIF
          play: function (o) {
            var img = o.el.previousSibling;
            if (o.el.className.match('_playing')) {
              o.el.className = $.a.k + '_control ' + $.a.k + '_paused';
              img.style.backgroundImage = 'url(' + $.f.getData(img, 'src') + ')';
            } else {
              o.el.className = $.a.k + '_control ' + $.a.k + '_playing';
              img.style.backgroundImage = 'url(' + $.f.getData(o.el, 'src') + ')';
            }
          },
          // open the three-dot menu
          menu: function (o) {
            var menu = o.el.nextSibling;
            if (menu.style.display === 'block') {
              menu.style.display = '';
            } else {
              menu.style.display = 'block';
            }
          },
          // send a log request
          log: function(params) {
            if (params) {
              $.f.log('&' + $.f.buildQuery(params));
            } else {
              $.f.debug($.v.config.util + '.log requires valid query params');
            }
          }
        },

        // build a complex element from a JSON template
        buildOne: function (obj, el) {
          if (!el) {
            var root = $.f.make({
              'SPAN':{
                'className': $.a.k + '_' + obj.className.replace(/ /g, ' ' + $.a.k + '_')
              }
            });
            $.f.buildOne(obj, root);
            return root;
          } else {
            if ( obj && obj.length) {
              for (var i = 0; i < obj.length; i = i + 1) {
                $.f.buildOne(obj[i], el);
              }
            } else {
              for (var key in obj) {
                if (typeof obj[key] === 'string') {
                  // set an attribute
                  var value = obj[key];
                  if (key === 'text') {
                    el.innerHTML = value;
                  }
                  if (key === 'addClass') {
                    el.className = el.className + ' ' + $.a.k + '_' +  value;
                  }
                  if ($.a.build.setStyle[key]) {
                    if (key === 'backgroundImage') {
                      el.style[key] = 'url(' + value + ')';
                      $.f.set(el, 'data-pin-src', value);
                    } else {
                      el.style[key] = value;
                    }
                  }
                  if ($.a.build.setData[key]) {
                    $.f.set(el, 'data-pin-' + key, value);
                  }
                } else {
                  // create a new container
                  var child = $.f.make({
                    'SPAN': {
                      'className': $.a.k + '_' + key.replace(/ /g, ' ' + $.a.k),
                      'data-pin-href': $.f.getData(el, 'href'),
                      'data-pin-log': $.f.getData(el, 'log')
                  }});
                  if (key === 'embed') {
                    var embed = obj[key];
                    if (embed.type && embed.type === 'gif') {
                      // it's an animated gif
                      el.appendChild($.f.make({'SPAN': {
                        'className': $.a.k + '_control ' + $.a.k + '_paused',
                        'data-pin-log': 'embed_pin_play',
                        'data-pin-src': embed.src
                      }}));
                    } else {
                      if (embed.src) {
                        el.appendChild($.f.make({'IFRAME': {
                          'className': $.a.k + '_iframe',
                          'src': embed.src.replace(/autoplay=/i, 'nerfAutoPlay=')
                        }}));
                      }
                    }
                  } else {
                    el.appendChild(child);
                    $.f.buildOne(obj[key], child);
                  }
                }
              }
            }
          }
        },

        // a click!
        click: function (v) {
          v = v || $.w.event;
          var el, log, x, pinId, href;
          el = $.f.getEl(v);
          if (el) {
            log = $.f.getData(el, 'log');
            // custom buttons with child nodes may not pass clicks; check one level up
            if (!log && el.parentNode) {
              el = el.parentNode;
              log = $.f.getData(el, 'log');
            }
            // is it one of ours?
            if (log) {
              x = $.f.getData(el, 'x') || '';
              href = $.f.getData(el, 'href');
              if (x) {
                x = '&x=' + encodeURIComponent(x);
              }
              $.f.log('&type=' + log + x + '&href=' + encodeURIComponent(href));
              if (typeof $.f.util[$.a.util[log]] === 'function') {
                // got a special utility handler? run it
                $.f.util[$.a.util[log]]({'el': el, 'href': href});
              } else {
                if (href) {
                  // some elements are controls, like pause/play and menu toggle; they won't open new pages
                  $.w.open(href, '_blank');
                }
              }
            }
          }
        },

        // BEGIN HOVERBUTTON-RELATED STUFF

        // return the selected text, if any
        getSelection: function () {
          return ("" + ($.w.getSelection ? $.w.getSelection() : $.d.getSelection ? $.d.getSelection() : $.d.selection.createRange().text)).replace(/(^\s+|\s+$)/g, "");
        },

        // return current style property for element
        // via PPK (http://www.quirksmode.org/dom/getstyles.html)
        getStyle: function (el, prop, getNum) {
          var r = null;
          // modern browsers
          if ($.w.getComputedStyle) {
            r = $.w.getComputedStyle(el).getPropertyValue(prop);
          } else {
            // IE browsers
            if (el.currentStyle) {
              r = el.currentStyle[prop];
            }
          }
          // if we only want the numeric part, shave off px
          if (r && getNum) {
            r = parseInt(r) || 0;
          }
          return r;
        },

        // get the natural position of an element
        // via PPK (http://www.quirksmode.org/js/findpos.html)
        getPos: function (el) {
          var html, marginTop, paddingTop, marginLeft, paddingLeft;
          var x = 0, y = 0;
          if (el.offsetParent) {
            do {
              x = x + el.offsetLeft;
              y = y + el.offsetTop;
            } while (el = el.offsetParent);
            // add padding or margin set to the HTML element - fixes Wordpress admin toolbar
            if (!$.v.hazIE) {
              var html = $.d.getElementsByTagName('HTML')[0];
              var marginTop = $.f.getStyle(html, "margin-top", true) || 0;
              var paddingTop = $.f.getStyle(html, "padding-top", true) || 0;
              var marginLeft = $.f.getStyle(html, "margin-left", true) || 0;
              var paddingLeft = $.f.getStyle(html, "padding-left", true) || 0;
              x = x + (marginLeft + paddingLeft);
              y = y + (marginTop + paddingTop);
            }
            return {"left": x, "top": y};
          }
        },

        // show hoverbutton
        showHoverButton: function (el) {
          // always try to kill it
          $.f.kill($.s.hoverButton);

          // get config options
          var c = {
            'id': $.f.getData(el, 'id'),
            'url': $.f.getData(el, 'url'),
            'media': $.f.getData(el, 'media'),
            'description': $.f.getData(el, 'description'),
            'height': $.f.getData(el, 'height') || $.v.config.height || '20',
            'color': $.f.getData(el, 'color') || $.v.config.color || 'gray',
            'shape': $.f.getData(el, 'shape') || $.v.config.shape || 'rect',
            'lang': $.v.config.lang,
            // new params
            'tall': $.f.getData(el, 'tall') || $.v.config.tall,
            'round': $.f.getData(el, 'round') || $.v.config.round
          };

          // legacy translations
          if (c.height === '28') {
            c.tall = true;
          }
          if (c.shape === 'round') {
            c.round = true;
          }

          // size > 120x120?
          if (el.height > $.a.hoverButtonMinImgSize && el.width > $.a.hoverButtonMinImgSize) {

            // make it fresh each time; this pays attention to individual image config options
            var buttonClass = $.a.k + '_button_pin';
            if (c.tall) {
              buttonClass = buttonClass + ' ' + $.a.k + '_tall';
            }
            if (c.round) {
              buttonClass = buttonClass + ' ' + $.a.k + '_round';
            } else {
              if (c.color === 'red' || c.color === 'white') {
                buttonClass = buttonClass + ' ' + $.a.k + '_' + c.color;
              }
              if (c.lang === 'ja') {
                buttonClass = buttonClass + ' ' + $.a.k + '_ja';
              }
            }

            // get position, start href
            var p = $.f.getPos(el), href, log;

            if (c.id) {
              href = $.v.config.pinterest + $.a.path.repin.replace(/%s/, c.id);
              log = 'button_pinit_floating_repin';
            } else {
              // set the button href
              href = $.v.config.pinterest + $.a.path.create + 'guid=' + $.v.guid;
              href = href + '&url=' + encodeURIComponent(c.url || $.d.URL);
              href = href + '&media=' + encodeURIComponent(c.media || el.src);
              href = href + '&description=' + encodeURIComponent($.f.getSelection() || c.description || el.title || el.alt || $.d.title);
              log = 'button_pinit_floating';
            }

            $.s.hoverButton = $.f.make({'SPAN': {
              'className': buttonClass,
              'data-pin-log': log,
              'data-pin-href': href
            }});

            // add ID if we're repinning
            if (c.id) {
              $.f.set($.s.hoverButton, 'data-pin-id', c.id);
            }

            // set height and position
            $.s.hoverButton.style.position = 'absolute';
            $.s.hoverButton.style.top = (p.top + $.a.hoverButtonOffsetTop) + 'px';
            $.s.hoverButton.style.left = (p.left + $.a.hoverButtonOffsetLeft) + 'px';
            $.s.hoverButton.style.zIndex = '8675309';

            $.d.b.appendChild($.s.hoverButton);

          }
        },

        // mouse over; only active if we have hoverbuttons
        over: function (v) {
          var t, el, src;
          t = v || $.w.event;
          el = $.f.getEl(t);
          if (el) {
            src = $.f.getData(el, 'media') || el.src;
            if (el.tagName === 'IMG' && src && !src.match(/^data/) && !$.f.getData(el, 'no-hover') && !$.f.get(el, 'nopin') && !$.f.getData(el, 'nopin')) {
              // we are inside an image
              if (!$.v.hazHoverButton) {
                // show the hoverbutton
                $.v.hazHoverButton = true;
              }
              $.f.showHoverButton(el);
            } else {
              // we are outside an image. Do we need to hide the hoverbutton?
              if ($.v.hazHoverButton) {
                // don't hide the hoverbutton if we are over it
                if (el !== $.s.hoverButton) {
                  // hide it
                  $.v.hazHoverButton = false;
                  $.f.kill($.s.hoverButton);
                }
              }
            }
          }
        },

        // END HOVERBUTTON-RELATED STUFF

        // each kind of widget has its own structure
        structure: {
          buttonPin: function (r, options) {
            var template, formatCount, formattedCount, sep;
            // turn a raw number into a shortened pin count
            formatCount = function (n) {
              if (!n) {
                n = '0';
              } else {
                if (n > 999) {
                  if (n < 1000000) {
                    n = parseInt(n / 1000, 10) + 'K+';
                  } else {
                    if (n < 1000000000) {
                      n = parseInt(n / 1000000, 10) + 'M+';
                    } else {
                      n = '++';
                    }
                  }
                }
              }
              n = n + '';
              return n;
            };
            template = {
              'className': 'button_pin',
              'log': options.log
            };
            if (options.id) {
              template.id = options.id;
            }
            if (options.log === 'button_pinit') {
              template.href = options.pinterest + '/pin/create/button/?guid=' + $.v.guid + '-' + $.v.countButton + '&url=' + encodeURIComponent(options.url) + '&media=' + encodeURIComponent(options.media) + '&description=' + encodeURIComponent(options.description);
            }
            if (options.log === 'button_pinit_bookmarklet') {
              template.href = options.pinterest + '/pin/create/button/';
            }
            if (options.log === 'button_pinit_repin') {
              template.href = options.pinterest + '/pin/' + options.id + '/repin/x/?guid=' + $.v.guid;
            } else {
              if (options.count) {
                // show count if positive, or configured to show above, or configured to show beside with data-pin-zero set
                if (r.count || options.count === 'above' || (options.count === 'beside' && options.zero)) {
                  formattedCount = formatCount(r.count);
                  template.className = template.className + ' ' + options.count;
                  // data-pin-x will log as an extra parameter when the button is clicked
                  template.x = formattedCount;
                  template.count = {
                    'text': formattedCount,
                    // data-pin-x needed here too because counts are clickable
                    'x': formattedCount
                  }
                }
              }
            }

            if (options.padded) {
              template.className = template.className + ' padded';
            }
            if (options.round) {
              template.className = template.className + ' round';
            } else {
              if (options.lang === 'ja') {
                template.className = template.className + ' ja';
              }
              if (options.color === 'red') {
                template.className = template.className + ' red';
              }
              if (options.color === 'white') {
                template.className = template.className + ' white';
              }
            }

            if (options.tall) {
              template.className = template.className + ' tall';
            }

            return $.f.buildOne(template);
          },
          buttonFollow: function (r, options) {
            var template = {
              'className': 'button_follow',
              'log': 'button_follow',
              'text': r.name
            };
            if (options.tall) {
              template.className = template.className + ' tall';
            }
            if (r.id.match(/\//)) {
              // found a forward-slash? follow a board
              template.href = options.pinterest + '/' + r.id + '/follow/?guid=' + $.v.guid;
            } else {
              // no forward-slash? follow a pinner
              template.href = options.pinterest + '/' + r.id + '/pins/follow/?guid=' + $.v.guid;
            }
            $.v.countFollow = $.v.countFollow + 1;
            return $.f.buildOne(template);
          },
          embedGrid: function (r, options) {
            var p, template, colHeight, i, pin, minValue, minIndex, j, buttonUrl, buttonLog, boardUrl, str, tt, labelClass, labelContent, profileUrl;
            if (r.data) {
              p = r.data;
              if (!options.columns || options.columns < 1 || options.columns > 10) {
                options.columns = 5;
              }
              if (options.height < 200) {
                options.height = 340;
              }

              // profileUrl is not internationalized by API; fix inline
              profileUrl = options.pinterest + '/' + p.user.profile_url.split('pinterest.com/')[1];

              template = {
                'className': 'embed_grid c' + options.columns,
                'log': 'embed_grid',
                'href': options.pinterest,
                'hd': {
                  'href': profileUrl,
                  'img': {
                    'backgroundImage': p.user.image_small_url.replace(/_30.jpg/, '_60.jpg')
                  },
                  'pinner': {
                    'text': p.user.full_name
                  }
                },
                'bd': {
                  'height': (options.height - 110)+ 'px',
                  'ct': []
                },
                'ft': {
                  'log':  'embed_user_ft',
                  'href': profileUrl + 'pins/follow/?guid=' + $.v.guid,
                  'button': {}
                }
              }

              if (options.noscroll) {
                template.className = template.className + ' noscroll';
              }

              if (options.width) {
                template.width = options.width + 'px';
              }

              // masonry layout
              colHeight = [];
              for (i = 0; i < options.columns; i = i + 1) {
                template.bd.ct.push({'col': []});
                colHeight[i] = 0;
              }
              for (i = 0; i < p.pins.length; i = i + 1) {
                pin = p.pins[i];
                minValue = colHeight[0];
                minIndex = 0;
                for (j = 0; j < options.columns; j = j + 1) {
                  if (colHeight[j] < minValue) {
                    minIndex = j;
                    minValue = colHeight[j];
                  }
                }
                template.bd.ct[minIndex].col.push({
                  'img': {
                    'href': options.pinterest + '/pin/' + pin.id,
                    'backgroundImage': pin.images['237x'].url,
                    'backgroundColor': pin.dominant_color,
                    'paddingBottom': (pin.images['237x'].height / pin.images['237x'].width) * 100 + '%'
                  }
                });
                colHeight[minIndex] = colHeight[minIndex] + pin.images['237x'].height;
              }

              // follow button
              if (p.board) {
                // it's a board
                template.className = template.className + ' board';
                boardUrl = options.pinterest + p.board.url;
                template.hd.board = {
                  'text': p.board.name,
                  'href': boardUrl
                }
                buttonUrl = boardUrl + 'follow/?guid=' + $.v.guid;
                buttonLog = 'embed_board_ft';
                template.ft.href = buttonUrl;
                $.v.countBoard = $.v.countBoard + 1;
              } else {
                // it's a profile
                buttonUrl = profileUrl + 'pins/follow?guid=' + $.v.guid;
                buttonLog = 'embed_user_ft';
                $.v.countProfile = $.v.countProfile + 1;
              }

              // follow button label
              str = $.a.strings[options.lang].followOn;
              tt = str.split('%s');

              // if class is "bottom" break text above button at narrow widths
              labelClass = 'bottom';
              labelContent = '<span class="' + $.a.k + '_string" data-pin-href="' + buttonUrl + '" data-pin-log="' + buttonLog + '">' + tt[0] + '</span><span class="' + $.a.k + '_logo" data-pin-href="' + buttonUrl + '" data-pin-log="' + buttonLog + '"></span>';
              if (tt[0] === '') {
                // if class is "top" break text below button at narrow widths
                labelClass = 'top';
                labelContent = '<span class="' + $.a.k + '_logo" data-pin-href="' + buttonUrl + '" data-pin-log="' + buttonLog + '"></span><span class="' + $.a.k + '_string" data-pin-href="' + buttonUrl + '" data-pin-log="' + buttonLog + '">' + tt[1] + '</span>';
              }
              // render HTML outside of buildOne -- dangerous but necessary
              template.ft.button.label = {
                'addClass': labelClass,
                'text': labelContent
              }
              return $.f.buildOne(template);
            }
          },
          embedPin: function (r, options) {
            var p, template, langMod, widthMain, widthMod, thumb;
            if (r.data && r.data[0]) {
              p = r.data[0];
              if (p.error) {
                $.f.log('&type=api_error&code=embed_pin_not_found&pin_id=' + p.id);
                return false;
              }
              if (!p.rich_metadata) {
                p.rich_metadata = {};
              }
              langMod = '';
              widthMain = '';
              widthMod = '';
              thumb = {
                'url': p.images['237x'].url,
                'height': p.images['237x'].height,
                'width': p.images['237x'].width
              };

              if (options.width && (options.width === 'medium' || options.width === 'large')) {
                widthMain = ' ' + options.width;
                widthMod = '_' + options.width;
                // add to medium and large embedded pin counts
                if (options.width === 'medium') {
                  thumb.url = thumb.url.replace(/237x/, '345x');
                  thumb.width = 345;
                  thumb.height = ~~(thumb.height * 1.456);
                  $.v.countPinMedium = $.v.countPinMedium + 1;
                }
                if (options.width === 'large') {
                  thumb.url = thumb.url.replace(/237x/, '600x');
                  thumb.width = 600;
                  thumb.height = ~~(thumb.height * 2.532);
                  $.v.countPinLarge = $.v.countPinLarge + 1;
                }
              }
              if (options.lang) {
                langMod = ' ' + options.lang;
              }
              template = {
                'className': 'embed_pin' + widthMain + langMod,
                'log': 'embed_pin' + widthMod,
                'href': options.pinterest + '/pin/' + p.id + '/',
                'id': p.id,
                'bd': {
                  'hd': {
                    // main container; gets padding for proper height
                    'container': {
                      'paddingBottom': ~~(thumb.height / thumb.width * 10000) / 100 + '%',
                      // main image
                      'img': {
                        'backgroundImage': thumb.url,
                        // log a different value for image
                        'log': 'embed_pin_img'  + widthMod
                      }
                    },
                    // Pin It button
                    'repin': {
                      // log a different value for button
                      'log': 'embed_pin_repin' + widthMod,
                      'id': p.id
                    }
                  },
                  // rich pin data
                  'source': {
                    'log': 'embed_pin_domain',
                    'href': p.rich_metadata.url || options.pinterest + '/pin/' + p.id + '/',
                    // favicon
                    'img': {
                      'backgroundImage': p.rich_metadata.favicon_link || ''
                    },
                    'domain': {
                      'text': p.rich_metadata.site_name || $.a.strings[options.lang]['from'].replace(/%s/, p.domain)
                    },
                    // copyright report form
                    'menu': {
                      // empty value here means "render an empty span with className toggle"
                      'toggle': {
                        'href': '',
                        'log': 'embed_pin_toggle'
                      },
                      // dropdown is the containing bubble
                      'dropdown': {
                        // the actual text string. when value = %, set it to strings[key]
                        'text': $.a.strings[options.lang].report,
                        'log': 'embed_pin_report',
                        'href': options.pinterest + $.a.path.report + '?id=' + p.id
                      }
                    }
                  }
                },
                'ft': {
                  'href': p.pinner.profile_url.replace(/https?:\/\/www\.pinterest\.com\//, options.pinterest + '/'),
                  'log': 'embed_pin_pinner' + widthMod,
                  'img': {
                    'backgroundImage': p.pinner.image_small_url.replace(/30/, '60')
                  },
                  'pinner': {
                    'text': p.pinner.full_name
                  },
                  'board': {
                    'href': options.pinterest +  p.board.url,
                    'log': 'embed_pin_board' + widthMod,
                    'text': p.board.name
                  }
                }
              };
              if (!options.terse) {
                // optional pin description; hidden when data-pin-terse is set
                template.bd.description = {
                  'text': p.description
                }
              }
              // if there's no rich data, give the domain some room
              if (!p.rich_metadata.favicon_link) {
                template.bd.source.addClass = 'nofav';
              }
              // old-school Flickr / YouTube media attribution
              if (p.attribution && p.attribution.author_name && p.attribution.author_url) {
                // super-paranoid here; we have seen some attribution objects with null members
                template.bd.attribution = {
                  'href': p.attribution.author_url,
                  'log': 'embed_pin_attrib',
                  // favicon
                  'img': {
                    'backgroundImage': p.attribution.provider_icon_url
                  },
                  // translated string
                  'by': {
                    'text': $.a.strings[options.lang]['by'].replace(/%s/, p.attribution.author_name)
                  }
                }
              }
              // swap in embedded media?
              if (p.embed && p.embed.src) {
                template.bd.hd.container.embed =  p.embed;
              }
              // repins / likes
              if (p.repin_count || p.like_count) {
                template.bd.stats = {};
                if (p.repin_count) {
                  template.bd.stats.repins = {
                    'text': '' + p.repin_count,
                    'href': options.pinterest + '/pin/' + p.id + '/repins/'
                  }
                }
                if (p.like_count) {
                  template.bd.stats.likes = {
                    'text': '' + p.like_count,
                    'href': options.pinterest + '/pin/' + p.id + '/likes/'
                  }
                }
              }
              $.v.countPin = $.v.countPin + 1;
              return $.f.buildOne(template);
            }
          }
        },

        getLegacy: {
          grid: function (a, o) {
            var scaleHeight = parseInt($.f.getData(a, 'scale-height'));
            var scaleWidth = parseInt($.f.getData(a, 'scale-width'));
            var boardWidth = parseInt($.f.getData(a, 'board-width'));
            // don't force the board to be wider than the containing parent
            if (boardWidth > a.parentNode.offsetWidth) {
              boardWidth = '';
            }
            // scaleHeight is the height of the grid container in legacy
            // to make it full height, add 110
            if (scaleHeight) {
              o.height = scaleHeight + 110;
            }
            if (scaleWidth && boardWidth) {
              // operator has specified column width and grid width, so we can get column count
              if (scaleWidth > 59 && scaleWidth < 238) {
                o.columns = Math.floor(boardWidth / scaleWidth);
                // o.width will be set as max-width on the main container
                o.width = boardWidth + 20;
              }
            }
          },
          buttonPin: function (a, o) {

            // seek legacy attributes
            var c = {
              'zero': $.f.getData(a, 'zero') || $.v.config.zero,
              'pad': $.f.getData(a, 'count-pad'),
              'height': $.f.getData(a, 'height'),
              'shape': $.f.getData(a, 'shape'),
              'config': $.f.getData(a, 'config'),
              // here we use $.f.get because it's count-layout, not data-pin-count-layout
              'countLayout': $.f.get(a, 'count-layout')
            };

            // operator has specifically told us to show zero counts
            if (c.zero) {
              o.zero = true;
            }

            if (o.count) {
              // operator is using new count position, so always pad and show zero counts
              o.padded = true;
              o.zero = true;
            } else {
              if (c.pad) {
               // operator has specifically told us to pad under count bubbles
                o.padded = true;
              }
              // find count position -- elderly buttons may have data-pin-config or count-layout
              if (c.config === 'beside' || c.countLayout === 'horizontal') {
                o.count = 'beside';
              } else {
                if (c.config === 'above' || c.countLayout === 'vertical') {
                  o.count = 'above';
                }
              }
            }

            // translate valid shapes into round = true
            if (c.shape === 'round') {
              o.round = true;
            }

            // translate valid tall heights into tall = true
            if (c.height === '28' || c.height === '32') {
              o.tall = true;
            }
          }
        },

        seek: {
          buttonPin: function (a) {

            var p, o, r, k;

            // community-generated standard: data-pin-do="none" means "don't render a button here"
            if ($.a.noneParam[$.f.getData(a, 'do')] === true) {
              $.f.debug('Found a link to pin create form with data-pin-do="none"');
              return;
            }

            // can we parse the href and get url, media, and description?
            if (a.href) {
              p = $.f.parse(a.href, {'url': true, 'media': true, 'description': true});
            }

            // get all the things
            o = {
              'do': $.f.getData(a, 'do'),
              'id': $.f.getData(a, 'id'),
              'url': $.f.getData(a, 'url') || p.url || $.d.URL,
              'media': $.f.getData(a, 'media') || p.media,
              'description': $.f.getData(a, 'description') || p.description || $.d.title,
              'custom': $.f.getData(a, 'custom') || $.v.config.custom,
              'count': $.f.getData(a, 'count') || $.v.config.count,
              'color': $.f.getData(a, 'color') || $.v.config.color,
              'round': $.f.getData(a, 'round') || $.v.config.round,
              'tall': $.f.getData(a, 'tall') || $.v.config.tall,
              'lang': $.f.getData(a, 'lang'),
              'domain': $.f.getData(a, 'domain')
            };

            $.f.fixDomain(o);

            // how to tell what kind of button we need to make
            if (o.media) {
              // it's a properly-configured Any Image button
              o.log = 'button_pinit';
            } else {
              if (o.id) {
                // it's a repin button
                o.log = 'button_pinit_repin';
              } else {
                // it's a bookmark button
                o.log = 'button_pinit_bookmarklet';
              }
            }

            // increment here so we count custom buttons
            $.v.countButton = $.v.countButton + 1;

            // custom button: remove href, listen for click
            if (o.custom) {
              // remove href, prevent default behavior
              a.removeAttribute('href');
              // tell us what to log
              $.f.set(a, 'data-pin-log', 'button_pinit');
              // o.pinterest, o.url, o.media, and o.description have already been parsed and set
              $.f.set(a, 'data-pin-href', o.pinterest + '/pin/create/button' +
                         '?guid=' + $.v.guid + '-' + $.v.countButton +
                         '&url=' + encodeURIComponent(o.url) +
                         '&media=' + encodeURIComponent(o.media) +
                         '&description=' + encodeURIComponent(o.description));
              $.f.debug('Found a link with data-pin-custom="true"');
              $.f.debug(a);
              return;
            } else {
              $.f.getLegacy.buttonPin(a, o);
              k = false;
              if (o.count === 'above' || o.count === 'beside') {
                k = true;
                if (o.url) {
                  // get a count from the url argument
                  $.f.call($.a.endpoint.count.replace(/%s/, encodeURIComponent(o.url)), function (r) {
                    $.f.replace(a, $.f.structure.buttonPin(r, o));
                  });
                }
              }

              // we have not made a call to count.json; build now
              if (!k) {
                var s = $.f.structure.buttonPin(a, o);
                $.f.replace(a, s);
              }
            }

          },
          buttonBookmark: function (a) {
            if ($.f.getData(a, 'custom')) {
              $.f.set(a, 'data-pin-log', 'button_pinit_bookmarklet');
              $.f.set(a, 'data-pin-href', $.v.config.pinterest + '/pin/create/button/');
              a.removeAttribute('href');
              return;
            } else {
              // send it over to buttonPin, which will know it's a bookmark button
              $.f.seek.buttonPin(a);
            }
          },
          buttonFollow: function (a) {
            var p, k, o, r, href;
            r = {};
            o = {
              'custom': $.f.getData(a, 'custom'),
              'tall': $.f.getData(a, 'tall'),
              'lang': $.f.getData(a, 'lang'),
              'domain': $.f.getData(a, 'domain')
            };

            $.f.fixDomain(o);

            p = a.href.split('pinterest.com/');
            if (p[1]) {
              k = p[1].split('/');
              if (k[0]) {
                r.name = a.innerHTML;
                r.id = k[0];
                if (k[0] && k[1]) {
                  r.id = k[0] + '/' + k[1];
                }
                if (o.custom) {
                  if (r.id.match(/\//)) {
                    // found a forward-slash? follow a board
                    href = o.pinterest + '/' + r.id + '/follow/?guid=' + $.v.guid;
                  } else {
                    // no forward-slash? follow a pinner
                    href = o.pinterest + '/' + r.id + '/pins/follow/?guid=' + $.v.guid;
                  }
                  $.f.set(a, 'data-pin-href', href);
                  $.f.set(a, 'data-pin-log', 'button_follow');
                  $.w.setTimeout(function () {
                    a.removeAttribute('href');
                  }, 1);
                  $.f.debug('Found a link with data-pin-custom="true"');
                  return;
                } else {
                  var s = $.f.structure.buttonFollow(r, o);
                  $.f.replace(a, s);
                }
              }
            }
          },
          embedBoard: function (a) {
            var p, k, u, o, w, bs;
            p = a.href.split('pinterest.com/');
            if (p[1]) {
              k = p[1].split('/');
              if (k[0] && k[1]) {
                u = k[0] + '/' + k[1];
                o = {
                  'columns': $.f.getData(a, 'columns') || $.v.config.grid.columns,
                  'height': $.f.getData(a, 'height') - 0 || $.v.config.grid.height,
                  'width': $.f.getData(a, 'width') || null,
                  'noscroll': $.f.getData(a, 'noscroll') || null,
                  'lang': $.f.getData(a, 'lang'),
                  'domain': $.f.getData(a, 'domain')
                };

                $.f.fixDomain(o);

                $.f.getLegacy.grid(a, o);

                bs = '';
                if ($.w.location.protocol === 'https:') {
                  bs='&base_scheme=https';
                }

                $.f.call($.a.endpoint.board.replace(/%s/, u) + '?sub=' + o.domain + bs, function (r) {
                  $.f.replace(a, $.f.structure.embedGrid(r, o));
                });
              }
            }
          },
          embedUser: function (a) {
            var p, k, u, o, bs;
            p = a.href.split('pinterest.com/');
            if (p[1]) {
              k = p[1].split('/');
              o = {
                'columns': $.f.getData(a, 'columns') || $.v.config.grid.columns,
                'height': $.f.getData(a, 'height') - 0 || $.v.config.grid.height,
                'width': $.f.getData(a, 'width') || null,
                'noscroll': $.f.getData(a, 'noscroll') || null,
                'lang': $.f.getData(a, 'lang'),
                'domain': $.f.getData(a, 'domain')
              };

              $.f.fixDomain(o);

              $.f.getLegacy.grid(a, o);

              bs = '';
              if ($.w.location.protocol === 'https:') {
                bs='&base_scheme=https';
              }

              $.f.call($.a.endpoint.user.replace(/%s/, k[0]) + '?sub=' + o.domain + bs, function (r) {
                $.f.replace(a, $.f.structure.embedGrid(r, o));
              });
            }
          },
          embedPin: function (a) {
            var p, k, u, o, bs;
            p = a.href.split('pinterest.com/');
            if (p[1]) {
              k = p[1].split('/');
              if (k[1]) {
                o = {
                  'width': $.f.getData(a, 'width') || null,
                  'terse': $.f.getData(a, 'terse') || null,
                  'lang': $.f.getData(a, 'lang'),
                  'domain': $.f.getData(a, 'domain')
                };

                $.f.fixDomain(o);

                bs = '';
                if ($.w.location.protocol === 'https:') {
                  bs='&base_scheme=https';
                }

                $.f.call($.a.endpoint.pin.replace(/%s/, k[1]) + '&sub=' + o.domain + bs, function (r) {
                  $.f.replace(a, $.f.structure.embedPin(r, o));
                });
              }
            }
          }
        },

        // find elements that need to be turned into buttons or widgets
        build: function (el) {
          var t, a, i, n, href, doThis;
          // no element passed? use document
          if (!el) {
            el = $.d;
          }
          // collect all the links
          t = el.getElementsByTagName('A');
          // collection to array
          a = [];
          for (i = 0; i < t.length; i = i + 1) {
            if (t[i].href) {
              a.push(t[i]);
            }
          }
          // loop and check
          for (i = 0, n = a.length; i < n; i = i + 1) {
            href = a[i].href;
            // does it match to pinterest domain
            if (href.match($.a.myDomain)) {
              // do we have a data-pin-do directive?
              doThis = $.f.getData(a[i], 'do');
              // does data-pin-do correspond to a function we're ready to run?
              if (typeof $.f.seek[doThis] === 'function') {
                $.f.seek[doThis](a[i]);
                continue;
              }
              // do we need to build a legacy button?
              if (href.match(/\/pin\/create\/button\//)) {
                $.f.seek.buttonPin(a[i]);
                continue;
              }
              // do we need to build a custom button?
              if ($.f.getData(a[i], 'custom')) {
                $.f.seek.buttonPin(a[i]);
                continue;
              }
            }
          }
        },

        exposeUtil: function() {
          // expose all util functions
          var util = $.w[$.v.config.util] = $.f.util;
          // expose build function
          if ($.v.config.build) {
            $.f.debug('exposing $.f.build as ' + $.v.config.build);
            util.build = $.w[$.v.config.build];
          } else {
            $.f.debug('exposing $.f.build at ' + $.v.config.util + '.build');
            util.build = $.f.build;
          }
        },

        // fix up domain and language; create o.pinterest
        fixDomain: function (o) {
          // do we have these strings?
          if (!$.a.strings[o.lang]) {
            o.lang = $.v.config.lang;
          }
          if (o.domain) {
            // got something from individual widget; check it
            if (!$.a.validDomain[o.domain]) {
              o.domain = $.v.config.domain;
            }
          } else {
            // use the domain sent in script config, deduced from lang attribute on HTML tag, or default (www)
            o.domain = $.v.config.domain;
          }
          o.pinterest = 'https://' + o.domain + '.pinterest.com';
        },

        // find and apply configuration requests from surrounding page, plus those passed as data attributes on SCRIPT tag
        config: function () {
          var script = $.d.getElementsByTagName('SCRIPT'), i, j, n, p, lang, rootLang, domain;

          // check the HTML tag for a lang attribute
          lang = $.d.getElementsByTagName('HTML')[0].getAttribute('lang');
          // not found, look for a META tag
          if (!lang) {
            var meta = $.d.getElementsByTagName('META');
            for (i = 0, n = meta.length; i < n; i = i + 1) {
              var equiv = $.f.get(meta[i], 'http-equiv');
              if (equiv) {
                // match content-language or Content-Language
                equiv = equiv.toLowerCase();
                if (equiv === 'content-language') {
                  var content = $.f.get(meta[i], 'content');
                  if (content) {
                    lang = content;
                    break;
                  }
                }
              }
            }
          }

          // nothing? use default
          if (!lang) {
            lang = $.a.defaults.lang;
          }
          lang = lang.toLowerCase();
          rootLang = lang.split('-')[0];

          // try to find a valid domain for this language
          domain = $.a.langToDomain[lang] || $.a.langToDomain[rootLang] || $.a.defaults.domain;

          // confirm that we have strings for this language
          if (!$.a.strings[lang]) {
            lang = rootLang
            if (!$.a.strings[lang]) {
              lang = $.a.defaults.lang;
            }
          }

          // get all config params by finding data-pin- attributes on pinit.js
          for (i = script.length - 1; i > -1; i = i - 1) {
            // is it us?
            if ($.a.me && script[i] && script[i].src && script[i].src.match($.a.me)) {
              // loop through all possible config params
              for (j = 0; j < $.a.configParam.length; j = j + 1) {
                p = $.f.getData(script[i], $.a.configParam[j]);
                if (p) {
                  // set or overwrite config param with contents
                  $.v.config[$.a.configParam[j]] = p;
                }
              }
              // burn after reading to prevent future calls from re-reading config params
              $.f.kill(script[i]);
            }
          }

          // did the site operator attempt to set a lang with data-pin-lang on pinit.js?
          if ($.v.config.lang) {
            // check that it's valid (don't bother checking first syllable of lang; operators need to give us a valid string)
            if (!$.a.strings[$.v.config.lang]) {
              // lang has already been deduced from HTML or META tag, validated, and set to $.a.defaults.lang if invalid
              $.f.debug($.v.config.lang + ' not found in valid languages, changing back to ' + lang);
              $.v.config.lang = lang;
            }
          } else {
            // lang has already been deduced from HTML or META tag, validated, and set to $.a.defaults.lang if invalid
            $.v.config.lang = lang;
          }

          // did the site operator attempt to set a domain with data-pin-domain on pinit.js?
          if ($.v.config.domain) {
            // check that it's valid
            if (!$.a.validDomain[$.v.config.domain]) {
              // domain has already been deduced from lang, validated, and set to $.a.defaults.domain if invalid
              $.f.debug($.v.config.domain + ' not found in valid domains, changing it to ' + $.a.langToDomain[$.v.config.lang]);
              $.v.config.domain = $.a.langToDomain[$.v.config.lang];
            }
          } else {
            // domain has already been deduced from lang, validated, and set to $.a.defaults.domain if invalid
            $.v.config.domain = domain;
          }

          // build utility
          if (typeof $.v.config.build === 'string') {
            $.w[$.v.config.build] = function (el) {
              $.f.build(el);
            };
          }

          // filter user-specified logging tag
          if ($.v.config.tag) {
            $.v.config.tag = $.v.config.tag.replace(/[^a-zA-Z0-9_]/g, '').substr(0, 32);
          }

          // global Pinterest URL will be used in most places; we will have to update URLs we get from API endpoints in widgets
          $.v.config.pinterest = 'https://' + $.v.config.domain + '.pinterest.com';

          // wait one second and then send a logging ping
          $.w.setTimeout(function () {
            var str = '&type=pidget&sub=' + $.v.config.domain + '&button_count=' + $.v.countButton + '&follow_count=' + $.v.countFollow + '&pin_count=' + $.v.countPin;
            if ($.v.countPinMedium) {
              str = str + '&pin_count_medium=' + $.v.countPinMedium;
            }
            if ($.v.countPinLarge) {
              str = str + '&pin_count_large=' + $.v.countPinLarge;
            }
            str = str + '&profile_count=' + $.v.countProfile + '&board_count=' + $.v.countBoard;
            str = str + '&lang=' + $.v.config.lang;
            // were we called by pinit.js?
            if (typeof $.w['PIN_' + ~~(new Date().getTime() / 86400000)] !== 'number') {
              str = str + '&xload=1';
            }
            $.f.log(str);
          }, 1000);

        },

        init: function () {

          var i, dq = false;

          $.d.b = $.d.getElementsByTagName('BODY')[0];
          $.d.h = $.d.getElementsByTagName('HEAD')[0];
          $.v = {
            'guid': '',
            'css': '',
            'config': {
              'debug': false,
              'util': 'PinUtils',
              'grid': {
                'height': 400,
                'columns': 3
              }
            },
            'userAgent': $.w.navigator.userAgent,
            'lang': 'en',
            'urls': $.a.urls,
            'here': $.d.URL.split('#')[0],
            'countButton': 0,
            'countFollow': 0,
            'countPin': 0,
            'countPinMedium': 0,
            'countPinLarge': 0,
            'countBoard': 0,
            'countProfile': 0
          };

          // make a 12-digit base-60 number for conversion tracking
          for (i = 0; i < 12; i = i + 1) {
            $.v.guid = $.v.guid + '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz'.substr(Math.floor(Math.random() * 60), 1);
          }

          // got IE?
          if ($.v.userAgent.match(/MSIE/) !== null) {
            $.v.hazIE = true;
            // got very old IE?
            if ($.v.userAgent.match(/MSIE [5-8]/)) {
              dq = true;
              $.f.log('&type=oldie_error&ua=' + encodeURIComponent($.v.userAgent));
            }
          }

          // sorry, no love for Internet Explorer 8 and below
          if (!dq) {

            // find any configuration parameters that may have been added to the call on pinit.js
            $.f.config();

            // make stylesheets
            $.f.presentation($.a.styles);

            // find elements
            $.f.build();

            // add a single event listener to the body for minimal impact
            $.f.listen($.d.b, 'click', $.f.click);

            // need hoverbuttons?
            if ($.v.config.hover) {
              $.v.countButton = $.v.countButton + 1;
              // we set this so our browser extensions know not to render hoverbuttons
              $.d.b.setAttribute('data-pin-hover', true);
              $.f.listen($.d.b, 'mouseover', $.f.over);
            }

            // expose utility functions
            $.f.exposeUtil();
          }
        }
      };
    }())
  };
  $.f.init();
}
