import fs from "fs";

const fileName: string = "sites/json_snippet.json";

let fileContents = fs.readFileSync(fileName, "utf-8");
let mutableFileJsonObject: any = JSON.parse(fileContents);
// console.log(mutableFileJsonObject);

var updateCountHolder = {
  count: 0,
};

const specialKeyword = "fabulous";
// const longValueRegex:RegExp = /\S{16,}/gi;
const longValueAndSpecialKeywordRegex: string = `\\S{16,}|.*${specialKeyword}.*`;

const valueMatchRegex: RegExp = new RegExp(
  longValueAndSpecialKeywordRegex,
  "gi"
);
replaceMatchingValuesInObj(
  mutableFileJsonObject,
  valueMatchRegex,
  updateCountHolder
);
console.log(
  `updated ${updateCountHolder.count} long value and special entries`
);

updateCountHolder.count = 0;
const keyMatchRegex: RegExp = /.*id.*|.*key.*|.*time.*|.*name.*|.*address.*/i;
replaceMatchingKeysInObj(
  mutableFileJsonObject,
  keyMatchRegex,
  updateCountHolder
);
console.log(`updated ${updateCountHolder.count} matching key entries`);
// process.stdout.write(yeah_json+"\n");

var yeah_json = JSON.stringify(mutableFileJsonObject);
fs.writeFileSync(fileName + ".1", yeah_json, "utf-8");
console.log("wrote updated file to disk");

function replaceMatchingValuesInObj(
  mutableObj: any,
  regex: any,
  updateCountHolder: any
) {
  if (typeof mutableObj != "object") {
    return;
  }
  if (!mutableObj) {
    return;
  }
  for (var child_key in mutableObj) {
    let child_val: any = mutableObj[child_key];
    if (typeof child_val == "string") {
      if ((child_val as string).match(regex)) {
        // console.log(`found a match for key: ${child_key}`);
        mutableObj[child_key] = "blah";
        updateCountHolder.count++;
      }
    }
    replaceMatchingValuesInObj(mutableObj[child_key], regex, updateCountHolder);
  }

  return;
}

function replaceMatchingKeysInObj(
  mutableObj: any,
  regex: RegExp,
  updateCountHolder: any
) {
  if (typeof mutableObj != "object") {
    return;
  }
  if (!mutableObj) {
    return;
  }
  for (var child_key in mutableObj) {
    if (child_key.match(regex)) {
      let objString = JSON.stringify(mutableObj);
      // console.log(`found matching key in object : ${objString}`);
      mutableObj[child_key] = "splendid";
      updateCountHolder.count++;
    }
    replaceMatchingKeysInObj(mutableObj[child_key], regex, updateCountHolder);
  }

  return;
}
