function abort(what) {
	throw what
}

var __emscripten_stack_alloc, _emscripten_stack_get_current, __emscripten_stack_restore, ___wasm_call_ctors, wasmMemory, thisProgram;
var HEAPU32, HEAP32, HEAPU8, HEAP8;

var __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);
var initRandomFill = () => {
	if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
		return view => crypto.getRandomValues(view)
	}
	abort("initRandomDevice")
};
var randomFill = view => (randomFill = initRandomFill())(view);
var abortOnCannotGrowMemory = requestedSize => {
	abort("OOM")
};
var __abort_js = () => {
	abort("")
};
var _emscripten_resize_heap = requestedSize => {
	var oldSize = HEAPU8.length;
	requestedSize >>>= 0;
	abortOnCannotGrowMemory(requestedSize)
};
var _getentropy = (buffer, size) => {
	randomFill(HEAPU8.subarray(buffer, buffer + size));
	return 0
};
class ExceptionInfo {
    constructor(excPtr) {
        this.excPtr = excPtr;
        this.ptr = excPtr - 24
    }
    set_type(type) {
        HEAPU32[this.ptr + 4 >> 2] = type
    }
    get_type() {
        return HEAPU32[this.ptr + 4 >> 2]
    }
    set_destructor(destructor) {
        HEAPU32[this.ptr + 8 >> 2] = destructor
    }
    get_destructor() {
        return HEAPU32[this.ptr + 8 >> 2]
    }
    set_caught(caught) {
        caught = caught ? 1 : 0;
        HEAP8[this.ptr + 12] = caught
    }
    get_caught() {
        return HEAP8[this.ptr + 12] != 0
    }
    set_rethrown(rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[this.ptr + 13] = rethrown
    }
    get_rethrown() {
        return HEAP8[this.ptr + 13] != 0
    }
    init(type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor)
    }
    set_adjusted_ptr(adjustedPtr) {
        HEAPU32[this.ptr + 16 >> 2] = adjustedPtr
    }
    get_adjusted_ptr() {
        return HEAPU32[this.ptr + 16 >> 2]
    }
}
var exceptionLast = 0;
var uncaughtExceptionCount = 0;
var ___cxa_throw = (ptr, type, destructor) => {
	var info = new ExceptionInfo(ptr);
	info.init(type, destructor);
	exceptionLast = ptr;
	uncaughtExceptionCount++;
	throw exceptionLast
};
var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
	if (!(maxBytesToWrite > 0)) return 0;
	var startIdx = outIdx;
	var endIdx = outIdx + maxBytesToWrite - 1;
	for (var i = 0; i < str.length; ++i) {
		var u = str.charCodeAt(i);
		if (u >= 55296 && u <= 57343) {
			var u1 = str.charCodeAt(++i);
			u = 65536 + ((u & 1023) << 10) | u1 & 1023
		}
		if (u <= 127) {
			if (outIdx >= endIdx) break;
			heap[outIdx++] = u
		} else if (u <= 2047) {
			if (outIdx + 1 >= endIdx) break;
			heap[outIdx++] = 192 | u >> 6;
			heap[outIdx++] = 128 | u & 63
		} else if (u <= 65535) {
			if (outIdx + 2 >= endIdx) break;
			heap[outIdx++] = 224 | u >> 12;
			heap[outIdx++] = 128 | u >> 6 & 63;
			heap[outIdx++] = 128 | u & 63
		} else {
			if (outIdx + 3 >= endIdx) break;
			heap[outIdx++] = 240 | u >> 18;
			heap[outIdx++] = 128 | u >> 12 & 63;
			heap[outIdx++] = 128 | u >> 6 & 63;
			heap[outIdx++] = 128 | u & 63
		}
	}
	heap[outIdx] = 0;
	return outIdx - startIdx
};
var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);

