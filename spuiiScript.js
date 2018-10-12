//
// Polyfill
//
if(!Object.entries){Object.entries=function(r){var e=Object.keys(r),n=e.length,t=new Array(n);
while(n--)t[n]=[e[n],r[e[n]]];return t}}if(!Array.from){Array.from=function(){var e=Object.prototype.toString;var c=function(r){return typeof r==="function"||e.call(r)==="[object Function]"};var n=function(r){var e=Number(r);if(isNaN(e)){return 0}if(e===0||!isFinite(e)){return e}return(e>0?1:-1)*Math.floor(Math.abs(e))};var t=Math.pow(2,53)-1;var l=function(r){var e=n(r);return Math.min(Math.max(e,0),t)};return function from(r){var e=this;var n=Object(r);if(r==null){throw new TypeError("Array.from requires an array-like object - not null or undefined")}var t=arguments.length>1?arguments[1]:void undefined;var a;if(typeof t!=="undefined"){if(!c(t)){throw new TypeError("Array.from: when provided, the second argument must be a function")}if(arguments.length>2){a=arguments[2]}}var i=l(n.length);var o=c(e)?Object(new e(i)):new Array(i);var f=0;var u;while(f<i){u=n[f];if(t){o[f]=typeof a==="undefined"?t(u,f):t.call(a,u,f)}else{o[f]=u}f+=1}o.length=i;return o}}()}
//
//
//
var l = "local", g = "global", echoGlobalObj = this;
if (!Function.prototype.$proto) {
    Function.prototype.$proto = function() {
        var args = arguments, func = this;
        console.log(this);
        for (var i = 0;i < args.length; i++) {
            if (Object.entries(args[i])[0].length % 2 === 0 && Object.keys(args[i])[0]) {
                var objT = args[i];
                var keys = Object.keys(objT);
                keys.forEach(function(val,index){
                    if(!func[val]){
                        func.prototype[val] = objT[val];
                    }
                });
            } else {
                console.log("Unknown Input Method, please follow a following method:\n @param {Object} An object in a format {property: value} (Multiple property/value in a single Object accepted)");
            }
        }
    }
}
function $prop(thisArg, obj) {
	var useKeys = Object.keys(obj);
	if (useKeys.length && thisArg) {
		if (thisArg.name) {
			for (key in useKeys) {
        		thisArg[useKeys[key]] = obj[useKeys[key]];
            }
        } else {
			echoGlobalObj[Object.keys(thisArg)[0]] = thisArg[Object.entries(thisArg)[0][0]];
			for (key in useKeys) {
				console.log(key, Object.keys(thisArg)[0], echoGlobalObj[Object.keys(thisArg)[0]][useKeys[key]], obj[useKeys[key]]); 
                echoGlobalObj[Object.keys(thisArg)[0]][useKeys[key]] = obj[useKeys[key]];
            }
        }
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
    function _Find(value, indexes, keys, scope) {
        this.value = value;
        this.indexes = indexes;
        this.keys = keys;
        this.scope = _setScope(scope);
    }

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

    var toWindow = [ // Objects that will be added to the window object
        _prop(function $() { // Main function with properties
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
                                        console.log(value, value.$filter);
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
    ];

    toWindow.forEach(function(func){ // Adds each function to the Window object
        if (!echoGlobalObj[func.name]) {
            echoGlobalObj[func.name] = func;
        }
    });
})(this);
