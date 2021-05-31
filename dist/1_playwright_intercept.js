"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chromium = require("playwright-core").chromium;
function test_for_resource_type(resource_type, request) {
    if (request.resourceType() === resource_type) {
        console.log("aborting " + resource_type + " request to " + request.url());
        return true;
    }
    return false;
}
function setupRouting(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // file extensions are separate routes (additional suffixes would interfere)
                return [4 /*yield*/, page.route("**/*.{png,jpg,jpeg}", function (route) {
                        var request = route.request();
                        console.log("aborting request to  " + request.url());
                        route.abort();
                    })];
                case 1:
                    // file extensions are separate routes (additional suffixes would interfere)
                    _a.sent();
                    return [4 /*yield*/, page.route("**/*.{js}", function (route) {
                            var request = route.request();
                            console.log("aborting to " + request.url());
                            route.abort();
                        })];
                case 2:
                    _a.sent();
                    // Abort based on the request type
                    return [4 /*yield*/, page.route("**/*", function (route) {
                            var request = route.request();
                            // test based on content-types
                            if (test_for_resource_type("image", request)) {
                                return route.abort();
                            }
                            if (test_for_resource_type("script", request)) {
                                return route.abort();
                            }
                            // default accept
                            console.log("default proceed to host " + request.url());
                            return route.continue();
                        })];
                case 3:
                    // Abort based on the request type
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser_options, browser, page;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                browser_options = {
                    headless: false,
                    executablePath: "/usr/bin/chromium",
                    userDataDir: "local_chrome_data",
                    args: ["--proxy-server=http://127.0.0.1:8080"],
                    ignoreDefaultArgs: ["--disable-extensions"],
                };
                console.log("launching browser");
                return [4 /*yield*/, chromium.launchPersistentContext(
                    // userDataDir:browser_options.userDataDir,
                    // (options = browser_options)
                    )];
            case 1:
                browser = _a.sent();
                console.log("browser new page");
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                setupRouting(page);
                console.log("navigating browser");
                return [4 /*yield*/, page.goto("https://techoverflow.net/")];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.screenshot({ path: "example.png" })];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
