// Polyfill
if(!Object.entries){Object.entries=function(r){var e=Object.keys(r),n=e.length,t=new Array(n);while(n--)t[n]=[e[n],r[e[n]]];return t}}if(!Array.from){Array.from=function(){var e=Object.prototype.toString;var c=function(r){return typeof r==="function"||e.call(r)==="[object Function]"};var n=function(r){var e=Number(r);if(isNaN(e)){return 0}if(e===0||!isFinite(e)){return e}return(e>0?1:-1)*Math.floor(Math.abs(e))};var t=Math.pow(2,53)-1;var l=function(r){var e=n(r);return Math.min(Math.max(e,0),t)};return function from(r){var e=this;var n=Object(r);if(r==null){throw new TypeError("Array.from requires an array-like object - not null or undefined")}var t=arguments.length>1?arguments[1]:void undefined;var a;if(typeof t!=="undefined"){if(!c(t)){throw new TypeError("Array.from: when provided, the second argument must be a function")}if(arguments.length>2){a=arguments[2]}}var i=l(n.length);var o=c(e)?Object(new e(i)):new Array(i);var f=0;var u;while(f<i){u=n[f];if(t){o[f]=typeof a==="undefined"?t(u,f):t.call(a,u,f)}else{o[f]=u}f+=1}o.length=i;return o}}()}if(!Array.prototype.includes){Object.defineProperty(Array.prototype,"includes",{value:function(e,r){if(this==null){throw new TypeError('"this" is null or not defined')}var t=Object(this);var a=t.length>>>0;if(a===0){return false}var n=r|0;var i=Math.max(n>=0?n:a-Math.abs(n),0);function sameValueZero(e,r){return e===r||typeof e==="number"&&typeof r==="number"&&isNaN(e)&&isNaN(r)}while(i<a){if(sameValueZero(t[i],e)){return true}i++}return false}})}Array.prototype.find=Array.prototype.find||function(r){if(this===null){throw new TypeError("Array.prototype.find called on null or undefined")}else if(typeof r!=="function"){throw new TypeError("callback must be a function")}var n=Object(this);var t=n.length>>>0;var e=arguments[1];for(var o=0;o<t;o++){var a=n[o];if(r.call(e,a,o,n)){return a}}};if(typeof Object.assign!="function"){Object.defineProperty(Object,"assign",{value:function assign(e,r){"use strict";if(e==null){throw new TypeError("Cannot convert undefined or null to object")}var t=Object(e);for(var n=1;n<arguments.length;n++){var o=arguments[n];if(o!=null){for(var i in o){if(Object.prototype.hasOwnProperty.call(o,i)){t[i]=o[i]}}}}return t},writable:true,configurable:true})};
//
var l = "local", g = "global";