var __tzset_js = (timezone, daylight, std_name, dst_name) => {
    var currentYear = (new Date).getFullYear();
    var winter = new Date(currentYear, 0, 1);
    var summer = new Date(currentYear, 6, 1);
    var winterOffset = winter.getTimezoneOffset();
    var summerOffset = summer.getTimezoneOffset();
    var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
    HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
    HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
    var extractZone = timezoneOffset => {
        var sign = timezoneOffset >= 0 ? "-" : "+";
        var absOffset = Math.abs(timezoneOffset);
        var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
        var minutes = String(absOffset % 60).padStart(2, "0");
        return `UTC${sign}${hours}${minutes}`
    };
    var winterName = extractZone(winterOffset);
    var summerName = extractZone(summerOffset);
    if (summerOffset < winterOffset) {
        stringToUTF8(winterName, std_name, 17);
        stringToUTF8(summerName, dst_name, 17)
    } else {
        stringToUTF8(winterName, dst_name, 17);
        stringToUTF8(summerName, std_name, 17)
    }
};

var ENV = {};
var getExecutableName = () => thisProgram || "./this.program";
var getEnvStrings = () => {
    if (!getEnvStrings.strings) {
        var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
        var env = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG: lang,
            _: getExecutableName()
        };
        for (var x in ENV) {
            if (ENV[x] === undefined) delete env[x];
            else env[x] = ENV[x]
        }
        var strings = [];
        for (var x in env) {
            strings.push(`${x}=${env[x]}`)
        }
        getEnvStrings.strings = strings
    }
    return getEnvStrings.strings
};

var ENV = {};
var getExecutableName = () => thisProgram || "./this.program";
var getEnvStrings = () => {
    if (!getEnvStrings.strings) {
        var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
        var env = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG: lang,
            _: getExecutableName()
        };
        for (var x in ENV) {
            if (ENV[x] === undefined) delete env[x];
            else env[x] = ENV[x]
        }
        var strings = [];
        for (var x in env) {
            strings.push(`${x}=${env[x]}`)
        }
        getEnvStrings.strings = strings
    }
    return getEnvStrings.strings
};

var _environ_get = (__environ, environ_buf) => {
    var bufSize = 0;
    getEnvStrings().forEach((string, i) => {
        var ptr = environ_buf + bufSize;
        HEAPU32[__environ + i * 4 >> 2] = ptr;
        stringToAscii(string, ptr);
        bufSize += string.length + 1
    });
    return 0
};

var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
    var strings = getEnvStrings();
    HEAPU32[penviron_count >> 2] = strings.length;
    var bufSize = 0;
    strings.forEach(string => bufSize += string.length + 1);
    HEAPU32[penviron_buf_size >> 2] = bufSize;
    return 0
};

