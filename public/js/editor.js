$(document).ready(function () {

	/**
	 * WYSIWYG - jQuery plugin 0.97
	 * (0.97.2 - From infinity)
	 *
	 * Copyright (c) 2008-2009 Juan M Martinez, 2010-2011 Akzhan Abdulin and all contributors
	 * https://github.com/akzhan/jwysiwyg
	 *
	 * Dual licensed under the MIT and GPL licenses:
	 *   http://www.opensource.org/licenses/mit-license.php
	 *   http://www.gnu.org/licenses/gpl.html
	 *
	 */

	/*jslint browser: true, forin: true */

	(function ($) {
		"use strict"; /* Wysiwyg namespace: private properties and methods */

		var console = window.console ? window.console : {
			log: $.noop,
			error: function (msg) {
				$.error(msg);
			}
		};
		var supportsProp = (('prop' in $.fn) && ('removeProp' in $.fn));

		function Wysiwyg() {
			this.controls = {
				bold: {
					groupIndex: 0,
					visible: false,
					tags: ["b", "strong"],
					css: {
						fontWeight: "bold"
					},
					tooltip: "Bold",
					hotkey: {
						"ctrl": 1,
						"key": 66
					}
				},

				copy: {
					groupIndex: 8,
					visible: false,
					tooltip: "Copy"
				},

				colorpicker: {
					visible: false,
					groupIndex: 1,
					tooltip: "Colorpicker",
					exec: function() {
						$.wysiwyg.controls.colorpicker.init(this);
					}
				},

				createLink: {
					groupIndex: 6,
					visible: false,
					exec: function () {
						var self = this;
						if ($.wysiwyg.controls && $.wysiwyg.controls.link) {
							$.wysiwyg.controls.link.init(this);
						} else if ($.wysiwyg.autoload) {
							$.wysiwyg.autoload.control("wysiwyg.link.js", function () {
								self.controls.createLink.exec.apply(self);
							});
						} else {
							console.error("$.wysiwyg.controls.link not defined. You need to include wysiwyg.link.js file");
						}
					},
					tags: ["a"],
					tooltip: "Create link"
				},

				cut: {
					groupIndex: 8,
					visible: false,
					tooltip: "Cut"
				},

				decreaseFontSize: {
					groupIndex: 9,
					visible: false,
					tags: ["small"],
					tooltip: "Decrease font size",
					exec: function () {
						this.decreaseFontSize();
					}
				},

				h1: {
					groupIndex: 7,
					visible: false,
					className: "h1",
					command: ($.browser.msie || $.browser.safari || $.browser.opera) ? "FormatBlock" : "heading",
					"arguments": ($.browser.msie || $.browser.safari || $.browser.opera) ? "<h1>" : "h1",
					tags: ["h1"],
					tooltip: "Header 1"
				},

				h2: {
					groupIndex: 7,
					visible: false,
					className: "h2",
					command: ($.browser.msie || $.browser.safari || $.browser.opera) ? "FormatBlock" : "heading",
					"arguments": ($.browser.msie || $.browser.safari || $.browser.opera) ? "<h2>" : "h2",
					tags: ["h2"],
					tooltip: "Header 2"
				},

				h3: {
					groupIndex: 7,
					visible: false,
					className: "h3",
					command: ($.browser.msie || $.browser.safari || $.browser.opera) ? "FormatBlock" : "heading",
					"arguments": ($.browser.msie || $.browser.safari || $.browser.opera) ? "<h3>" : "h3",
					tags: ["h3"],
					tooltip: "Header 3"
				},
				h4: {
					groupIndex: 7,
					visible: false,
					className: "h4",
					command: ($.browser.msie || $.browser.safari || $.browser.opera) ? "FormatBlock" : "heading",
					"arguments": ($.browser.msie || $.browser.safari || $.browser.opera) ? "<h4>" : "h4",
					tags: ["h4"],
					tooltip: "Header 4"
				},

				h5: {
					groupIndex: 7,
					visible: false,
					className: "h5",
					command: ($.browser.msie || $.browser.safari || $.browser.opera) ? "FormatBlock" : "heading",
					"arguments": ($.browser.msie || $.browser.safari || $.browser.opera) ? "<h5>" : "h5",
					tags: ["h5"],
					tooltip: "Header 5"
				},

				h6: {
					groupIndex: 7,
					visible: false,
					className: "h6",
					command: ($.browser.msie || $.browser.safari || $.browser.opera) ? "FormatBlock" : "heading",
					"arguments": ($.browser.msie || $.browser.safari || $.browser.opera) ? "<h6>" : "h6",
					tags: ["h6"],
					tooltip: "Header 6"
				},

				highlight: {
					tooltip: "Highlight",
					className: "highlight",
					groupIndex: 1,
					visible: false,
					css: {
						backgroundColor: "rgb(255, 255, 102)"
					},
					exec: function () {
						var command, node, selection, args;

						if ($.browser.msie || $.browser.safari) {
							command = "backcolor";
						} else {
							command = "hilitecolor";
						}

						if ($.browser.msie) {
							node = this.getInternalRange().parentElement();
						} else {
							selection = this.getInternalSelection();
							node = selection.extentNode || selection.focusNode;

							while (node.style === undefined) {
								node = node.parentNode;
								if (node.tagName && node.tagName.toLowerCase() === "body") {
									return;
								}
							}
						}

						if (node.style.backgroundColor === "rgb(255, 255, 102)" || node.style.backgroundColor === "#ffff66") {
							args = "#ffffff";
						} else {
							args = "#ffff66";
						}

						this.editorDoc.execCommand(command, false, args);
					}
				},

				html: {
					groupIndex: 10,
					visible: false,
					exec: function () {
						var elementHeight;

						if (this.options.resizeOptions && $.fn.resizable) {
							elementHeight = this.element.height();
						}

						if (this.viewHTML) {
							this.setContent(this.original.value);

							$(this.original).hide();
							this.editor.show();

							if (this.options.resizeOptions && $.fn.resizable) {
								// if element.height still the same after frame was shown
								if (elementHeight === this.element.height()) {
									this.element.height(elementHeight + this.editor.height());
								}

								this.element.resizable($.extend(true, {
									alsoResize: this.editor
								}, this.options.resizeOptions));
							}

							this.ui.toolbar.find("li").each(function () {
								var li = $(this);

								if (li.hasClass("html")) {
									li.removeClass("active");
								} else {
									li.removeClass('disabled');
								}
							});
						} else {
							this.saveContent();

							$(this.original).css({
								width: this.element.outerWidth() - 6,
								height: this.element.height() - this.ui.toolbar.height() - 6,
								resize: "none"
							}).show();
							this.editor.hide();

							if (this.options.resizeOptions && $.fn.resizable) {
								// if element.height still the same after frame was hidden
								if (elementHeight === this.element.height()) {
									this.element.height(this.ui.toolbar.height());
								}

								this.element.resizable("destroy");
							}

							this.ui.toolbar.find("li").each(function () {
								var li = $(this);

								if (li.hasClass("html")) {
									li.addClass("active");
								} else {
									if (false === li.hasClass("fullscreen")) {
										li.removeClass("active").addClass('disabled');
									}
								}
							});
						}

						this.viewHTML = !(this.viewHTML);
					},
					tooltip: "View source code"
				},

				increaseFontSize: {
					groupIndex: 9,
					visible: false,
					tags: ["big"],
					tooltip: "Increase font size",
					exec: function () {
						this.increaseFontSize();
					}
				},

				insertImage: {
					groupIndex: 6,
					visible: false,
					exec: function () {
						var self = this;

						if ($.wysiwyg.controls && $.wysiwyg.controls.image) {
							$.wysiwyg.controls.image.init(this);
						} else if ($.wysiwyg.autoload) {
							$.wysiwyg.autoload.control("wysiwyg.image.js", function () {
								self.controls.insertImage.exec.apply(self);
							});
						} else {
							console.error("$.wysiwyg.controls.image not defined. You need to include wysiwyg.image.js file");
						}
					},
					tags: ["img"],
					tooltip: "Insert image"
				},

				insertOrderedList: {
					groupIndex: 5,
					visible: false,
					tags: ["ol"],
					tooltip: "Insert Ordered List"
				},

				insertTable: {
					groupIndex: 6,
					visible: false,
					exec: function () {
						var self = this;

						if ($.wysiwyg.controls && $.wysiwyg.controls.table) {
							$.wysiwyg.controls.table(this);
						} else if ($.wysiwyg.autoload) {
							$.wysiwyg.autoload.control("wysiwyg.table.js", function () {
								self.controls.insertTable.exec.apply(self);
							});
						} else {
							console.error("$.wysiwyg.controls.table not defined. You need to include wysiwyg.table.js file");
						}
					},
					tags: ["table"],
					tooltip: "Insert table"
				},

				insertUnorderedList: {
					groupIndex: 5,
					visible: false,
					tags: ["ul"],
					tooltip: "Insert Unordered List"
				},

				italic: {
					groupIndex: 0,
					visible: false,
					tags: ["i", "em"],
					css: {
						fontStyle: "italic"
					},
					tooltip: "Italic",
					hotkey: {
						"ctrl": 1,
						"key": 73
					}
				},

				justifyLeft: {
					visible: false,
					groupIndex: 1,
					css: {
						textAlign: "left"
					},
					tooltip: "Justify Left"
				},

				justifyCenter: {
					groupIndex: 1,
					visible: false,
					tags: ["center"],
					css: {
						textAlign: "center"
					},
					tooltip: "Justify Center"
				},

				justifyRight: {
					groupIndex: 1,
					visible: false,
					css: {
						textAlign: "right"
					},
					tooltip: "Justify Right"
				},

				justifyFull: {
					groupIndex: 1,
					visible: false,
					css: {
						textAlign: "justify"
					},
					tooltip: "Justify Full"
				},

				ltr: {
					groupIndex: 9,
					visible: false,
					exec: function () {
						var p = this.dom.getElement("p");

						if (!p) {
							return false;
						}

						$(p).attr("dir", "ltr");
						return true;
					},
					tooltip: "Left to Right"
				},

				rtl: {
					groupIndex: 9,
					visible: false,
					exec: function () {
						var p = this.dom.getElement("p");

						if (!p) {
							return false;
						}

						$(p).attr("dir", "rtl");
						return true;
					},
					tooltip: "Right to Left"
				},

				indent: {
					groupIndex: 2,
					visible: false,
					tooltip: "Indent"
				},

				outdent: {
					groupIndex: 2,
					visible: false,
					tooltip: "Outdent"
				},

				insertHorizontalRule: {
					groupIndex: 5,
					visible: false,
					tags: ["hr"],
					tooltip: "Insert Horizontal Rule"
				},

				paragraph: {
					groupIndex: 7,
					visible: false,
					className: "paragraph",
					command: "FormatBlock",
					"arguments": ($.browser.msie || $.browser.safari || $.browser.opera) ? "<p>" : "p",
					tags: ["p"],
					tooltip: "Paragraph"
				},

				paste: {
					groupIndex: 8,
					visible: false,
					tooltip: "Paste"
				},

				undo: {
					groupIndex: 4,
					visible: false,
					tooltip: "Undo"
				},

				redo: {
					groupIndex: 4,
					visible: false,
					tooltip: "Redo"
				},

				removeFormat: {
					groupIndex: 10,
					visible: false,
					exec: function () {
						this.removeFormat();
					},
					tooltip: "Remove formatting"
				},


				underline: {
					groupIndex: 0,
					visible: false,
					tags: ["u"],
					css: {
						textDecoration: "underline"
					},
					tooltip: "Underline",
					hotkey: {
						"ctrl": 1,
						"key": 85
					}
				},

				strikeThrough: {
					groupIndex: 0,
					visible: false,
					tags: ["s", "strike"],
					css: {
						textDecoration: "line-through"
					},
					tooltip: "Strike-through"
				},

				subscript: {
					groupIndex: 3,
					visible: false,
					tags: ["sub"],
					tooltip: "Subscript"
				},

				superscript: {
					groupIndex: 3,
					visible: false,
					tags: ["sup"],
					tooltip: "Superscript"
				},

				code: {
					visible: false,
					groupIndex: 6,
					tooltip: "Code snippet",
					exec: function () {
						var range = this.getInternalRange(),
							common = $(range.commonAncestorContainer),
							$nodeName = range.commonAncestorContainer.nodeName.toLowerCase();
						if (common.parent("code").length) {
							common.unwrap();
						} else {
							if ($nodeName !== "body") {
								common.wrap("<code/>");
							}
						}
					}
				},

				cssWrap: {
					visible: false,
					groupIndex: 6,
					tooltip: "CSS Wrapper",
					exec: function () {
						$.wysiwyg.controls.cssWrap.init(this);
					}
				}

			};

			this.defaults = {
				html: '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>INITIAL_CONTENT</body></html>',
				debug: false,
				controls: {},
				css: {},
				events: {},
				autoGrow: false,
				autoSave: true,
				brIE: true,
				// http://code.google.com/p/jwysiwyg/issues/detail?id=15
				formHeight: 270,
				formWidth: 440,
				iFrameClass: null,
				initialContent: "<p>Initial content</p>",
				maxHeight: 10000,
				// see autoGrow
				maxLength: 0,
				messages: {
					nonSelection: "Select the text you wish to link"
				},
				toolbarHtml: '<ul role="menu" class="toolbar"></ul>',
				removeHeadings: false,
				replaceDivWithP: false,
				resizeOptions: false,
				rmUnusedControls: false,
				// https://github.com/akzhan/jwysiwyg/issues/52
				rmUnwantedBr: true,
				// http://code.google.com/p/jwysiwyg/issues/detail?id=11
				tableFiller: null,
				initialMinHeight: null,

				controlImage: {
					forceRelativeUrls: false
				},

				controlLink: {
					forceRelativeUrls: false
				},

				plugins: { // placeholder for plugins settings
					autoload: false,
					i18n: false,
					rmFormat: {
						rmMsWordMarkup: false
					}
				}
			};

			this.availableControlProperties = ["arguments", "callback", "className", "command", "css", "custom", "exec", "groupIndex", "hotkey", "icon", "tags", "tooltip", "visible"];

			this.editor = null;
			this.editorDoc = null;
			this.element = null;
			this.options = {};
			this.original = null;
			this.savedRange = null;
			this.timers = [];
			this.validKeyCodes = [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46];

			this.isDestroyed = false;

			this.dom = { // DOM related properties and methods
				ie: {
					parent: null // link to dom
				},
				w3c: {
					parent: null // link to dom
				}
			};
			this.dom.parent = this;
			this.dom.ie.parent = this.dom;
			this.dom.w3c.parent = this.dom;

			this.ui = {}; // UI related properties and methods
			this.ui.self = this;
			this.ui.toolbar = null;
			this.ui.initialHeight = null; // ui.grow
			this.dom.getAncestor = function (element, filterTagName) {
				filterTagName = filterTagName.toLowerCase();

				while (element && "body" !== element.tagName.toLowerCase()) {
					if (filterTagName === element.tagName.toLowerCase()) {
						return element;
					}

					element = element.parentNode;
				}

				return null;
			};

			this.dom.getElement = function (filterTagName) {
				var dom = this;

				if (window.getSelection) {
					return dom.w3c.getElement(filterTagName);
				} else {
					return dom.ie.getElement(filterTagName);
				}
			};

			this.dom.ie.getElement = function (filterTagName) {
				var dom = this.parent,
					selection = dom.parent.getInternalSelection(),
					range = selection.createRange(),
					element;

				if ("Control" === selection.type) {
					// control selection
					if (1 === range.length) {
						element = range.item(0);
					} else {
						// multiple control selection
						return null;
					}
				} else {
					element = range.parentElement();
				}

				return dom.getAncestor(element, filterTagName);
			};

			this.dom.w3c.getElement = function (filterTagName) {
				var dom = this.parent,
					range = dom.parent.getInternalRange(),
					element;

				if (!range) {
					return null;
				}

				element = range.commonAncestorContainer;

				if (3 === element.nodeType) {
					element = element.parentNode;
				}

				// if startContainer not Text, Comment, or CDATASection element then
				// startOffset is the number of child nodes between the start of the
				// startContainer and the boundary point of the Range
				if (element === range.startContainer) {
					element = element.childNodes[range.startOffset];
				}

				return dom.getAncestor(element, filterTagName);
			};

			this.ui.addHoverClass = function () {
				$(this).addClass("wysiwyg-button-hover");
			};

			this.ui.appendControls = function () {
				var ui = this,
					self = this.self,
					controls = self.parseControls(),
					hasVisibleControls = true,
					// to prevent separator before first item
					groups = [],
					controlsByGroup = {},
					i, currentGroupIndex, // jslint wants all vars at top of function
					iterateGroup = function (controlName, control) {
						if (control.groupIndex && currentGroupIndex !== control.groupIndex) {
							currentGroupIndex = control.groupIndex;
							hasVisibleControls = false;
						}

						if (!control.visible) {
							return;
						}

						if (!hasVisibleControls) {
							ui.appendItemSeparator();
							hasVisibleControls = true;
						}

						if (control.custom) {
							ui.appendItemCustom(controlName, control);
						} else {
							ui.appendItem(controlName, control);
						}
					};

				$.each(controls, function (name, c) {
					var index = "empty";

					if (undefined !== c.groupIndex) {
						if ("" === c.groupIndex) {
							index = "empty";
						} else {
							index = c.groupIndex;
						}
					}

					if (undefined === controlsByGroup[index]) {
						groups.push(index);
						controlsByGroup[index] = {};
					}
					controlsByGroup[index][name] = c;
				});

				groups.sort(function (a, b) {
					if ("number" === typeof (a) && typeof (a) === typeof (b)) {
						return (a - b);
					} else {
						a = a.toString();
						b = b.toString();

						if (a > b) {
							return 1;
						}

						if (a === b) {
							return 0;
						}

						return -1;
					}
				});

				if (0 < groups.length) {
					// set to first index in groups to proper placement of separator
					currentGroupIndex = groups[0];
				}

				for (i = 0; i < groups.length; i += 1) {
					$.each(controlsByGroup[groups[i]], iterateGroup);
				}
			};

			this.ui.appendItem = function (name, control) {
				var self = this.self,
					className = control.className || control.command || name || "empty",
					tooltip = control.tooltip || control.command || name || "";

				return $('<li role="menuitem" unselectable="on">' + (className) + "</li>").addClass(className).attr("title", tooltip).hover(this.addHoverClass, this.removeHoverClass).click(function () {
					if ($(this).hasClass("disabled")) {
						return false;
					}

					self.triggerControl.apply(self, [name, control]);

					this.blur();
					self.ui.returnRange();
					self.ui.focus();
					return true;
				}).appendTo(self.ui.toolbar);
			};

			this.ui.appendItemCustom = function (name, control) {
				var self = this.self,
					tooltip = control.tooltip || control.command || name || "";

				if (control.callback) {
					$(window).bind("trigger-" + name + ".wysiwyg", control.callback);
				}

				return $('<li role="menuitem" unselectable="on" style="background: url(\'' + control.icon + '\') no-repeat;"></li>').addClass("custom-command-" + name).addClass("wysiwyg-custom-command").addClass(name).attr("title", tooltip).hover(this.addHoverClass, this.removeHoverClass).click(function () {
					if ($(this).hasClass("disabled")) {
						return false;
					}

					self.triggerControl.apply(self, [name, control]);

					this.blur();
					self.ui.returnRange();
					self.ui.focus();

					self.triggerControlCallback(name);
					return true;
				}).appendTo(self.ui.toolbar);
			};

			this.ui.appendItemSeparator = function () {
				var self = this.self;
				return $('<li role="separator" class="separator"></li>').appendTo(self.ui.toolbar);
			};

			this.autoSaveFunction = function () {
				this.saveContent();
			};

			this.ui.checkTargets = function (element) {
				var self = this.self;

				$.each(self.options.controls, function (name, control) {
					var className = control.className || control.command || name || "empty",
						tags, elm, css, el, checkActiveStatus = function (cssProperty, cssValue) {
							var handler;

							if ("function" === typeof (cssValue)) {
								handler = cssValue;
								if (handler(el.css(cssProperty).toString().toLowerCase(), self)) {
									self.ui.toolbar.find("." + className).addClass("active");
								}
							} else {
								if (el.css(cssProperty).toString().toLowerCase() === cssValue) {
									self.ui.toolbar.find("." + className).addClass("active");
								}
							}
						};

					if ("fullscreen" !== className) {
						self.ui.toolbar.find("." + className).removeClass("active");
					}

					if (control.tags || (control.options && control.options.tags)) {
						tags = control.tags || (control.options && control.options.tags);

						elm = element;
						while (elm) {
							if (elm.nodeType !== 1) {
								break;
							}

							if ($.inArray(elm.tagName.toLowerCase(), tags) !== -1) {
								self.ui.toolbar.find("." + className).addClass("active");
							}

							elm = elm.parentNode;
						}
					}

					if (control.css || (control.options && control.options.css)) {
						css = control.css || (control.options && control.options.css);
						el = $(element);

						while (el) {
							if (el[0].nodeType !== 1) {
								break;
							}
							$.each(css, checkActiveStatus);

							el = el.parent();
						}
					}
				});
			};

			this.ui.designMode = function () {
				var attempts = 3,
					self = this.self,
					runner;
				runner = function (attempts) {
					if ("on" === self.editorDoc.designMode) {
						if (self.timers.designMode) {
							window.clearTimeout(self.timers.designMode);
						}

						// IE needs to reget the document element (this.editorDoc) after designMode was set
						if (self.innerDocument() !== self.editorDoc) {
							self.ui.initFrame();
						}

						return;
					}

					try {
						self.editorDoc.designMode = "on";
					} catch (e) {}

					attempts -= 1;
					if (attempts > 0) {
						self.timers.designMode = window.setTimeout(function () {
							runner(attempts);
						}, 100);
					}
				};

				runner(attempts);
			};

			this.destroy = function () {
				this.isDestroyed = true;

				var i, $form = this.element.closest("form");

				for (i = 0; i < this.timers.length; i += 1) {
					window.clearTimeout(this.timers[i]);
				}

				// Remove bindings
				$form.unbind(".wysiwyg");
				this.element.remove();
				$.removeData(this.original, "wysiwyg");
				$(this.original).show();
				return this;
			};

			this.getRangeText = function () {
				var r = this.getInternalRange();

				if (r.toString) {
					r = r.toString();
				} else if (r.text) { // IE
					r = r.text;
				}

				return r;
			};
			//not used?
			this.execute = function (command, arg) {
				if (typeof (arg) === "undefined") {
					arg = null;
				}
				this.editorDoc.execCommand(command, false, arg);
			};

			this.extendOptions = function (options) {
				var controls = {};

				/**
				 * If the user set custom controls, we catch it, and merge with the
				 * defaults controls later.
				 */
				if ("object" === typeof options.controls) {
					controls = options.controls;
					delete options.controls;
				}

				options = $.extend(true, {}, this.defaults, options);
				options.controls = $.extend(true, {}, controls, this.controls, controls);

				if (options.rmUnusedControls) {
					$.each(options.controls, function (controlName) {
						if (!controls[controlName]) {
							delete options.controls[controlName];
						}
					});
				}

				return options;
			};

			this.ui.focus = function () {
				var self = this.self;

				self.editor.get(0).contentWindow.focus();
				return self;
			};

			this.ui.returnRange = function () {
				var self = this.self,
					sel;

				if (self.savedRange !== null) {
					if (window.getSelection) { //non IE and there is already a selection
						sel = window.getSelection();
						if (sel.rangeCount > 0) {
							sel.removeAllRanges();
						}
						try {
							sel.addRange(self.savedRange);
						} catch (e) {
							console.error(e);
						}
					} else if (window.document.createRange) { // non IE and no selection
						window.getSelection().addRange(self.savedRange);
					} else if (window.document.selection) { //IE
						self.savedRange.select();
					}

					self.savedRange = null;
				}
			};

			this.increaseFontSize = function () {
				if ($.browser.mozilla || $.browser.opera) {
					this.editorDoc.execCommand('increaseFontSize', false, null);
				} else if ($.browser.safari) {
					var newNode = this.editorDoc.createElement('big');
					this.getInternalRange().surroundContents(newNode);
				} else {
					console.error("Internet Explorer?");
				}
			};

			this.decreaseFontSize = function () {
				if ($.browser.mozilla || $.browser.opera) {
					this.editorDoc.execCommand('decreaseFontSize', false, null);
				} else if ($.browser.safari) {
					var newNode = this.editorDoc.createElement('small');
					this.getInternalRange().surroundContents(newNode);
				} else {
					console.error("Internet Explorer?");
				}
			};

			this.getContent = function () {
				if (this.viewHTML) {
					this.setContent(this.original.value);
				}
				return this.events.filter('getContent', this.editorDoc.body.innerHTML);
			};

			/**
			 * A jWysiwyg specific event system.
			 *
			 * Example:
			 * 
			 * $("#editor").getWysiwyg().events.bind("getContent", function (orig) {
			 *     return "<div id='content'>"+orgi+"</div>";
			 * });
			 * 
			 * This makes it so that when ever getContent is called, it is wrapped in a div#content.
			 */
			this.events = {
				_events: {},

				/**
				 * Similar to jQuery's bind, but for jWysiwyg only.
				 */
				bind: function (eventName, callback) {
					if (typeof (this._events.eventName) !== "object") {
						this._events[eventName] = [];
					}
					this._events[eventName].push(callback);
				},

				/**
				 * Similar to jQuery's trigger, but for jWysiwyg only.
				 */
				trigger: function (eventName, args) {
					if (typeof (this._events.eventName) === "object") {
						var editor = this.editor;
						$.each(this._events[eventName], function (k, v) {
							if (typeof (v) === "function") {
								v.apply(editor, args);
							}
						});
					}
				},

				/**
				 * This "filters" `originalText` by passing it as the first argument to every callback
				 * with the name `eventName` and taking the return value and passing it to the next function.
				 *
				 * This function returns the result after all the callbacks have been applied to `originalText`.
				 */
				filter: function (eventName, originalText) {
					if (typeof (this._events[eventName]) === "object") {
						var editor = this.editor,
							args = Array.prototype.slice.call(arguments, 1);

						$.each(this._events[eventName], function (k, v) {
							if (typeof (v) === "function") {
								originalText = v.apply(editor, args);
							}
						});
					}
					return originalText;
				}
			};

			this.getElementByAttributeValue = function (tagName, attributeName, attributeValue) {
				var i, value, elements = this.editorDoc.getElementsByTagName(tagName);

				for (i = 0; i < elements.length; i += 1) {
					value = elements[i].getAttribute(attributeName);

					if ($.browser.msie) { /** IE add full path, so I check by the last chars. */
						value = value.substr(value.length - attributeValue.length);
					}

					if (value === attributeValue) {
						return elements[i];
					}
				}

				return false;
			};

			this.getInternalRange = function () {
				var selection = this.getInternalSelection();

				if (!selection) {
					return null;
				}

				if (selection.rangeCount && selection.rangeCount > 0) { // w3c
					return selection.getRangeAt(0);
				} else if (selection.createRange) { // ie
					return selection.createRange();
				}

				return null;
			};

			this.getInternalSelection = function () {
				// firefox: document.getSelection is deprecated
				if (this.editor.get(0).contentWindow) {
					if (this.editor.get(0).contentWindow.getSelection) {
						return this.editor.get(0).contentWindow.getSelection();
					}
					if (this.editor.get(0).contentWindow.selection) {
						return this.editor.get(0).contentWindow.selection;
					}
				}
				if (this.editorDoc.getSelection) {
					return this.editorDoc.getSelection();
				}
				if (this.editorDoc.selection) {
					return this.editorDoc.selection;
				}

				return null;
			};

			this.getRange = function () {
				var selection = this.getSelection();

				if (!selection) {
					return null;
				}

				if (selection.rangeCount && selection.rangeCount > 0) { // w3c
					selection.getRangeAt(0);
				} else if (selection.createRange) { // ie
					return selection.createRange();
				}

				return null;
			};

			this.getSelection = function () {
				return (window.getSelection) ? window.getSelection() : window.document.selection;
			};

			// :TODO: you can type long string and letters will be hidden because of overflow
			this.ui.grow = function () {
				var self = this.self,
					innerBody = $(self.editorDoc.body),
					innerHeight = $.browser.msie ? innerBody[0].scrollHeight : innerBody.height() + 2 + 20,
					// 2 - borders, 20 - to prevent content jumping on grow
					minHeight = self.ui.initialHeight,
					height = Math.max(innerHeight, minHeight);

				height = Math.min(height, self.options.maxHeight);

				self.editor.attr("scrolling", height < self.options.maxHeight ? "no" : "auto"); // hide scrollbar firefox
				innerBody.css("overflow", height < self.options.maxHeight ? "hidden" : ""); // hide scrollbar chrome
				self.editor.get(0).height = height;

				return self;
			};

			this.init = function (element, options) {
				var self = this,
					$form = $(element).closest("form"),
					newX = element.width || element.clientWidth || 0,
					newY = element.height || element.clientHeight || 0;

				this.options = this.extendOptions(options);
				this.original = element;
				this.ui.toolbar = $(this.options.toolbarHtml);

				if ($.browser.msie && parseInt($.browser.version, 10) < 8) {
					this.options.autoGrow = false;
				}

				if (newX === 0 && element.cols) {
					newX = (element.cols * 8) + 21;
				}
				if (newY === 0 && element.rows) {
					newY = (element.rows * 16) + 16;
				}

				this.editor = $(window.location.protocol === "https:" ? '<iframe src="javascript:false;"></iframe>' : "<iframe></iframe>").attr("frameborder", "0");

				if (this.options.iFrameClass) {
					this.editor.addClass(this.options.iFrameClass);
				} else {
					this.editor.css({
						minHeight: (newY - 6).toString() + "px",
						// fix for issue 12 ( http://github.com/akzhan/jwysiwyg/issues/issue/12 )
						width: (newX > 50) ? (newX - 8).toString() + "px" : ""
					});
					if ($.browser.msie && parseInt($.browser.version, 10) < 7) {
						this.editor.css("height", newY.toString() + "px");
					}
				}
				/**
				 * http://code.google.com/p/jwysiwyg/issues/detail?id=96
				 */
				this.editor.attr("tabindex", $(element).attr("tabindex"));

				this.element = $("<div/>").addClass("wysiwyg");

				if (!this.options.iFrameClass) {
					this.element.css({
						width: (newX > 0) ? newX.toString() + "px" : "100%"
					});
				}

				$(element).hide().before(this.element);

				this.viewHTML = false;

				/**
				 * @link http://code.google.com/p/jwysiwyg/issues/detail?id=52
				 */
				this.initialContent = $(element).val();
				this.ui.initFrame();

				if (this.options.resizeOptions && $.fn.resizable) {
					this.element.resizable($.extend(true, {
						alsoResize: this.editor
					}, this.options.resizeOptions));
				}

				if (this.options.autoSave) {
					$form.bind("submit.wysiwyg", function () {
						self.autoSaveFunction();
					});
				}

				$form.bind("reset.wysiwyg", function () {
					self.resetFunction();
				});
			};

			this.ui.initFrame = function () {
				var self = this.self,
					stylesheet, growHandler, saveHandler;

				self.ui.appendControls();
				self.element.append(self.ui.toolbar).append($("<div><!-- --></div>").css({
					clear: "both"
				})).append(self.editor);

				self.editorDoc = self.innerDocument();

				if (self.isDestroyed) {
					return null;
				}

				self.ui.designMode();
				self.editorDoc.open();
				self.editorDoc.write(
				self.options.html
				/**
				 * @link http://code.google.com/p/jwysiwyg/issues/detail?id=144
				 */
				.replace(/INITIAL_CONTENT/, function () {
					return self.wrapInitialContent();
				}));
				self.editorDoc.close();

				$.wysiwyg.plugin.bind(self);

				$(self.editorDoc).trigger("initFrame.wysiwyg");

				$(self.editorDoc).bind("click.wysiwyg", function (event) {
					self.ui.checkTargets(event.target ? event.target : event.srcElement);
				});

				/**
				 * @link http://code.google.com/p/jwysiwyg/issues/detail?id=20
				 */
				$(self.original).focus(function () {
					if ($(this).filter(":visible")) {
						return;
					}
					self.ui.focus();
				});

				$(self.editorDoc).keydown(function (event) {
					var emptyContentRegex;
					if (event.keyCode === 8) { // backspace
						emptyContentRegex = /^<([\w]+)[^>]*>(<br\/?>)?<\/\1>$/;
						if (emptyContentRegex.test(self.getContent())) { // if content is empty
							event.stopPropagation(); // prevent remove single empty tag
							return false;
						}
					}
					return true;
				});

				if (!$.browser.msie) {
					$(self.editorDoc).keydown(function (event) {
						var controlName;

						/* Meta for Macs. tom@punkave.com */
						if (event.ctrlKey || event.metaKey) {
							for (controlName in self.controls) {
								if (self.controls[controlName].hotkey && self.controls[controlName].hotkey.ctrl) {
									if (event.keyCode === self.controls[controlName].hotkey.key) {
										self.triggerControl.apply(self, [controlName, self.controls[controlName]]);

										return false;
									}
								}
							}
						}

						return true;
					});
				} else if (self.options.brIE) {
					$(self.editorDoc).keydown(function (event) {
						if (event.keyCode === 13) {
							var rng = self.getRange();
							rng.pasteHTML("<br/>");
							rng.collapse(false);
							rng.select();

							return false;
						}

						return true;
					});
				}

				if (self.options.plugins.rmFormat.rmMsWordMarkup) {
					$(self.editorDoc).bind("keyup.wysiwyg", function (event) {
						if (event.ctrlKey || event.metaKey) {
							// CTRL + V (paste)
							if (86 === event.keyCode) {
								if ($.wysiwyg.rmFormat) {
									if ("object" === typeof (self.options.plugins.rmFormat.rmMsWordMarkup)) {
										$.wysiwyg.rmFormat.run(self, {
											rules: {
												msWordMarkup: self.options.plugins.rmFormat.rmMsWordMarkup
											}
										});
									} else {
										$.wysiwyg.rmFormat.run(self, {
											rules: {
												msWordMarkup: {
													enabled: true
												}
											}
										});
									}
								}
							}
						}
					});
				}

				if (self.options.autoSave) {
					$(self.editorDoc).keydown(function () {
						self.autoSaveFunction();
					}).keyup(function () {
						self.autoSaveFunction();
					}).mousedown(function () {
						self.autoSaveFunction();
					}).bind($.support.noCloneEvent ? "input.wysiwyg" : "paste.wysiwyg", function () {
						self.autoSaveFunction();
					});
				}

				if (self.options.autoGrow) {
					if (self.options.initialMinHeight !== null) {
						self.ui.initialHeight = self.options.initialMinHeight;
					} else {
						self.ui.initialHeight = $(self.editorDoc).height();
					}
					$(self.editorDoc.body).css("border", "1px solid white"); // cancel margin collapsing
					growHandler = function () {
						self.ui.grow();
					};

					$(self.editorDoc).keyup(growHandler);
					$(self.editorDoc).bind("editorRefresh.wysiwyg", growHandler);

					// fix when content height > textarea height
					self.ui.grow();
				}

				if (self.options.css) {
					if (String === self.options.css.constructor) {
						if ($.browser.msie) {
							stylesheet = self.editorDoc.createStyleSheet(self.options.css);
							$(stylesheet).attr({
								"media": "all"
							});
						} else {
							stylesheet = $("<link/>").attr({
								"href": self.options.css,
								"media": "all",
								"rel": "stylesheet",
								"type": "text/css"
							});

							$(self.editorDoc).find("head").append(stylesheet);
						}
					} else {
						self.timers.initFrame_Css = window.setTimeout(function () {
							$(self.editorDoc.body).css(self.options.css);
						}, 0);
					}
				}

				if (self.initialContent.length === 0) {
					if ("function" === typeof (self.options.initialContent)) {
						self.setContent(self.options.initialContent());
					} else {
						self.setContent(self.options.initialContent);
					}
				}

				if (self.options.maxLength > 0) {
					$(self.editorDoc).keydown(function (event) {
						if ($(self.editorDoc).text().length >= self.options.maxLength && $.inArray(event.which, self.validKeyCodes) === -1) {
							event.preventDefault();
						}
					});
				}

				// Support event callbacks
				$.each(self.options.events, function (key, handler) {
					$(self.editorDoc).bind(key + ".wysiwyg", function (event) {
						// Trigger event handler, providing the event and api to 
						// support additional functionality.
						handler.apply(self.editorDoc, [event, self]);
					});
				});

				// restores selection properly on focus
				if ($.browser.msie) {
					// Event chain: beforedeactivate => focusout => blur.
					// Focusout & blur fired too late to handle internalRange() in dialogs.
					// When clicked on input boxes both got range = null
					$(self.editorDoc).bind("beforedeactivate.wysiwyg", function () {
						self.savedRange = self.getInternalRange();
					});
				} else {
					$(self.editorDoc).bind("blur.wysiwyg", function () {
						self.savedRange = self.getInternalRange();
					});
				}

				$(self.editorDoc.body).addClass("wysiwyg");
				if (self.options.events && self.options.events.save) {
					saveHandler = self.options.events.save;

					$(self.editorDoc).bind("keyup.wysiwyg", saveHandler);
					$(self.editorDoc).bind("change.wysiwyg", saveHandler);

					if ($.support.noCloneEvent) {
						$(self.editorDoc).bind("input.wysiwyg", saveHandler);
					} else {
						$(self.editorDoc).bind("paste.wysiwyg", saveHandler);
						$(self.editorDoc).bind("cut.wysiwyg", saveHandler);
					}
				}

				/**
				 * XHTML5 {@link https://github.com/akzhan/jwysiwyg/issues/152}
				 */
				if (self.options.xhtml5 && self.options.unicode) {
					var replacements = {
						ne: 8800,
						le: 8804,
						para: 182,
						xi: 958,
						darr: 8595,
						nu: 957,
						oacute: 243,
						Uacute: 218,
						omega: 969,
						prime: 8242,
						pound: 163,
						igrave: 236,
						thorn: 254,
						forall: 8704,
						emsp: 8195,
						lowast: 8727,
						brvbar: 166,
						alefsym: 8501,
						nbsp: 160,
						delta: 948,
						clubs: 9827,
						lArr: 8656,
						Omega: 937,
						Auml: 196,
						cedil: 184,
						and: 8743,
						plusmn: 177,
						ge: 8805,
						raquo: 187,
						uml: 168,
						equiv: 8801,
						laquo: 171,
						rdquo: 8221,
						Epsilon: 917,
						divide: 247,
						fnof: 402,
						chi: 967,
						Dagger: 8225,
						iacute: 237,
						rceil: 8969,
						sigma: 963,
						Oslash: 216,
						acute: 180,
						frac34: 190,
						lrm: 8206,
						upsih: 978,
						Scaron: 352,
						part: 8706,
						exist: 8707,
						nabla: 8711,
						image: 8465,
						prop: 8733,
						zwj: 8205,
						omicron: 959,
						aacute: 225,
						Yuml: 376,
						Yacute: 221,
						weierp: 8472,
						rsquo: 8217,
						otimes: 8855,
						kappa: 954,
						thetasym: 977,
						harr: 8596,
						Ouml: 214,
						Iota: 921,
						ograve: 242,
						sdot: 8901,
						copy: 169,
						oplus: 8853,
						acirc: 226,
						sup: 8835,
						zeta: 950,
						Iacute: 205,
						Oacute: 211,
						crarr: 8629,
						Nu: 925,
						bdquo: 8222,
						lsquo: 8216,
						apos: 39,
						Beta: 914,
						eacute: 233,
						egrave: 232,
						lceil: 8968,
						Kappa: 922,
						piv: 982,
						Ccedil: 199,
						ldquo: 8220,
						Xi: 926,
						cent: 162,
						uarr: 8593,
						hellip: 8230,
						Aacute: 193,
						ensp: 8194,
						sect: 167,
						Ugrave: 217,
						aelig: 230,
						ordf: 170,
						curren: 164,
						sbquo: 8218,
						macr: 175,
						Phi: 934,
						Eta: 919,
						rho: 961,
						Omicron: 927,
						sup2: 178,
						euro: 8364,
						aring: 229,
						Theta: 920,
						mdash: 8212,
						uuml: 252,
						otilde: 245,
						eta: 951,
						uacute: 250,
						rArr: 8658,
						nsub: 8836,
						agrave: 224,
						notin: 8713,
						ndash: 8211,
						Psi: 936,
						Ocirc: 212,
						sube: 8838,
						szlig: 223,
						micro: 181,
						not: 172,
						sup1: 185,
						middot: 183,
						iota: 953,
						ecirc: 234,
						lsaquo: 8249,
						thinsp: 8201,
						sum: 8721,
						ntilde: 241,
						scaron: 353,
						cap: 8745,
						atilde: 227,
						lang: 10216,
						__replacement: 65533,
						isin: 8712,
						gamma: 947,
						Euml: 203,
						ang: 8736,
						upsilon: 965,
						Ntilde: 209,
						hearts: 9829,
						Alpha: 913,
						Tau: 932,
						spades: 9824,
						dagger: 8224,
						THORN: 222,
						"int": 8747,
						lambda: 955,
						Eacute: 201,
						Uuml: 220,
						infin: 8734,
						rlm: 8207,
						Aring: 197,
						ugrave: 249,
						Egrave: 200,
						Acirc: 194,
						rsaquo: 8250,
						ETH: 208,
						oslash: 248,
						alpha: 945,
						Ograve: 210,
						Prime: 8243,
						mu: 956,
						ni: 8715,
						real: 8476,
						bull: 8226,
						beta: 946,
						icirc: 238,
						eth: 240,
						prod: 8719,
						larr: 8592,
						ordm: 186,
						perp: 8869,
						Gamma: 915,
						reg: 174,
						ucirc: 251,
						Pi: 928,
						psi: 968,
						tilde: 732,
						asymp: 8776,
						zwnj: 8204,
						Agrave: 192,
						deg: 176,
						AElig: 198,
						times: 215,
						Delta: 916,
						sim: 8764,
						Otilde: 213,
						Mu: 924,
						uArr: 8657,
						circ: 710,
						theta: 952,
						Rho: 929,
						sup3: 179,
						diams: 9830,
						tau: 964,
						Chi: 935,
						frac14: 188,
						oelig: 339,
						shy: 173,
						or: 8744,
						dArr: 8659,
						phi: 966,
						iuml: 239,
						Lambda: 923,
						rfloor: 8971,
						iexcl: 161,
						cong: 8773,
						ccedil: 231,
						Icirc: 206,
						frac12: 189,
						loz: 9674,
						rarr: 8594,
						cup: 8746,
						radic: 8730,
						frasl: 8260,
						euml: 235,
						OElig: 338,
						hArr: 8660,
						Atilde: 195,
						Upsilon: 933,
						there4: 8756,
						ouml: 246,
						oline: 8254,
						Ecirc: 202,
						yacute: 253,
						auml: 228,
						permil: 8240,
						sigmaf: 962,
						iquest: 191,
						empty: 8709,
						pi: 960,
						Ucirc: 219,
						supe: 8839,
						Igrave: 204,
						yen: 165,
						rang: 10217,
						trade: 8482,
						lfloor: 8970,
						minus: 8722,
						Zeta: 918,
						sub: 8834,
						epsilon: 949,
						yuml: 255,
						Sigma: 931,
						Iuml: 207,
						ocirc: 244
					};
					self.events.bind("getContent", function (text) {
						return text.replace(/&(?:amp;)?(?!amp|lt|gt|quot)([a-z][a-z0-9]*);/gi, function (str, p1) {
							if (!replacements[p1]) {
								p1 = p1.toLowerCase();
								if (!replacements[p1]) {
									p1 = "__replacement";
								}
							}

							var num = replacements[p1]; /* Numeric return if ever wanted: return replacements[p1] ? "&#"+num+";" : ""; */
							return String.fromCharCode(num);
						});
					});
				}
			};

			this.innerDocument = function () {
				var element = this.editor.get(0);

				if (element.nodeName.toLowerCase() === "iframe") {
					if (element.contentDocument) { // Gecko
						return element.contentDocument;
					} else if (element.contentWindow) { // IE
						return element.contentWindow.document;
					}

					if (this.isDestroyed) {
						return null;
					}

					console.error("Unexpected error in innerDocument");

/*
					 return ( $.browser.msie )
					 ? document.frames[element.id].document
					 : element.contentWindow.document // contentDocument;
					 */
				}

				return element;
			};

			this.insertHtml = function (szHTML) {
				var img, range;

				if (!szHTML || szHTML.length === 0) {
					return this;
				}

				if ($.browser.msie) {
					this.ui.focus();
					this.editorDoc.execCommand("insertImage", false, "#jwysiwyg#");
					img = this.getElementByAttributeValue("img", "src", "#jwysiwyg#");
					if (img) {
						$(img).replaceWith(szHTML);
					}
				} else {
					if ($.browser.mozilla) { // @link https://github.com/akzhan/jwysiwyg/issues/50
						if (1 === $(szHTML).length) {
							range = this.getInternalRange();
							range.deleteContents();
							range.insertNode($(szHTML).get(0));
						} else {
							this.editorDoc.execCommand("insertHTML", false, szHTML);
						}
					} else {
						if (!this.editorDoc.execCommand("insertHTML", false, szHTML)) {
							this.editor.focus();
/* :TODO: place caret at the end
							if (window.getSelection) {
							} else {
							}
							this.editor.focus();
							*/
							this.editorDoc.execCommand("insertHTML", false, szHTML);
						}
					}
				}

				this.saveContent();

				return this;
			};

			this.parseControls = function () {
				var self = this;

				$.each(this.options.controls, function (controlName, control) {
					$.each(control, function (propertyName) {
						if (-1 === $.inArray(propertyName, self.availableControlProperties)) {
							throw controlName + '["' + propertyName + '"]: property "' + propertyName + '" not exists in Wysiwyg.availableControlProperties';
						}
					});
				});

				if (this.options.parseControls) {
					return this.options.parseControls.call(this);
				}

				return this.options.controls;
			};

			this.removeFormat = function () {
				if ($.browser.msie) {
					this.ui.focus();
				}

				if (this.options.removeHeadings) {
					this.editorDoc.execCommand("formatBlock", false, "<p>"); // remove headings
				}

				this.editorDoc.execCommand("removeFormat", false, null);
				this.editorDoc.execCommand("unlink", false, null);

				if ($.wysiwyg.rmFormat && $.wysiwyg.rmFormat.enabled) {
					if ("object" === typeof (this.options.plugins.rmFormat.rmMsWordMarkup)) {
						$.wysiwyg.rmFormat.run(this, {
							rules: {
								msWordMarkup: this.options.plugins.rmFormat.rmMsWordMarkup
							}
						});
					} else {
						$.wysiwyg.rmFormat.run(this, {
							rules: {
								msWordMarkup: {
									enabled: true
								}
							}
						});
					}
				}

				return this;
			};

			this.ui.removeHoverClass = function () {
				$(this).removeClass("wysiwyg-button-hover");
			};

			this.resetFunction = function () {
				this.setContent(this.initialContent);
			};

			this.saveContent = function () {
				if (this.viewHTML) {
					return; // no need
				}
				if (this.original) {
					var content, newContent;

					content = this.getContent();

					if (this.options.rmUnwantedBr) {
						content = content.replace(/<br\/?>$/, "");
					}

					if (this.options.replaceDivWithP) {
						newContent = $("<div/>").addClass("temp").append(content);

						newContent.children("div").each(function () {
							var element = $(this),
								p = element.find("p"),
								i;

							if (0 === p.length) {
								p = $("<p></p>");

								if (this.attributes.length > 0) {
									for (i = 0; i < this.attributes.length; i += 1) {
										p.attr(this.attributes[i].name, element.attr(this.attributes[i].name));
									}
								}

								p.append(element.html());

								element.replaceWith(p);
							}
						});

						content = newContent.html();
					}

					$(this.original).val(content);

					if (this.options.events && this.options.events.save) {
						this.options.events.save.call(this);
					}
				}

				return this;
			};

			this.setContent = function (newContent) {
				this.editorDoc.body.innerHTML = newContent;
				this.saveContent();

				return this;
			};

			this.triggerControl = function (name, control) {
				var cmd = control.command || name,
					args = control["arguments"] || [];

				if (control.exec) {
					control.exec.apply(this);
				} else {
					this.ui.focus();
					this.ui.withoutCss();
					// when click <Cut>, <Copy> or <Paste> got "Access to XPConnect service denied" code: "1011"
					// in Firefox untrusted JavaScript is not allowed to access the clipboard
					try {
						this.editorDoc.execCommand(cmd, false, args);
					} catch (e) {
						console.error(e);
					}
				}

				if (this.options.autoSave) {
					this.autoSaveFunction();
				}
			};

			this.triggerControlCallback = function (name) {
				$(window).trigger("trigger-" + name + ".wysiwyg", [this]);
			};

			this.ui.withoutCss = function () {
				var self = this.self;

				if ($.browser.mozilla) {
					try {
						self.editorDoc.execCommand("styleWithCSS", false, false);
					} catch (e) {
						try {
							self.editorDoc.execCommand("useCSS", false, true);
						} catch (e2) {}
					}
				}

				return self;
			};

			this.wrapInitialContent = function () {
				var content = this.initialContent,
					found = content.match(/<\/?p>/gi);

				if (!found) {
					return "<p>" + content + "</p>";
				} else {
					// :TODO: checking/replacing
				}

				return content;
			};
		}

		/*
		 * Wysiwyg namespace: public properties and methods
		 */
		$.wysiwyg = {
			messages: {
				noObject: "Something goes wrong, check object"
			},

			/**
			 * Custom control support by Alec Gorge ( http://github.com/alecgorge )
			 */
			addControl: function (object, name, settings) {
				return object.each(function () {
					var oWysiwyg = $(this).data("wysiwyg"),
						customControl = {},
						toolbar;

					if (!oWysiwyg) {
						return this;
					}

					customControl[name] = $.extend(true, {
						visible: true,
						custom: true
					}, settings);
					$.extend(true, oWysiwyg.options.controls, customControl);

					// render new toolbar
					toolbar = $(oWysiwyg.options.toolbarHtml);
					oWysiwyg.ui.toolbar.replaceWith(toolbar);
					oWysiwyg.ui.toolbar = toolbar;
					oWysiwyg.ui.appendControls();
				});
			},

			clear: function (object) {
				return object.each(function () {
					var oWysiwyg = $(this).data("wysiwyg");

					if (!oWysiwyg) {
						return this;
					}

					oWysiwyg.setContent("");
				});
			},

			console: console,
			// let our console be available for extensions
			destroy: function (object) {
				return object.each(function () {
					var oWysiwyg = $(this).data("wysiwyg");

					if (!oWysiwyg) {
						return this;
					}

					oWysiwyg.destroy();
				});
			},

			"document": function (object) {
				// no chains because of return
				var oWysiwyg = object.data("wysiwyg");

				if (!oWysiwyg) {
					return undefined;
				}

				return $(oWysiwyg.editorDoc);
			},

			getContent: function (object) {
				// no chains because of return
				var oWysiwyg = object.data("wysiwyg");

				if (!oWysiwyg) {
					return undefined;
				}

				return oWysiwyg.getContent();
			},

			init: function (object, options) {
				return object.each(function () {
					var opts = $.extend(true, {}, options),
						obj;

					// :4fun:
					// remove this textarea validation and change line in this.saveContent function
					// $(this.original).val(content); to $(this.original).html(content);
					// now you can make WYSIWYG editor on h1, p, and many more tags
					if (("textarea" !== this.nodeName.toLowerCase()) || $(this).data("wysiwyg")) {
						return;
					}

					obj = new Wysiwyg();
					obj.init(this, opts);
					$.data(this, "wysiwyg", obj);

					$(obj.editorDoc).trigger("afterInit.wysiwyg");
				});
			},

			insertHtml: function (object, szHTML) {
				return object.each(function () {
					var oWysiwyg = $(this).data("wysiwyg");

					if (!oWysiwyg) {
						return this;
					}

					oWysiwyg.insertHtml(szHTML);
				});
			},

			plugin: {
				listeners: {},

				bind: function (Wysiwyg) {
					var self = this;

					$.each(this.listeners, function (action, handlers) {
						var i, plugin;

						for (i = 0; i < handlers.length; i += 1) {
							plugin = self.parseName(handlers[i]);

							$(Wysiwyg.editorDoc).bind(action + ".wysiwyg", {
								plugin: plugin
							}, function (event) {
								$.wysiwyg[event.data.plugin.name][event.data.plugin.method].apply($.wysiwyg[event.data.plugin.name], [Wysiwyg]);
							});
						}
					});
				},

				exists: function (name) {
					var plugin;

					if ("string" !== typeof (name)) {
						return false;
					}

					plugin = this.parseName(name);

					if (!$.wysiwyg[plugin.name] || !$.wysiwyg[plugin.name][plugin.method]) {
						return false;
					}

					return true;
				},

				listen: function (action, handler) {
					var plugin;

					plugin = this.parseName(handler);

					if (!$.wysiwyg[plugin.name] || !$.wysiwyg[plugin.name][plugin.method]) {
						return false;
					}

					if (!this.listeners[action]) {
						this.listeners[action] = [];
					}

					this.listeners[action].push(handler);

					return true;
				},

				parseName: function (name) {
					var elements;

					if ("string" !== typeof (name)) {
						return false;
					}

					elements = name.split(".");

					if (2 > elements.length) {
						return false;
					}

					return {
						name: elements[0],
						method: elements[1]
					};
				},

				register: function (data) {
					if (!data.name) {
						console.error("Plugin name missing");
					}

					$.each($.wysiwyg, function (pluginName) {
						if (pluginName === data.name) {
							console.error("Plugin with name '" + data.name + "' was already registered");
						}
					});

					$.wysiwyg[data.name] = data;

					return true;
				}
			},

			removeFormat: function (object) {
				return object.each(function () {
					var oWysiwyg = $(this).data("wysiwyg");

					if (!oWysiwyg) {
						return this;
					}

					oWysiwyg.removeFormat();
				});
			},

			save: function (object) {
				return object.each(function () {
					var oWysiwyg = $(this).data("wysiwyg");

					if (!oWysiwyg) {
						return this;
					}

					oWysiwyg.saveContent();
				});
			},

			selectAll: function (object) {
				var oWysiwyg = object.data("wysiwyg"),
					oBody, oRange, selection;

				if (!oWysiwyg) {
					return this;
				}

				oBody = oWysiwyg.editorDoc.body;
				if (window.getSelection) {
					selection = oWysiwyg.getInternalSelection();
					selection.selectAllChildren(oBody);
				} else {
					oRange = oBody.createTextRange();
					oRange.moveToElementText(oBody);
					oRange.select();
				}
			},

			setContent: function (object, newContent) {
				return object.each(function () {
					var oWysiwyg = $(this).data("wysiwyg");

					if (!oWysiwyg) {
						return this;
					}

					oWysiwyg.setContent(newContent);
				});
			},

			triggerControl: function (object, controlName) {
				return object.each(function () {
					var oWysiwyg = $(this).data("wysiwyg");

					if (!oWysiwyg) {
						return this;
					}

					if (!oWysiwyg.controls[controlName]) {
						console.error("Control '" + controlName + "' not exists");
					}

					oWysiwyg.triggerControl.apply(oWysiwyg, [controlName, oWysiwyg.controls[controlName]]);
				});
			},

			support: {
				prop: supportsProp
			},

			utils: {
				extraSafeEntities: [
					["<", ">", "'", '"', " "],
					[32]
				],

				encodeEntities: function (str) {
					var self = this,
						aStr, aRet = [];

					if (this.extraSafeEntities[1].length === 0) {
						$.each(this.extraSafeEntities[0], function (i, ch) {
							self.extraSafeEntities[1].push(ch.charCodeAt(0));
						});
					}
					aStr = str.split("");
					$.each(aStr, function (i) {
						var iC = aStr[i].charCodeAt(0);
						if ($.inArray(iC, self.extraSafeEntities[1]) && (iC < 65 || iC > 127 || (iC > 90 && iC < 97))) {
							aRet.push('&#' + iC + ';');
						} else {
							aRet.push(aStr[i]);
						}
					});

					return aRet.join('');
				}
			}
		};

		$.fn.wysiwyg = function (method) {
			var args = arguments,
				plugin;

			if ("undefined" !== typeof $.wysiwyg[method]) {
				// set argument object to undefined
				args = Array.prototype.concat.call([args[0]], [this], Array.prototype.slice.call(args, 1));
				return $.wysiwyg[method].apply($.wysiwyg, Array.prototype.slice.call(args, 1));
			} else if ("object" === typeof method || !method) {
				Array.prototype.unshift.call(args, this);
				return $.wysiwyg.init.apply($.wysiwyg, args);
			} else if ($.wysiwyg.plugin.exists(method)) {
				plugin = $.wysiwyg.plugin.parseName(method);
				args = Array.prototype.concat.call([args[0]], [this], Array.prototype.slice.call(args, 1));
				return $.wysiwyg[plugin.name][plugin.method].apply($.wysiwyg[plugin.name], Array.prototype.slice.call(args, 1));
			} else {
				console.error("Method '" + method + "' does not exist on jQuery.wysiwyg.\nTry to include some extra controls or plugins");
			}
		};

		$.fn.getWysiwyg = function () {
			return $.data(this, "wysiwyg");
		};
	})(jQuery);



	/**
	 * Controls: Image plugin
	 *
	 * Depends on jWYSIWYG
	 */
	(function ($) {
		if (undefined === $.wysiwyg) {
			throw "wysiwyg.image.js depends on $.wysiwyg";
		}

		if (!$.wysiwyg.controls) {
			$.wysiwyg.controls = {};
		}

		/*
		 * Wysiwyg namespace: public properties and methods
		 */
		$.wysiwyg.controls.image = {
			init: function (Wysiwyg) {
				var self = this,
					elements, dialog, formImageHtml, dialogReplacements, key, translation, img = {
						alt: "",
						self: Wysiwyg.dom.getElement("img"),
						// link to element node
						src: "http://",
						title: ""
					};

				dialogReplacements = {
					legend: "Insert Image",
					preview: "Preview",
					url: "URL",
					title: "Title",
					description: "Description",
					width: "Width",
					height: "Height",
					original: "Original W x H",
					"float": "Float",
					floatNone: "None",
					floatLeft: "Left",
					floatRight: "Right",
					submit: "Insert Image",
					loading: "loading",
					reset: "Cancel"
				};

				formImageHtml = '<form class="wysiwyg" title="{legend}">' + '<img src="" alt="{preview}" width="100%"><br>' + '{url}: <input type="text" name="src" value=""><br>' + '{title}: <input type="text" name="imgtitle" value=""><br>' + '{description}: <input type="text" name="description" value=""><br>' + '{width} x {height}: <input type="text" name="width" value="" class="width integer"> x <input type="text" name="height" value="" class="height integer"><br>' + '{float}: <select name="float">' + '<option value="">{floatNone}</option>' + '<option value="left">{floatLeft}</option>' + '<option value="right">{floatRight}</option></select></label><hr>' + '<button class="button" id="wysiwyg_submit">{submit}</button> ' + '<button class="button" id="wysiwyg_reset">{reset}</button></form>';

				for (key in dialogReplacements) {
					if ($.wysiwyg.i18n) {
						translation = $.wysiwyg.i18n.t(dialogReplacements[key], "dialogs.image");

						if (translation === dialogReplacements[key]) { // if not translated search in dialogs 
							translation = $.wysiwyg.i18n.t(dialogReplacements[key], "dialogs");
						}

						dialogReplacements[key] = translation;
					}

					formImageHtml = formImageHtml.replace("{" + key + "}", dialogReplacements[key]);
				}

				if (img.self) {
					img.src = img.self.src ? img.self.src : "";
					img.alt = img.self.alt ? img.self.alt : "";
					img.title = img.self.title ? img.self.title : "";
					img.width = img.self.width ? img.self.width : "";
					img.height = img.self.height ? img.self.height : "";
					img.asp = img.width / img.width;
				}

				elements = $(formImageHtml);
				elements = self.makeForm(elements, img);

				dialog = elements.appendTo("body");
				dialog.dialog({
					modal: true,
					resizable: false,
					open: function (ev, ui) {
						$("#wysiwyg_submit", dialog).click(function (e) {
							self.processInsert(dialog.container, Wysiwyg, img);

							$(dialog).dialog("close");
							return false;
						});
						$("#wysiwyg_reset", dialog).click(function (e) {
							$(dialog).dialog("close");
							return false;
						});
						$('fieldset', dialog).click(function (e) {
							e.stopPropagation();
						});
						$("select, input[type=text]", dialog).uniform();
						$('.width', dialog).wl_Number({
							step: 10,
							onChange: function (value) {
								$('.height', dialog).val(Math.ceil(value / (img.asp || 1)));
							}
						});
						$('.height', dialog).wl_Number({
							step: 10,
							onChange: function (value) {
								$('.width', dialog).val(Math.floor(value * (img.asp || 1)));
							}
						});
						$('input[name="src"]', dialog).wl_URL();

					},
					close: function (ev, ui) {
						dialog.dialog("destroy");
						dialog.remove();
					}
				});

				$(Wysiwyg.editorDoc).trigger("editorRefresh.wysiwyg");
			},

			processInsert: function (context, Wysiwyg, img) {
				var image, url = $('input[name="src"]', context).val(),
					title = $('input[name="imgtitle"]', context).val(),
					description = $('input[name="description"]', context).val(),
					width = $('input[name="width"]', context).val(),
					height = $('input[name="height"]', context).val(),
					styleFloat = $('select[name="float"]', context).val(),
					style = [],
					found, baseUrl;

				if (Wysiwyg.options.controlImage.forceRelativeUrls) {
					baseUrl = window.location.protocol + "//" + window.location.hostname;
					if (0 === url.indexOf(baseUrl)) {
						url = url.substr(baseUrl.length);
					}
				}

				if (img.self) {
					// to preserve all img attributes
					$(img.self).attr("src", url).attr("title", title).attr("alt", description).css("float", styleFloat);

					if (width.toString().match(/^[0-9]+(px|%)?$/)) {
						$(img.self).css("width", width);
					} else {
						$(img.self).css("width", "");
					}

					if (height.toString().match(/^[0-9]+(px|%)?$/)) {
						$(img.self).css("height", height);
					} else {
						$(img.self).css("height", "");
					}

					Wysiwyg.saveContent();
				} else {
					found = width.toString().match(/^[0-9]+(px|%)?$/);
					if (found) {
						if (found[1]) {
							style.push("width: " + width + ";");
						} else {
							style.push("width: " + width + "px;");
						}
					}

					found = height.toString().match(/^[0-9]+(px|%)?$/);
					if (found) {
						if (found[1]) {
							style.push("height: " + height + ";");
						} else {
							style.push("height: " + height + "px;");
						}
					}

					if (styleFloat.length > 0) {
						style.push("float: " + styleFloat + ";");
					}

					if (style.length > 0) {
						style = ' style="' + style.join(" ") + '"';
					}

					image = "<img src='" + url + "' title='" + title + "' alt='" + description + "'" + style + "/>";
					Wysiwyg.insertHtml(image);
				}
			},

			makeForm: function (form, img) {
				form.find("input[name=src]").val(img.src);
				form.find("input[name=imgtitle]").val(img.title);
				form.find("input[name=description]").val(img.alt);
				form.find('input[name="width"]').val(img.width);
				form.find('input[name="height"]').val(img.height);
				form.find('img').attr("src", img.src);
				img.asp = img.width / img.height;

				form.find("input[name=src]").bind("change", function () {
					var image = new Image();
					var text = $('#wysiwyg_submit', form).find('span').text();
					form.find('img').removeAttr("src");

					$('#wysiwyg_submit', form).prop('disabled', true).find('span').text('wait...');

					image.onload = function () {

						form.find('img').attr("src", image.src);
						img.asp = image.width / image.height;
						form.find('input[name="width"]').val(image.width);
						form.find('input[name="height"]').val(image.height);
						$('#wysiwyg_submit', form).find('span').text(text);
						$('#wysiwyg_submit', form).prop('disabled', false);

					};
					image.src = this.value;
				});

				return form;
			}
		};

		$.wysiwyg.insertImage = function (object, url, attributes) {
			return object.each(function () {
				var Wysiwyg = $(this).data("wysiwyg"),
					image, attribute;

				if (!Wysiwyg) {
					return this;
				}

				if (!url || url.length === 0) {
					return this;
				}

				if ($.browser.msie) {
					Wysiwyg.ui.focus();
				}

				if (attributes) {
					Wysiwyg.editorDoc.execCommand("insertImage", false, "#jwysiwyg#");
					image = Wysiwyg.getElementByAttributeValue("img", "src", "#jwysiwyg#");

					if (image) {
						image.src = url;

						for (attribute in attributes) {
							if (attributes.hasOwnProperty(attribute)) {
								image.setAttribute(attribute, attributes[attribute]);
							}
						}
					}
				} else {
					Wysiwyg.editorDoc.execCommand("insertImage", false, url);
				}

				Wysiwyg.saveContent();

				$(Wysiwyg.editorDoc).trigger("editorRefresh.wysiwyg");

				return this;
			});
		};
	})(jQuery);


	/**
	 * Controls: Table plugin
	 * 
	 * Depends on jWYSIWYG
	 */
	(function ($) {
		if (undefined === $.wysiwyg) {
			throw "wysiwyg.table.js depends on $.wysiwyg";
		}

		if (!$.wysiwyg.controls) {
			$.wysiwyg.controls = {};
		}

		var insertTable = function (colCount, rowCount, filler) {
				if (isNaN(rowCount) || isNaN(colCount) || rowCount === null || colCount === null) {
					return;
				}

				var i, j, html = ['<table border="1" style="width: 100%;"><tbody>'];

				colCount = parseInt(colCount, 10);
				rowCount = parseInt(rowCount, 10);

				if (filler === null) {
					filler = "&nbsp;";
				}
				filler = "<td>" + filler + "</td>";

				for (i = rowCount; i > 0; i -= 1) {
					html.push("<tr>");
					for (j = colCount; j > 0; j -= 1) {
						html.push(filler);
					}
					html.push("</tr>");
				}
				html.push("</tbody></table>");

				return this.insertHtml(html.join(""));
			};

		/*
		 * Wysiwyg namespace: public properties and methods
		 */
		$.wysiwyg.controls.table = function (Wysiwyg) {
			var dialog, colCount, rowCount, formTableHtml, formTextLegend = "Insert table",
				formTextCols = "Count of columns",
				formTextRows = "Count of rows",
				formTextSubmit = "Insert table",
				formTextReset = "Cancel";

			if ($.wysiwyg.i18n) {
				formTextLegend = $.wysiwyg.i18n.t(formTextLegend, "dialogs.table");
				formTextCols = $.wysiwyg.i18n.t(formTextCols, "dialogs.table");
				formTextRows = $.wysiwyg.i18n.t(formTextRows, "dialogs.table");
				formTextSubmit = $.wysiwyg.i18n.t(formTextSubmit, "dialogs.table");
				formTextReset = $.wysiwyg.i18n.t(formTextReset, "dialogs");
			}

			formTableHtml = '<form class="wysiwyg" title="' + formTextLegend + '">' + formTextCols + ': <input type="text" name="colCount" value="3" class="integer" ><br>' + formTextRows + ': <input type="text" name="rowCount" value="3" class="integer" ><hr>' + '<button class="button" id="wysiwyg_submit">' + formTextSubmit + '</button> ' + '<button class="button" id="wysiwyg_reset">' + formTextReset + '</button></form>';

			if (!Wysiwyg.insertTable) {
				Wysiwyg.insertTable = insertTable;
			}

			dialog = $(formTableHtml).appendTo("body");
			dialog.dialog({
				modal: true,
				resizable: false,
				open: function (event, ui) {
					$("#wysiwyg_submit", dialog).click(function (e) {
						e.preventDefault();
						rowCount = $('input[name="rowCount"]', dialog).val();
						colCount = $('input[name="colCount"]', dialog).val();

						Wysiwyg.insertTable(colCount, rowCount, Wysiwyg.defaults.tableFiller);
						$(dialog).dialog("close");
					});
					$("#wysiwyg_reset", dialog).click(function (e) {
						e.preventDefault();
						$(dialog).dialog("close");
					});

					$("select, input[type=text]", dialog).uniform();
					$('.integer', dialog).wl_Number();

				},
				close: function (event, ui) {
					dialog.dialog("destroy");
					dialog.remove();
				}
			});

			$(Wysiwyg.editorDoc).trigger("editorRefresh.wysiwyg");
		};

		$.wysiwyg.insertTable = function (object, colCount, rowCount, filler) {
			return object.each(function () {
				var Wysiwyg = $(this).data("wysiwyg");

				if (!Wysiwyg.insertTable) {
					Wysiwyg.insertTable = insertTable;
				}

				if (!Wysiwyg) {
					return this;
				}

				Wysiwyg.insertTable(colCount, rowCount, filler);
				$(Wysiwyg.editorDoc).trigger("editorRefresh.wysiwyg");

				return this;
			});
		};
	})(jQuery);

	/**
	 * Controls: Link plugin
	 *
	 * Depends on jWYSIWYG
	 *
	 * By: Esteban Beltran (academo) <sergies@gmail.com>
	 */
	(function ($) {
		if (undefined === $.wysiwyg) {
			throw "wysiwyg.link.js depends on $.wysiwyg";
		}

		if (!$.wysiwyg.controls) {
			$.wysiwyg.controls = {};
		}

		/*
		 * Wysiwyg namespace: public properties and methods
		 */
		$.wysiwyg.controls.link = {
			init: function (Wysiwyg) {
				var self = this,
					elements, dialog, url, a, selection, formLinkHtml, formTextLegend, formTextUrl, formTextTitle, formTextTarget, formTextSubmit, formTextReset, baseUrl;

				formTextLegend = "Insert Link";
				formTextUrl = "Link URL";
				formTextTitle = "Link Title";
				formTextTarget = "Link Target";
				formTextSubmit = "Insert Link";
				formTextReset = "Cancel";

				if ($.wysiwyg.i18n) {
					formTextLegend = $.wysiwyg.i18n.t(formTextLegend, "dialogs.link");
					formTextUrl = $.wysiwyg.i18n.t(formTextUrl, "dialogs.link");
					formTextTitle = $.wysiwyg.i18n.t(formTextTitle, "dialogs.link");
					formTextTarget = $.wysiwyg.i18n.t(formTextTarget, "dialogs.link");
					formTextSubmit = $.wysiwyg.i18n.t(formTextSubmit, "dialogs.link");
					formTextReset = $.wysiwyg.i18n.t(formTextReset, "dialogs");
				}

				formLinkHtml = '<form class="wysiwyg" title="' + formTextLegend + '">' + formTextUrl + ': <input type="text" name="linkhref" value="">' + formTextTitle + ': <input type="text" name="linktitle" value="">' + formTextTarget + ': <input type="text" name="linktarget" value=""><hr>' + '<button class="button" id="wysiwyg_submit">' + formTextSubmit + '</button> ' + '<button class="button" id="wysiwyg_reset">' + formTextReset + '</button></form>';

				a = {
					self: Wysiwyg.dom.getElement("a"),
					// link to element node
					href: "http://",
					title: "",
					target: ""
				};

				if (a.self) {
					a.href = a.self.href ? a.self.href : a.href;
					a.title = a.self.title ? a.self.title : "";
					a.target = a.self.target ? a.self.target : "";
				}

				elements = $(formLinkHtml);
				elements.find("input[name=linkhref]").val(a.href);
				elements.find("input[name=linktitle]").val(a.title);
				elements.find("input[name=linktarget]").val(a.target);

				if ($.browser.msie) {
					dialog = elements.appendTo(Wysiwyg.editorDoc.body);
				} else {
					dialog = elements.appendTo("body");
				}

				dialog.dialog({
					modal: true,
					resizable: false,
					open: function (ev, ui) {
						$("#wysiwyg_submit", dialog).click(function (e) {
							e.preventDefault();

							var url = $('input[name="linkhref"]', dialog).val(),
								title = $('input[name="linktitle"]', dialog).val(),
								target = $('input[name="linktarget"]', dialog).val(),
								baseUrl;

							if (Wysiwyg.options.controlLink.forceRelativeUrls) {
								baseUrl = window.location.protocol + "//" + window.location.hostname;
								if (0 === url.indexOf(baseUrl)) {
									url = url.substr(baseUrl.length);
								}
							}

							if (a.self) {
								if ("string" === typeof (url)) {
									if (url.length > 0) {
										// to preserve all link attributes
										$(a.self).attr("href", url).attr("title", title).attr("target", target);
									} else {
										$(a.self).replaceWith(a.self.innerHTML);
									}
								}
							} else {
								if ($.browser.msie) {
									Wysiwyg.ui.returnRange();
								}

								//Do new link element
								selection = Wysiwyg.getRangeText();
								img = Wysiwyg.dom.getElement("img");

								if ((selection && selection.length > 0) || img) {
									if ($.browser.msie) {
										Wysiwyg.ui.focus();
									}

									if ("string" === typeof (url)) {
										if (url.length > 0) {
											Wysiwyg.editorDoc.execCommand("createLink", false, url);
										} else {
											Wysiwyg.editorDoc.execCommand("unlink", false, null);
										}
									}

									a.self = Wysiwyg.dom.getElement("a");

									$(a.self).attr("href", url).attr("title", title);

									/**
									 * @url https://github.com/akzhan/jwysiwyg/issues/16
									 */
									$(a.self).attr("target", target);
								} else if (Wysiwyg.options.messages.nonSelection) {
									$.dialog(Wysiwyg.options.messages.nonSelection);
								}
							}

							Wysiwyg.saveContent();

							$(dialog).dialog("close");
						});
						$("#wysiwyg_reset", dialog).click(function (e) {
							e.preventDefault();
							$(dialog).dialog("close");
						});

						$("select, input", dialog).uniform();
						$('input[name="linkhref"]', dialog).wl_URL();

					},
					close: function (ev, ui) {
						dialog.dialog("destroy");
						dialog.remove();
					}
				});

				$(Wysiwyg.editorDoc).trigger("editorRefresh.wysiwyg");
			}
		};

		$.wysiwyg.createLink = function (object, url) {
			return object.each(function () {
				var oWysiwyg = $(this).data("wysiwyg"),
					selection;

				if (!oWysiwyg) {
					return this;
				}

				if (!url || url.length === 0) {
					return this;
				}

				selection = oWysiwyg.getRangeText();

				if (selection && selection.length > 0) {
					if ($.browser.msie) {
						oWysiwyg.ui.focus();
					}
					oWysiwyg.editorDoc.execCommand("unlink", false, null);
					oWysiwyg.editorDoc.execCommand("createLink", false, url);
				} else if (oWysiwyg.options.messages.nonSelection) {
					window.alert(oWysiwyg.options.messages.nonSelection);
				}
			});
		};
	})(jQuery);

	/**
	 * Controls: Element CSS Wrapper plugin
	 *
	 * Depends on jWYSIWYG
	 * 
	 * By Yotam Bar-On (https://github.com/tudmotu)
	 */
	(function ($) {
		if (undefined === $.wysiwyg) {
			throw "wysiwyg.cssWrap.js depends on $.wysiwyg";
		}
/* For core enhancements #143
	$.wysiwyg.ui.addControl("cssWrap", {
		visible : false,
		groupIndex: 6,
		tooltip: "CSS Wrapper",
		exec: function () { 
				$.wysiwyg.controls.cssWrap.init(this);
			}
	}
	*/
		if (!$.wysiwyg.controls) {
			$.wysiwyg.controls = {};
		}

		/*
		 * Wysiwyg namespace: public properties and methods
		 */
		$.wysiwyg.controls.cssWrap = {
			init: function (Wysiwyg) {
				var self = this,
					formWrapHtml, key, translation, dialogReplacements = {
						legend: "Wrap Element",
						wrapperType: "Wrapper Type",
						ID: "ID",
						"class": "Class",
						wrap: "Wrap",
						unwrap: "Unwrap",
						cancel: "Cancel"
					};

				formWrapHtml = '<form class="wysiwyg" title="{legend}"><fieldset>' + '{wrapperType}: <select name="type"><option value="span">Span</option><option value="div">Div</option></select><br>' + '{ID}: <input name="id" type="text"><br>' + '{class}: <input name="class" type="text" ><hr>' + '<button class="cssWrap-unwrap" style="display:none;">{unwrap}</button> ' + '<button class="cssWrap-submit">{wrap}</button> ' + '<button class="cssWrap-cancel">{cancel}</button></fieldset></form>';

				for (key in dialogReplacements) {
					if ($.wysiwyg.i18n) {
						translation = $.wysiwyg.i18n.t(dialogReplacements[key]);
						if (translation === dialogReplacements[key]) { // if not translated search in dialogs 
							translation = $.wysiwyg.i18n.t(dialogReplacements[key], "dialogs");
						}
						dialogReplacements[key] = translation;
					}
					formWrapHtml = formWrapHtml.replace("{" + key + "}", dialogReplacements[key]);
				}
				if (!$(".wysiwyg-dialog-wrapper").length) {
					$(formWrapHtml).appendTo("body");
					$("form.wysiwyg").dialog({
						modal: true,
						resizable: false,
						open: function (ev, ui) {
							$this = $(this);
							var range = Wysiwyg.getInternalRange(),
								common;
							// We make sure that there is some selection:
							if (range) {
								if ($.browser.msie) {
									Wysiwyg.ui.focus();
								}
								common = $(range.commonAncestorContainer);
							} else {
								alert("You must select some elements before you can wrap them.");
								$this.dialog("close");
								return 0;
							}
							var $nodeName = range.commonAncestorContainer.nodeName.toLowerCase();
							// If the selection is already a .wysiwygCssWrapper, then we want to change it and not double-wrap it.
							if (common.parent(".wysiwygCssWrapper").length) {
								alert(common.parent(".wysiwygCssWrapper").get(0).nodeName.toLowerCase());
								$this.find("select[name=type]").val(common.parent(".wysiwygCssWrapper").get(0).nodeName.toLowerCase());
								$this.find("select[name=type]").attr("disabled", "disabled");
								$this.find("input[name=id]").val(common.parent(".wysiwygCssWrapper").attr("id"));
								$this.find("input[name=class]").val(common.parent(".wysiwygCssWrapper").attr("class").replace('wysiwygCssWrapper ', ''));
								// Add the "unwrap" button:
								$("form.wysiwyg").find(".cssWrap-unwrap").show();
								$("form.wysiwyg").find(".cssWrap-unwrap").click(function (e) {
									e.preventDefault();
									if ($nodeName !== "body") {
										common.unwrap();
									}
									$this.dialog("close");
									return 1;
								});
							}
							// Submit button.
							$("form.wysiwyg").find(".cssWrap-submit").click(function (e) {
								e.preventDefault();
								var $wrapper = $("form.wysiwyg").find("select[name=type]").val();
								var $id = $("form.wysiwyg").find("input[name=id]").val();
								var $class = $("form.wysiwyg").find("input[name=class]").val();
								if ($nodeName !== "body") {
									// If the selection is already a .wysiwygCssWrapper, then we want to change it and not double-wrap it.
									if (common.parent(".wysiwygCssWrapper").length) {
										common.parent(".wysiwygCssWrapper").attr("id", $class);
										common.parent(".wysiwygCssWrapper").attr("class", $class);
									} else {
										common.wrap('<' + $wrapper + ' id="' + $id + '" class="' + "wysiwygCssWrapper " + $class + '"/>');
									}
								} else {
									// Currently no implemntation for if $nodeName == 'body'.
								}
								$this.dialog("close");
							});
							// Cancel button.
							$("form.wysiwyg").find(".cssWrap-cancel").click(function (e) {
								e.preventDefault();
								$this.dialog("close");
								return 1;
							});
							$("form.wysiwyg").find("select, input[type=text]").uniform();
						},
						close: function () {
							$(this).dialog("destroy");
							$(this).remove();
						}
					});
					Wysiwyg.saveContent();
				}
				$(Wysiwyg.editorDoc).trigger("editorRefresh.wysiwyg");
				return 1;
			}
		}
	})(jQuery);

	/**
	 * Controls: Colorpicker plugin
	 * 
	 * Depends on jWYSIWYG, wl_Color Plugin
	 */
	(function ($) {
		"use strict";

		if (undefined === $.wysiwyg) {
			throw "wysiwyg.colorpicker.js depends on $.wysiwyg";
		}

		if (!$.wysiwyg.controls) {
			$.wysiwyg.controls = {};
		}

		/*
		 * Wysiwyg namespace: public properties and methods
		 */
		$.wysiwyg.controls.colorpicker = {
			modalOpen: false,

			init: function (Wysiwyg) {
				if ($.wysiwyg.controls.colorpicker.modalOpen === true) {
					return false;
				} else {
					$.wysiwyg.controls.colorpicker.modalOpen = true;
				}
				var self = this,
					elements, dialog, colorpickerHtml, dialogReplacements, key, translation;

				dialogReplacements = {
					legend: "Colorpicker",
					color: "Color",
					submit: "Apply",
					cancel: "Cancel"
				};

				colorpickerHtml = '<form class="wysiwyg" title="{legend}">' + '{color}: <input type="text" class="color" id="wysiwyg_colorpicker" name="wysiwyg_colorpicker" value=""><hr>' + '<button id="wysiwyg_colorpicker-submit">{submit}</button> ' + '<button id="wysiwyg_colorpicker-cancel">{cancel}</button></form>';

				for (key in dialogReplacements) {
					if ($.wysiwyg.i18n) {
						translation = $.wysiwyg.i18n.t(dialogReplacements[key], "dialogs.colorpicker");

						if (translation === dialogReplacements[key]) { // if not translated search in dialogs 
							translation = $.wysiwyg.i18n.t(dialogReplacements[key], "dialogs");
						}

						dialogReplacements[key] = translation;
					}

					colorpickerHtml = colorpickerHtml.replace("{" + key + "}", dialogReplacements[key]);
				}

				elements = $(colorpickerHtml);

				dialog = elements.appendTo("body");
				dialog.dialog({
					modal: true,
					resizable: false,
					open: function (event, ui) {
						if ($.browser.msie) {
							Wysiwyg.ui.returnRange();
						}
						var selection = Wysiwyg.getRangeText(),
							content = Wysiwyg.getContent(),
							color = '',
							regexp = /#([a-fA-F0-9]{3,6})/;
						if (content.match(regexp)) {
							regexp.exec(content);
							color = RegExp.$1;
						} else {
							regexp = /rgb\((\d+), (\d+), (\d+)\)/;
							if (content.match(regexp)) {
								regexp.exec(content);
								var r = RegExp.$1,
									g = RegExp.$2,
									b = RegExp.$3;
								color = parseInt(r).toString(16) + parseInt(g).toString(16) + parseInt(b).toString(16);
							}
						}
						$('#wysiwyg_colorpicker').val('#' + color).wl_Color();
						$("#wysiwyg_colorpicker-submit").click(function (e) {
							e.preventDefault();
							var color = $('#wysiwyg_colorpicker').val();

							if ($.browser.msie) {
								Wysiwyg.ui.returnRange();
								Wysiwyg.ui.focus();
							}

							if (color) Wysiwyg.editorDoc.execCommand('ForeColor', false, color);
							Wysiwyg.saveContent();
							$(dialog).dialog("close");
							return false;
						});
						$("#wysiwyg_colorpicker-cancel").click(function (e) {
							e.preventDefault();
							if ($.browser.msie) {
								Wysiwyg.ui.returnRange();
							}

							$(dialog).dialog("close");
							return false;
						});
					},

					close: function (event, ui) {
						$.wysiwyg.controls.colorpicker.modalOpen = false;
						dialog.dialog("destroy");
						dialog.remove();
					}
				});
			}
		};
	})(jQuery);
});