(function(echoGlobalObj){
  use spuiiDat;
  
  var serverRoles = {
      name: Server.Roles.map(function(roleEntry){var useObj = {}; useObj[roleEntry.Name] = roleEntry;return useObj}).reduce(function(parentObj, childObj){return Object.assign(parentObj, childObj);},{}),
      id: Server.Roles.map(function(roleEntry){var useObj = {}; useObj[roleEntry.ID] = roleEntry;return useObj}).reduce(function(parentObj, childObj){return Object.assign(parentObj, childObj);},{})
  };
  
  
  // SpuiiVar constructor
  function SpuiiVar(){
    // Getting user data and their roles
    var userData = {
      get data() {
        return Server.Members.find(function(entry){
          return RawUserID === entry.User.ID;
      });
    }}, userRoles = {
      get data() {
        userData.data.Roles.map(function(roleID){
          return Server.Roles.find(function(roleObj){
            return roleObj.ID === roleObj;
          });
        });
      }
    };
    this.global = {};
    this.local = {};
    this.dat = {$stores: {}, $resp:[], $user:{
      get ID(){return userData.data.User.ID;},
      get Username() {return userData.data.User.Username;}, 
      get AvatarID() {return userData.data.User.Avatar;},
      get AvatarURL() {return "https://cdn.discordapp.com/avatars/" + this.ID + "/" + this.AvatarID + ".png";},
      get isBot() {return userData.data.User.Bot;},
      get JoinDate() {return new Date(userData.data.JoinedAt).toGMTString();},
      get Nick() {return userData.data.Nick;},
      get Mention() {return "<@" + this.ID + ">";},
      Roles: {
        get Names() {return userRoles.data.map(function(roleObj){return roleObj.Name;})}
      }}
    };
  }
  
  // Constructing globally-inaccessible SpuiiVar
  var spuiiVar = new SpuiiVar(), thisUser = spuiiVar.dat.$user;
  
  // Load the data if database entry exists, if not, create one with a defined structure --->
  if (spuiiDat['iVar-local'+ RawUserID]) {
    spuiiVar.local = JSON.parse(spuiiDat['spuiiVar-local'+ RawUserID]);
  } else {
    spuiiDat['spuiiVar-local'+ RawUserID] = JSON.stringify(spuiiVar.local);
  }
  if (spuiiDat['spuiiVar-global']) {
    spuiiVar.global = JSON.parse(spuiiDat['spuiiVar-global'])
  } else {
    spuiiDat['spuiiVar-global'] = JSON.stringify(spuiiVar.global);
  }
  if (spuiiDat['spuiiVar-dat'+ RawUserID]) {
    var savedDat = JSON.parse(spuiiDat['spuiiVar-dat'+ RawUserID]),
        loadedKeys = Object.keys(spuiiVar.dat);
    loadedKeys.forEach(function(key){
      spuiiVar.dat[key] = savedDat[key];
    });
  } else {
    spuiiDat['spuiiVar-dat'+ RawUserID] = JSON.stringify(spuiiVar.dat);
  }
  // <---
  
  // Private Functions --->
  // Save to database function
  function _save(type) {
    // Type argument default value if not specified
    type = new RegExp(type + ",", "i").test("all, local, global, dat") ? type : 'all';
    if (type === 'all') {
      // Set all variables
      spuiiDat['spuiiVar-local'+ RawUserID] = JSON.stringify(spuiiVar.local);
      spuiiDat['spuiiVar-global'] = JSON.stringify(spuiiVar.global);
      spuiiDat['spuiiVar-dat'+ RawUserID] = JSON.stringify(spuiiVar.dat);
    } else {
      spuiiDat['spuiiVar-' + type + RawUserID] = JSON.stringify(spuiiVar[type]);
    }
  }
  
  // Property Setter (Object return version)
  function _prop(thisArg, obj) {
    var useKeys = Object.keys(obj);
    if (useKeys.length && thisArg) {
      for (key in useKeys) {
        thisArg[useKeys[key]] = obj[useKeys[key]];
      }
      return thisArg;
    }
  }
  
  // Store to $store object of spuiiVar.dat
  function _store(action, name, value) {
    if (action === 'set') {
      if (name && !spuiiVar.dat.$stores[name]) {
        spuiiVar.dat.$stores[name] = JSON.stringify(value);
        _save('dat')
      }
    } else if (action === 'get') {
      if (name && spuiiVar.dat.$stores[name]) {
        return JSON.parse(spuiiVar.dat.$stores[name]);
      }
    }
  }
  
  // Scope Parameter verifier
  function _setScope(scope) {
    scope = scope || l;
    return (scope.toString().match(/global||local/i)[0].length > 0 ? scope : l);
  }
  // <---

  // Constructors --->
  // Find constructor, prototypial properties soon 
  function Find(value, indexes, keys, scope) {
    this.value = value;
    this.indexes = indexes;
    this.keys = keys;
    this.scope = _setScope(scope);
  }
  
  // Role object constructor with prototypial properties 
  /*
  var RoleObj = $proto(function(roleInput) {
    if (roleInput)
  }, {
       get Color() {},
       get Hoisted() {},
       get ID() {},
       get isManaged() {}, 
       get isMentionable() {},
       get Name() {},
       get Permissions() {},
       get Position() {},
       properties: "Color, Hoisted, ID, isManaged, isMentionable, Name, Permissions, Position";
  });*/

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

  function $embed(){
      return new Embed(arguments[0]);
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

  var $ = _prop(function() { // Main function with properties
      var args = arguments, argsLen = args.length;
      var useArg = args[0];
      switch (typeof useArg) {
          case 'string': {
              if (argsLen === 1) { // For getting a spuiiVar-local-access variable
                  if (spuiiVar.local[useArg]) {
                      return spuiiVar.local[useArg];
                  } else {
                      throw "Variable '" + useArg + "' does not exist!";
                  }
              } else if (argsLen >= 2) { // For setting a variable
                  var scope = _setScope(args[2]);
                  spuiiVar[scope][useArg] = args[1];
                  _save(scope);
              }
              break;
          }
          case "object": { // For bulk declarations
              var objKeys = Object.keys(useArg), scope = _setScope(args[1]);
              if (objKeys.length) {
                  objKeys.forEach(function(key){
                      spuiiVar[scope][key] = useArg[key];
                  });
              }
              _save(scope);
              break;
          }
          case "number": { // For indexed searching
              var scope = _setScope(args[1]), useKeys = Object.keys(spuiiVar[scope]);
              return spuiiVar[scope][useKeys[useArg - 1]];
              break;
          }
      }
  }, {
      get: function(name, scope) { // Returns a variable if exists (Supports spuiiVar-global-access variables)
          scope = _setScope(scope);
          if (spuiiVar[scope][name]) {
              return spuiiVar[scope][name];
          } else {
              throw "Variable '" + name + "' does not exist!";
          }
      },
      set: function(name, value, scope) { // Sets a variable (You can use the shorthand method instead)
          scope = _setScope(scope);
          if (name) {
              spuiiVar[scope][name] = value;
          }
          _save(scope);
      },
      exists: function(name, scope) { // Returns if a given variable name exists as a property (Not prototype)
          scope = _setScope(scope);
          if (name) {
              return spuiiVar[scope].hasOwnProperty(name);
          } else {
              return false;
          }
      },
      find: function(value, scope){
          switch (typeof value) {
              /*
              case 'object':{
                  if (!(value instanceof Array)) {
                      var useKeys = Object.keys(value), mainKeys = Object.keys(spuiiVar);
                      for (key in useKeys) {
                          switch (useKeys[key]){
                              case "$filter": {
                                  var valArr = [], keyArr = [], indArr = [];
                                  mainKeys.forEach(function(val, ind){
                                      if (value.$filter(spuiiVar[scope][val], ind)) {
                                          valArr.push(spuiiVar[scope][val]);
                                          keyArr.push(val);
                                          indArr.push(ind);
                                      };
                                  });
                                  return new Find(valArr, indArr, keyArr, scope);
                              }
                          }
                      }
                  }
              }
              */
              default: {
                  scope = _setScope(scope);
                  var keyArr = [], indArr = [];
                  Object.entries(spuiiVar[scope]).filter(function(val) {
                      return Boolean(val.indexOf(value) != -1);
                  }).forEach(function(val){
                      keyArr.push(val[0]);
                  });
                  if (keyArr.length) {
                      keyArr.forEach(function(val){
                          indArr.push(Object.keys(spuiiVar[scope]).indexOf(val));
                      });
                      _store('lastFind', {value:value, indArr:indArr, keyArr:keyArr});
                      return new Find(value, indArr, keyArr, scope);
                  } else {
                      return false;
                  }
              }
          }
      },
      map: function(func, scope) { // Applies the function to every variable in a scope
          scope = _setScope(scope);
          var useKeys = Object.keys(spuiiVar[scope]);
          useKeys.forEach(function(key,ind){spuiiVar[scope][key] = func(spuiiVar[scope][key], ind)});
      },
      changeScope: function(name, fromScope, toScope) { // Changes the variable's scope
          fromScope = _setScope(fromScope);
          toScope = _setScope(toScope);
          if (!(fromScope === toScope)) {
              if (spuiiVar[fromScope].hasOwnProperty(name)) {
                  spuiiVar[toScope][name] = spuiiVar[fromScope][name];
                  delete spuiiVar[fromScope][name];
                  _save('all');
              } else {
                  throw "Variable '" + name + "' does not exist!";
              }
          }
      }
  })

  var addFuncObj = {$:$, $embed:$embed, newError:newError, thisuser:thisUser};
Object.keys(addFuncObj).forEach(function(funcName){
  if (!echoGlobalObj[funcName]) {
    echoGlobalObj[funcName] = addFuncObj[funcName];
  }
});
})(this);

// Function to set bulk prototype properties, thisArg: function/object, obj: object, returns the modified object/function
function $proto(thisArg, obj) {
  "use strict";
  // Checking for a function or an object as the first argument
	if (typeof thisArg !== "function" || (typeof thisArg === "object" && (thisArg === null || thisArg instanceof Array))) {
	  throw "``$proto:`` Expected a function or an object on the first argument, got '" + typeof thisArg !== "function" && typeof thisArg !== "object" ? typeof thisArg : (thisArg === null ? "null" : (thisArg instanceof Array ? "array" : "undefined object")) + "'.";
  // Checking for an object as the second argument
	} else if (typeof obj !== "object" || (obj === null || obj instanceof Array)) {
    throw "``$proto:`` Expected an object on the second argument, got '" + typeof obj !== "object" ? typeof obj : (obj === null ? "null" : (obj instanceof Array ? "array" : "undefined object")) + "'.";
  // Checking if object is empty
  } else if (!Object.entries(obj).length) {
    throw "``$proto:`` Cannot add prototypeial properties from an empty object!";
  }
  // Removing any blank property
  var objEntry = Object.entries(obj).filter(function(entry) {
		return entry[0] ? true : false;
	});
	if (objEntry.length) {
    // Adding properties
		objEntry.forEach(function(entry){
			thisArg.prototype[entry[0]] = entry[1];
		});
    return thisArg;
	} else {
		throw "``$proto:`` Cannot add prototypial properties from an object with missing values!";
	}
}

// Function to set bulk properties, thisArg: function/object, obj: object, returns the modified object/function
function $prop(thisArg, obj) {
  "use strict";
  // Checking for a function or an object as the first argument
	if (typeof thisArg !== "function" || (typeof thisArg === "object" && (thisArg === null || thisArg instanceof Array))) {
	  throw "``$prop:`` Expected a function or an object on the first argument, got '" + typeof thisArg !== "function" && typeof thisArg !== "object" ? typeof thisArg : (thisArg === null ? "null" : (thisArg instanceof Array ? "array" : "undefined object"))  + "'.";
  // Checking for an object as the second argument
	} else if (typeof obj !== "object" || (obj === null || obj instanceof Array)) {
    throw "``$prop:`` Expected an object on the second argument, got '" + typeof obj !== "object" ? typeof obj : (obj === null ? "null" : (obj instanceof Array ? "array" : "undefined object")) + "'.";
  // Checking if object is empty
  } else if (!Object.entries(obj).length) {
    throw "``$prop:`` Cannot add properties from an empty object!";
  }
  var objEntries = Object.keys(obj);
  if (thisArg.length) {
    objEntries.forEach(function(entry) {
      // Adding properties
      thisArg[entry[0]] = entry[1];
    });
  } else {
    throw "$prop: Cannot add properties from an object with missing values!";
  }
}

// Checks if a URL is of a specific format, url: string, format: string
function checkUrl(url, format) {
  // Checking for any blank values
  if (url && typeof url === "string") {
    var filteredUrl;
    if (format && typeof format === "string") {
      if (["img", "pic", "image", "picture"].includes(format.toLowerCase())) {
        // Matches URL's with file extension and returns the global find
        filteredUrl = url.match(/^((http|https)\:\/\/)*((\w*)\.)*(\w+)\.(\w+)\/(.*)\/(\w+)\.(png|jpg|jpeg|gif|bmp)/g);
      }
    } else {
      // Matching ordinary urls
      if (!format || format === 'url') {
        filteredUrl = url.match(/^((http|https)\:\/\/)*((\w*)\.)*(\w+)\.(\w+)\/(.*)/g);
      }
    }
    return filteredUrl ? filteredUrl[0] : false;
  } else {
    return false;
  }
}