export async function loadModule(Module = {}, wasmInstance) {
	var stackRestore = val => __emscripten_stack_restore(val);
	var stackSave = () => _emscripten_stack_get_current();
	var stackAlloc = sz => __emscripten_stack_alloc(sz);

	var getCFunc = ident => {
		var func = Module["_" + ident];
		return func
	};

	var writeArrayToMemory = (array, buffer) => {
		HEAP8.set(array, buffer)
	};

	var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder : undefined;
	var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
		var endIdx = idx + maxBytesToRead;
		var endPtr = idx;
		while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
		if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
			return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr))
		}
		var str = "";
		while (idx < endPtr) {
			var u0 = heapOrArray[idx++];
			if (!(u0 & 128)) {
				str += String.fromCharCode(u0);
				continue
			}
			var u1 = heapOrArray[idx++] & 63;
			if ((u0 & 224) == 192) {
				str += String.fromCharCode((u0 & 31) << 6 | u1);
				continue
			}
			var u2 = heapOrArray[idx++] & 63;
			if ((u0 & 240) == 224) {
				u0 = (u0 & 15) << 12 | u1 << 6 | u2
			} else {
				u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63
			}
			if (u0 < 65536) {
				str += String.fromCharCode(u0)
			} else {
				var ch = u0 - 65536;
				str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
			}
		}
		return str
	};

	
	var UTF8ToString = (ptr, maxBytesToRead) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";

	var lengthBytesUTF8 = str => {
		var len = 0;
		for (var i = 0; i < str.length; ++i) {
			var c = str.charCodeAt(i);
			if (c <= 127) {
				len++
			} else if (c <= 2047) {
				len += 2
			} else if (c >= 55296 && c <= 57343) {
				len += 4;
				++i
			} else {
				len += 3
			}
		}
		return len
	};

	var stringToUTF8OnStack = str => {
		var size = lengthBytesUTF8(str) + 1;
		var ret = stackAlloc(size);
		stringToUTF8(str, ret, size);
		return ret
	};

	var ccall = (ident, returnType, argTypes, args, opts) => {
		var toC = {
			string: str => {
				var ret = 0;
				if (str !== null && str !== undefined && str !== 0) {
					ret = stringToUTF8OnStack(str)
				}
				return ret
			},
			array: arr => {
				var ret = stackAlloc(arr.length);
				writeArrayToMemory(arr, ret);
				return ret
			}
		};

		function convertReturnValue(ret) {
			if (returnType === "string") {
				return UTF8ToString(ret)
			}
			if (returnType === "boolean") return Boolean(ret);
			return ret
		}
		var func = getCFunc(ident);
		var cArgs = [];
		var stack = 0;
		if (args) {
			for (var i = 0; i < args.length; i++) {
				var converter = toC[argTypes[i]];
				if (converter) {
					if (stack === 0) stack = stackSave();
					cArgs[i] = converter(args[i])
				} else {
					cArgs[i] = args[i]
				}
			}
		}
		var ret = func(...cArgs);

		function onDone(ret) {
			if (stack !== 0) stackRestore(stack);
			return convertReturnValue(ret)
		}
		ret = onDone(ret);
		return ret
	};

	var cwrap = (ident, returnType, argTypes, opts) => {
		var numericArgs = !argTypes || argTypes.every(type => type === "number" || type === "boolean");
		var numericRet = returnType !== "string";
		if (numericRet && numericArgs && !opts) {
			return getCFunc(ident)
		}
		return (...args) => ccall(ident, returnType, argTypes, args, opts)
	};

	function initRuntime() {
		___wasm_call_ctors();
	}

	function updateMemoryViews() {
		var b = wasmMemory.buffer;
		HEAP8 = new Int8Array(b);
		HEAPU8 = new Uint8Array(b);
		HEAP32 = new Int32Array(b);
		HEAPU32 = new Uint32Array(b);
	}

	Module["wasm"] = wasmInstance;
	Module["ccall"] = ccall;
	Module["cwrap"] = cwrap;
	// let output = await WebAssembly.instantiate(base64ToArrayBuffer(base64string), imports);
	var wasmExports = wasmInstance.exports;
	loadFuntions(Module, wasmExports); // needs to be changed upon new wasm!
	updateMemoryViews();
	// initRuntime();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// constanly changing part
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function getWasmImports() {
	var wasmImports = {
		g: ___cxa_throw,
		d: __abort_js,
		f: __emscripten_memcpy_js,
		a: __tzset_js,
		e: _emscripten_resize_heap,
		b: _environ_get,
		c: _environ_sizes_get
	};
	var imports = {
		a: wasmImports
	};
	return imports;
}

function loadFuntions(Module, wasmExports) {
	thisProgram = "./RRP2Runner.js"
	wasmMemory = wasmExports["h"];
	//
	___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["i"])();
	var _createjwt = Module["_createjwt"] = (a0, a1) => (_createjwt = Module["_createjwt"] = wasmExports["k"])(a0, a1);
	__emscripten_stack_restore = a0 => (__emscripten_stack_restore = wasmExports["l"])(a0);
	__emscripten_stack_alloc = a0 => (__emscripten_stack_alloc = wasmExports["m"])(a0);
	_emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports["n"])();
}