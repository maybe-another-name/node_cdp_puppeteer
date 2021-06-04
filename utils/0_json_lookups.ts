import fs from "fs";

const data = `{
  "name" : "Alex",
  "age" : 20,
  "grade" : "A"
}`;

let testJson = JSON.parse(data);
console.log(testJson);
console.log(
  `Name: ${testJson.name}, Age: ${testJson.age}, Grade: ${testJson.grade}`
);

var testKey: string;
var matchRegex: RegExp = new RegExp("name", "i");
for (testKey in testJson) {
  if (testKey.match(matchRegex)) {
    console.log(`found matching key: ${testKey}`);
  }
}

let fileContents = fs.readFileSync("sites/json_snippet.json", "utf-8");
let fileJsonObject: any = JSON.parse(fileContents);
console.log(fileJsonObject);

const keyToLookup: string = "ServerVersionInfo";
const lookupResult: any = lookupKeyInObject(fileJsonObject, keyToLookup);
const lookupResultString = JSON.stringify(lookupResult);
console.log(`lookup result: ${lookupResultString}`);

var matchRegex: RegExp = new RegExp(".*topic.*", "i");
var matchResult: any[] = [];
matchKeysInObj(fileJsonObject, matchRegex, matchResult);
const matchResultString = JSON.stringify(matchResult);
console.log(`match result: ${matchResultString}`);

// recursive search for nested keys
// https://stackoverflow.com/questions/38805134/search-key-in-nested-complex-json

function lookupKeyInObject(obj: any, key: string): any {
  if (typeof obj != "object") {
    return;
  }
  if (!obj) {
    return;
  }
  var result: any = "";
  if (obj.hasOwnProperty(key)) {
    return obj[key];
  } else {
    for (var child_key in obj) {
      result = lookupKeyInObject(obj[child_key], key);
      if (result) break;
      continue;
    }
  }
  return result;
}

function matchKeysInObj(obj: any, regex: RegExp, matches: any[]): void {
  if (typeof obj != "object") {
    return;
  }
  if (!obj) {
    return;
  }
  for (var child_key in obj) {
    if (child_key.match(regex)) {
      let objString = JSON.stringify(obj)
      console.log(`found matching key in object : ${objString}`);
      matches.push(child_key);
    }
    matchKeysInObj(obj[child_key], regex, matches);
  }

  return;
}

