import fs from "fs";

const fileName:string = "sites/json_snippet.json";

let fileContents = fs.readFileSync(fileName, "utf-8");
let mutableFileJsonObject: any = JSON.parse(fileContents);
// console.log(mutableFileJsonObject);

var matchRegex: RegExp = new RegExp(".*id.*|.*key.*|.*time.*|.*name.*|.*address.*", "i");
var updateCountHolder = {
  count: 0
};
replaceMatchingKeysInObj(
  mutableFileJsonObject,
  matchRegex,
  updateCountHolder
);
console.log(`updated ${updateCountHolder.count} entries`);
var yeah_json = JSON.stringify(mutableFileJsonObject);
// process.stdout.write(yeah_json+"\n");
fs.writeFileSync(fileName+".1", yeah_json, "utf-8")

console.log("complete");



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
