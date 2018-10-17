// Polyfill
if(!Object.entries){Object.entries=function(r){var e=Object.keys(r),n=e.length,t=new Array(n);
while(n--)t[n]=[e[n],r[e[n]]];return t}}if(!Array.from){Array.from=function(){var e=Object.prototype.toString;var c=function(r){return typeof r==="function"||e.call(r)==="[object Function]"};var n=function(r){var e=Number(r);if(isNaN(e)){return 0}if(e===0||!isFinite(e)){return e}return(e>0?1:-1)*Math.floor(Math.abs(e))};var t=Math.pow(2,53)-1;var l=function(r){var e=n(r);return Math.min(Math.max(e,0),t)};return function from(r){var e=this;var n=Object(r);if(r==null){throw new TypeError("Array.from requires an array-like object - not null or undefined")}var t=arguments.length>1?arguments[1]:void undefined;var a;if(typeof t!=="undefined"){if(!c(t)){throw new TypeError("Array.from: when provided, the second argument must be a function")}if(arguments.length>2){a=arguments[2]}}var i=l(n.length);var o=c(e)?Object(new e(i)):new Array(i);var f=0;var u;while(f<i){u=n[f];if(t){o[f]=typeof a==="undefined"?t(u,f):t.call(a,u,f)}else{o[f]=u}f+=1}o.length=i;return o}}()}
//
var l = "local", g = "global", echoGlobalObj = this;

// Function to set bulk prototype properties, accepts one argument
function $proto(thisArg, obj) {
  "use strict";
	var objEntry = Object.entries(obj);
	if (typeof thisArg !== "function" || (typeof thisArg === "object" && (thisArg === null || thisArg instanceof Array))) {
	  throw "Unknown ``this`` arg for ``$oroto()`` function!";
	}
	if (objEntry.every(function(entry) { // Cheking if no blank property
		return entry[0] && entry[1] ? true : false;
	})) {
		objEntry.forEach(function(entry){ // Adding properties
			thisArg.prototype[entry[0]] = entry[1];
		});
    return thisArg;
	} else {
		throw "Unknown Input Method, please follow a following method:\n@param {Object} An object in a format {property: value} (Multiple property/value in a single Object accepted)";
	}
}
/*
// Function to set bulk properties
function $prop(thisArg, obj) {
  var objKeys = Object.keys(obj);
  if (useKeys.length && thisArg) {
    if (thisArg.name) {
      for (key in useKeys) {
        thisArg[useKeys[key]] = obj[useKeys[key]];
      }
    } else {
      echoGlobalObj[Object.keys(thisArg)[0]] = thisArg[Object.entries(thisArg)[0][0]];
      for (key in useKeys) { 
        echoGlobalObj[Object.keys(thisArg)[0]][useKeys[key]] = obj[useKeys[key]];
      }
    }
  }
}
*/
function checkUrl(url, type) {
    if (url) {
        if (type === 'img') {
            var iUrl = url.match(/^((http|https)\:\/\/)*((\w*)\.)*(\w+)\.(\w+)\/(.*)\/(\w+)\.(png|jpg|jpeg|gif|bmp)/g);
            return (iUrl ? iUrl[0] : false);
        } else if (type = 'url') {
            var uUrl = url.match(/^((http|https)\:\/\/)*((\w*)\.)*(\w+)\.(\w+)\/(.*)/g);
            return (uUrl ? uUrl[0] : false);
        }
    } else {
            return false;
    }
}

