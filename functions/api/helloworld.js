
import { decode64 } from '../../jdevtools/jdevtools';
import { loadModule, getWasmImports } from '../../jdevtools/jdevwasm';
import jwtjson from '../../jdevtools/jdevsettings.json' assert { type: "json" };
import wasm1 from './jwtcreator.wasm';


function createjwt(modulus, ip, username = "jhonny") {
	const minute1 = 60 * 1000;
	const currentTime = Date.now();
	const expirationTime = currentTime + jwtjson.Token.ExpireMinute * minute1;

	let payload = {
		username: username,
		ip: ip,
		iss: jwtjson.Token.Issuer,
		iat: currentTime,
		exp: expirationTime,
	};

	return modulus.ccall("createjwt", "string", ["string", "string"],
		[jwtjson.Token.Secret, JSON.stringify(payload)]);
}

var payload1 = {};
function problemWithJwt(jwt, modulus, username) {
	const [header64, payload64, signature] = jwt.split('.');

	let s_payload = decode64(payload64);
	payload1 = JSON.parse(s_payload);

	let test64 = modulus.ccall("createjwt", "string", ["string", "string"],
		[jwtjson.Token.Secret, s_payload]);

	if (test64 != jwt) return 1;
	if (payload1["username"] != username) return 2;
	if (payload1["exp"] < Date.now()) return 3;
	return 0;
}

export async function onRequest(context) {
	let timeis = Date.now();
	const url1 = (new URL(context.request.url)).searchParams;
	const ipAddress = context.request.headers.get('x-forwarded-for') || '127.0.0.1';

	var modulus = {};
	const instance = await WebAssembly.instantiate(wasm1, getWasmImports());
	await loadModule(modulus, instance);

	if (url1.get("func") == "create") {
		let resp1 = `{"time":${timeis},"jwt":"${createjwt(modulus, ipAddress, url1.get("user"))}"}`
		return new Response(resp1);
	}

	if (url1.get("func") == "check") {
		let caseis = problemWithJwt(url1.get("jwt"), modulus, url1.get("user"));
		if (caseis == 0) return new Response("welcome back user: " + payload1["username"] + "; at: " + payload1["ip"]);
		if (caseis == 3) return new Response("expired");
		if (caseis) return new Response("wrong jwt");
	}

	return new Response("hi " + ipAddress);
}