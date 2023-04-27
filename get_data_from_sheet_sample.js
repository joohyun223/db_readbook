const scUrl = "http://clienturl";
const bookSheet = "도서목록 원본";
const lostBookSheet = "분실도서목록";
function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [
    {
      name: "업데이트하기",
      functionName: "checkDeployPw",
    },
  ];
  sheet.addMenu("목록 업데이트", entries);
}
function checkDeployPw() {
  var ui = SpreadsheetApp.getUi();
  var prompt = ui.prompt("배포 비밀번호를 입력하세요");
  var data = JSON.stringify({ pw: prompt.getResponseText() });
  var options = {
    method: "post",
    contentType: "application/json",
    payload: data,
  };
  var resp = UrlFetchApp.fetch(`${scUrl}/util/checkDepPass`, options);
  if (JSON.parse(resp).result == "ok") {
    exportJson();
    ui.alert("도서목록 업데이트가 완료되었습니다.");
  } else {
    ui.alert("배포 비밀번호 불일치.");
  }
}

function exportJson() {
  let data = JSON.parse(
    makeJson(
      SpreadsheetApp.getActive().getSheetByName(bookSheet).getDataRange()
    )
  );
  let lostBook = SpreadsheetApp.getActive()
    .getSheetByName("분실도서목록")
    .getDataRange()
    .getValues();

  for (i in lostBook) {
    if (i < 2) continue;

    let num = lostBook[i][0].toString();
    if (!num.length) break;

    data.forEach((_d, j) => {
      if (_d.admn === lostBook[i][2]) _d.isLost = true;
    });
  }
  console.log("data", data.length);
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),
  };
  UrlFetchApp.fetch(`${scUrl}/books/update`, options);
}

var nameArray = [
  "no",
  "applicant",
  "name",
  "price",
  "isbn",
  "link",
  "purchase_avail",
  "degree",
  "purchase_way",
  "year_of_purchase",
  "admn",
  "lender",
];

function makeJson(dataRange) {
  var charSep = '"';

  var result = "",
    thisName = "",
    thisData = "";

  var frozenRows = SpreadsheetApp.getActiveSheet().getFrozenRows();
  var dataRangeArray = dataRange.getValues();
  var dataWidth = dataRange.getWidth();
  var dataHeight = dataRange.getHeight() - frozenRows;

  result += "[";

  for (var h = 0; h < dataHeight; ++h) {
    if (dataRangeArray[h + frozenRows][0].length === 0) {
      continue;
    }
    result += "{";

    for (var i = 0; i < dataWidth; ++i) {
      thisName = nameArray[i];
      thisData = dataRangeArray[h + frozenRows][i];

      result += charSep + thisName + charSep + ":";

      result += charSep + jsonEscape(thisData) + charSep + ", ";
    }

    result = result.slice(0, -2);

    result += "},\n";
  }

  result = result.slice(0, -2);

  result += "]";

  return result;
}

function jsonEscape(str) {
  if (typeof str === "string" && str !== "") {
    return str
      .replace(/\n/g, "<br/>")
      .replace(/\r/g, "<br/>")
      .replace(/\t/g, "\\t");
  } else {
    return str;
  }
}