(function(){
    use spuiiDat;
    function SpuiiVar(){
        this.global = {};
        this.local = {};
        this.dat = {$stores: {}, $resp:[]};
    } // Variable Store Constructor

    var iVar = new SpuiiVar(); // Constructing Variable Store at local level

    (spuiiDat['iVar-local'+ RawUserID] ? iVar.local = JSON.parse(spuiiDat['iVar-local'+ RawUserID]) : spuiiDat['iVar-local'+ RawUserID] = JSON.stringify(iVar.local));
    (spuiiDat['iVar-global'] ? iVar.global = JSON.parse(spuiiDat['iVar-global']) : spuiiDat['iVar-global'] = JSON.stringify(iVar.global));
    if (spuiiDat['iVar-dat'+ RawUserID]) {
        var sDat = JSON.parse(spuiiDat['iVar-dat'+ RawUserID]),
            loaded = Object.keys(iVar.dat),
            unloaded = Object.keys(sDat);
        if (unloaded.join("") == loaded.join("")) {
            iVar.dat = sDat;
        } else {
            loaded.forEach(function(val,ind){
                if (unloaded.indexOf(val) !== -1) {
                    iVar.dat[val] = sDat[val];
                }
            });
        }
    } else {
        spuiiDat['iVar-dat'+ RawUserID] = JSON.stringify(iVar.dat);
    }
    
    function _save(type) {
        type = type.toLowerCase() || 'all';
        type = (type == "all" || type == g || type == l || type == 'dat'? type : 'all');
        var datInd = [l,g,'dat'];
        if (type === 'all') {
            spuiiDat['iVar-local'+ RawUserID] = JSON.stringify(iVar.local);
            spuiiDat['iVar-global'] = JSON.stringify(iVar.global);
            spuiiDat['iVar-dat'+ RawUserID] = JSON.stringify(iVar.dat);
        } else if (datInd.indexOf(type) != -1) {
            spuiiDat['iVar-' + type + RawUserID] = JSON.stringify(iVar[type]);
        }
    }

    function _prop(thisArg, obj) { // Property Setter (Object return version)
        var useKeys = Object.keys(obj);
        if (useKeys.length && thisArg) {
            for (key in useKeys) {
                thisArg[useKeys[key]] = obj[useKeys[key]];
            }
            return thisArg;
        }
    }

    function newError(name, message) {
		var useErr = new ErrorConstructor(name, message);
		return useErr.name + ": " + useErr.message + "\n" + useErr.stack.replace(/.*at.*ErrorConstructor.*\n/,"");
	}
	
	function embedError(use, arg1) {
		if (use === "no-comp") {
			use = "The component '" + arg1 + "' does not exist! Refer to components by names: \n\t'author': [@params = 'author', Author Name, Author Icon URL] To access the Author component.\n\t'header': [@params = 'header', Header Title, Header Description, Header Title URL] To access the Header component.\n\t'body': [@params = 'body', Select Field Name/Position (Starting from 1), Field Name, Field Value] To access the fields.\n\t'footer': [@params = 'footer', Footer Name, Footer Icon URL] Access the footer component.\n\t'color': [@params = 'color', Color code] To change embed color.";
		} else if (use === "miss-comp") {
			use = "Embed '" + arg1 + "' component does not exist!";
		} else if (use === "has-comp") {
			use = "Component '" + arg1 + "' already exists!";
		} else if (use === "no-val") {
			use = "Incorrect value for '" + arg1 + "' component!";
		}
		return newError("EmbedError", use).replace(/.*at.*ErrorConstructor.*\n.*at\sgetError.*\n.*at\sembedError.*\n(.*at\s(new){0,}?\sEmbed.*\n)*/,"");
	}
	
    //Constructors --->
    function _Find(value, indexes, keys, scope) {
        this.value = value;
        this.indexes = indexes;
        this.keys = keys;
        this.scope = _setScope(scope);
    }
	
	function ErrorConstructor(name, message) {
		this.name = name;
		this.message = message;
		this.stack = new Error().stack.replace(/Error\n/,"");
	}

    var Embed = $proto(function() {
        var args = arguments[0],
                author = args.a instanceof Array ? args.a : Array(args.a),
                header = args.h || [],
                body = args.b,
                footer = args.f instanceof Array ? args.f : Array(args.f),
                color = args.c;
				
		if (!body){
			throw embedError("Broken or incomplete field!");
		}
				
        author = author[0] ? (author[1] && checkUrl(author[1], 'img') ? [author[0], checkUrl(author[1], 'img')] : [author[0]]) : [];
        header = header[0] ? (header[1] ? (header[2] && checkUrl(header[2], 'url') ? [header[0], header[1], checkUrl(header[2],'url')] : [header[0], header[1]]) : []) : [];
        if (body.length % 2 === 0 && body.every(function(val){
				return (val || val === 0 ? true : false);
		})) {
            var useArr = [];
            for (var i = 0; i < body.length; i+=2) {
                useArr.push({name: "" + body[i], value: "" + body[i+1]});
            }
            this.fields = useArr;
        } else {
            throw embedError("Broken or incomplete field!");
        }
        footer = footer[0] ? (footer[1] && checkUrl(footer[1], 'img') ? [footer[0], checkUrl(footer[1], 'img')] : [footer[0]]) : [];
    
        if (color) {
            var clr = color;
            if (clr.indexOf("#") !== -1 && clr.length < 8 && clr.length > 3 && !clr.match(/[^a-fA-F0-9#]/g)) {
                if (clr.length === 4) {
                    clr = "#" + clr.match(/\w/g).map(function (val) {
                        return "" + val + val;
                    }).join("");
                    this.color = HTML2Int(clr);
                } else {
                    this.color = HTML2Int(clr);
                }
            } else if (clr.split(",").filter(function(val) {
                    return val > -1 && val < 256 && !val.match(/[^0-9]/);
                }).length === 3) {
                color = HTML2Int("#" + clr.split(",").map(function(val) {
                    return (+val).toString(16);
                }).join(""));
            } else {
                throw embedError("Incorrect Color code format!");
            }
        } else {
            this.color = "";
        }
        this.author = {
            name: author[0] || '',
            icon_url: author[1] || ''
        },
        this.title = header[0] || '',
        this.url = header[2] || '',
        this.description = header[1] || '',
        this.footer = {
            icon_url: footer[1] || '',
            text: footer[0] || ''
        }
    }, {
        add: function(component, arg1, arg2, arg3) {
			if (component && typeof component == 'string') {
				switch (component.toLowerCase()) {
					case 'color': {
						if (!this.color) {
							if (arg1) {
								if (arg1.indexOf("#") !== -1 && arg1.length < 8 && arg1.length > 3 && !arg1.match(/[^a-fA-F0-9#]/g)) {
									if (arg1.length === 4) {
										arg1 = "#" + arg1.match(/\w/g).map(function (val) {
											return "" + val + val;
										}).join("");
										this.color = HTML2Int(arg1) || '';
									} else {
										this.color = HTML2Int(arg1) || '';
									}
								} else if (arg1.split(",").filter(function(val) {
										return val > -1 && val < 256 && !val.match(/[^0-9]/);
									}).length === 3) {
									this.color = HTML2Int("#" + arg1.split(",").map(function(val) {
										return (+val).toString(16);
									}).join("")) || '';
								} else {
									throw embedError("Incorrect Color code format!");
								}
							}
						} else {
							throw embedError("has-comp", component);
						}
						break;
					}
					case 'author': {
						if (!this.author.name) {
							if (arg1) {
								this.author.name = arg1;
								this.author.icon_url = arg2 && checkUrl(arg2) ? checkUrl(arg2) : '';
							} else {
								throw embedError("no-val", component);
							}
						} else {
							throw embedError("has-comp", component);
						}
						break;
					}
					case 'header': {
						if (!(this.title && this.description)) {
							if (arg1 && arg2) {
								this.title = arg1;
								this.description = arg2;
								this.url = arg3 && checkUrl(arg3) ? checkUrl(arg3) : '';
							} else {
								throw embedError("no-val", component);
							}
						} else {
							throw embedError("has-comp", component);
						}
						break;
					}
					case 'body': {
						arg1 = arg1 || 1;
						if (arg1 && arg2 && arg3) {
							if (!isNaN(arg1)) {
								if (this.fields.length + 1 >= arg1 && arg1 > 0) {
									this.fields = this.fields.slice(0, arg1 - 1).concat({name:arg2, value:arg3}, this.fields.slice(arg1 - 1));
								} else {
									throw embedError("Field index value out of range! Field index range: " + this.fields.length +", index provided: " + arg1);
								}
							} else {
								throw embedError("Incorrect index value!");
							}
						}
						break;
					}
					case 'footer': {
						if (!this.footer.text) {
							this.footer.text = arg1;
							this.footer.icon_url = arg2 &&checkUrl(arg2) ? checkUrl(arg2) : '';
						} else {
							throw embedError("has-comp", component);
						}
						break;
					}
					default: {
						throw embedError("The component does not exist");
					}
				}
			} else {
				throw embedError("Missing component!");
			}
        },
        change: function(component, arg1, arg2, arg3) {
			if (component && typeof component === 'string') {
				switch (component.toLowerCase()) {
					case 'color': {
						if (this.hasOwnProperty("color")) {
							if (arg1) {
								if (arg1.indexOf("#") !== -1 && arg1.length < 8 && arg1.length > 3 && !arg1.match(/[^a-fA-F0-9#]/g)) {
									if (arg1.length === 4) {
										arg1 = "#" + arg1.match(/\w/g).map(function (val) {
											return "" + val + val;
										}).join("");
										this.color = HTML2Int(arg1) || '';
									} else {
										this.color = HTML2Int(arg1) || '';
									}
								} else if (arg1.split(",").filter(function(val) {
										return val > -1 && val < 256 && !val.match(/[^0-9]/);
									}).length === 3) {
									this.color = HTML2Int("#" + arg1.split(",").map(function(val) {
										return (+val).toString(16);
									}).join("")) || '';
								} else {
									throw embedError("Incorrect Color code format!");
								}
							}
						} else {
							throw embedError("miss-comp", component);
						}
						break;
					}
					case 'author': {
						if (this.author.name) {
							this.author.name = arg1 ? arg1 : this.author.name;
							this.author.icon_url = arg2 && checkUrl(arg2) ? checkUrl(arg2) : '';
						} else {
							throw embedError("miss-comp", component);
						}
						break;
					}
					case 'header': {
						if (this.title && this.description) {
							this.title = arg1 ? arg1 : this.name;
							this.description = arg2 ? arg2 : this.description;
							this.url = arg3 && checkUrl(arg3) ? checkUrl(arg2) : '';
						} else {
							throw embedError("miss-comp", component);
						}
						break;
					}
					case 'body': {
						if (arg1 && (arg2 || arg3)) {
							if (typeof arg1 === 'string') {
								var titleIndex = this.fields.findIndex(function(field){
									return field.name === arg1 ? true : false; 
								});
								if (titleIndex > -1) {
									if (arg2) {
										this.fields[titleIndex].name = arg2;
									}
									if (arg3) {
										this.fields[titleIndex].value = arg3;
									}
								} else {
									throw embedError("Field with name '" + arg1 + "' does not exist!");
								}
							} else if (typeof arg1 === 'number') {
								if (this.fields.length >= arg1 && arg1 > 0) {
									if (arg2) {
										this.fields[arg1 - 1].name = arg2;
									}
									if (arg3) {
										this.fields[arg1 - 1].value = arg3;
									}
								} else {
									throw embedError("Field index value out of range! Field index range: " + this.fields.length, ", index provided: " + arg1);
								}
							} else {
								throw embedError("Incorrect Field name/index value!");
							}
						}
						break;
					}
					case 'footer': {
						if (this.footer.text) {
							this.footer.text = arg1 ? arg1 : this.footer.text;
							this.footer.icon_url = arg2 &&checkUrl(arg2) ? checkUrl(arg2) : '';
						} else {
							throw embedError("miss-comp", component);
						}
						break;
					}
					default: {
						throw embedError("no-comp", component);
						break;
					}
				}
			}
        }
    });

    // --->

    function _store(action, name, value) {
        if (action === 'set') {
            if (name && !iVar.dat.$stores[name]) {
                iVar.dat.$stores[name] = JSON.stringify(value);
                _save('dat')
            }
        } else if (action === 'get') {
            if (name && iVar.dat.$stores[name]) {
                return JSON.parse(iVar.dat.$stores[name]);
            }
        }
    }

    function _setScope(scope) { // Scope Parameter verifier
        scope = scope || l;
        return (scope.toString().match(/global||local/i)[0].length > 0 ? scope : l);
    }

    function $embed(){
        return new Embed(arguments[0]);
    }

    var $ = _prop(function() { // Main function with properties
        var args = arguments, argsLen = args.length;
        var useArg = args[0];
        switch (typeof useArg) {
            case 'string': {
                if (argsLen === 1) { // For getting a iVar-local-access variable
                    if (iVar.local[useArg]) {
                        return iVar.local[useArg];
                    } else {
                        throw "Variable '" + useArg + "' does not exist!";
                    }
                } else if (argsLen >= 2) { // For setting a variable
                    var scope = _setScope(args[2]);
                    iVar[scope][useArg] = args[1];
                    _save(scope);
                }
                break;
            }
            case "object": { // For bulk declarations
                var objKeys = Object.keys(useArg), scope = _setScope(args[1]);
                if (objKeys.length) {
                    objKeys.forEach(function(key){
                        iVar[scope][key] = useArg[key];
                    });
                }
                _save(scope);
                break;
            }
            case "number": { // For indexed searching
                var scope = _setScope(args[1]), useKeys = Object.keys(iVar[scope]);
                return iVar[scope][useKeys[useArg - 1]];
                break;
            }
        }
    }, {
        get: function(name, scope) { // Returns a variable if exists (Supports iVar-global-access variables)
            scope = _setScope(scope);
            if (iVar[scope][name]) {
                return iVar[scope][name];
            } else {
                throw "Variable '" + name + "' does not exist!";
            }
        },
        set: function(name, value, scope) { // Sets a variable (You can use the shorthand method instead)
            scope = _setScope(scope);
            if (name) {
                iVar[scope][name] = value;
            }
            _save(scope);
        },
        exists: function(name, scope) { // Returns if a given variable name exists as a property (Not prototype)
            scope = _setScope(scope);
            if (name) {
                return iVar[scope].hasOwnProperty(name);
            } else {
                return false;
            }
        },
        find: function(value, scope){
            switch (typeof value) {
                /*
                case 'object':{
                    if (!(value instanceof Array)) {
                        var useKeys = Object.keys(value), mainKeys = Object.keys(iVar);
                        for (key in useKeys) {
                            switch (useKeys[key]){
                                case "$filter": {
                                    var valArr = [], keyArr = [], indArr = [];
                                    mainKeys.forEach(function(val, ind){
                                        if (value.$filter(iVar[scope][val], ind)) {
                                            valArr.push(iVar[scope][val]);
                                            keyArr.push(val);
                                            indArr.push(ind);
                                        };
                                    });
                                    return new _Find(valArr, indArr, keyArr, scope);
                                }
                            }
                        }
                    }
                }
                */
                default: {
                    scope = _setScope(scope);
                    var keyArr = [], indArr = [];
                    Object.entries(iVar[scope]).filter(function(val) {
                        return Boolean(val.indexOf(value) != -1);
                    }).forEach(function(val){
                        keyArr.push(val[0]);
                    });
                    if (keyArr.length) {
                        keyArr.forEach(function(val){
                            indArr.push(Object.keys(iVar[scope]).indexOf(val));
                        });
                        _store('lastFind', {value:value, indArr:indArr, keyArr:keyArr});
                        return new _Find(value, indArr, keyArr, scope);
                    } else {
                        return false;
                    }
                }
            }
        },
        map: function(func, scope) { // Applies the function to every variable in a scope
            scope = _setScope(scope);
            var useKeys = Object.keys(iVar[scope]);
            useKeys.forEach(function(key,ind){iVar[scope][key] = func(iVar[scope][key], ind)});
        },
        changeScope: function(name, fromScope, toScope) { // Changes the variable's scope
            fromScope = _setScope(fromScope);
            toScope = _setScope(toScope);
            if (!(fromScope === toScope)) {
                if (iVar[fromScope].hasOwnProperty(name)) {
                    iVar[toScope][name] = iVar[fromScope][name];
                    delete iVar[fromScope][name];
                    _save('all');
                } else {
                    throw "Variable '" + name + "' does not exist!";
                }
            }
        }
    })
    
    var addFuncObj = {$:$, $embed:$embed, newError:newError};
	Object.keys(addFuncObj).forEach(function(funcName){
		if (!echoGlobalObj[funcName]) {
			echoGlobalObj[funcName] = addFuncObj[funcName];
		}
	});
})(this);
