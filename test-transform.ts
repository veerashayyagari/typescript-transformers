import { myValue } from "./refer-test";
let safely: any;

function tempRun() {
  console.log("myVal", myValue);
  console.log(safely(myValue.val1));
}
