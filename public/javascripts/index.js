  var tableColumnNames = (`
    questionId,
    questionText,
    questionPicture,
    arabicTranslationOfQuestion,
    chapterNameTopic,
    duration,
    justification,
    justificationType,
    arabicTranslationOfJustification,
    justificationImage,
    hint,
    arabicTranslationOfHint,
    subject,
    skillProfile,
    questionType,
    subTopic,
    contentType,
    difficultyLevel,
    optionA,
    optionB,
    optionC,
    optionD,
    correctOptions,
    inputType,
    cat1,
    cat2,
    cat3`).split(",").map(item => item.replace(/[^a-zA-Z0-9_]/gi,''));

var textEditorColumnNames = {
  values: (`
    questionText,
    arabicTranslationOfQuestion,
    justification,
    arabicTranslationOfJustification,
    hint,
    arabicTranslationOfHint,
    optionA,
    optionB,
    optionC,
    optionD`).split(",").map(item => item.replace(/[^a-zA-Z0-9_]/gi,'')),
  texts: {
    questionText: 'Question Text',
    arabicTranslationOfQuestion: 'Question Text (Arabic)',
    justification: 'Justification',
    arabicTranslationOfJustification: 'Justification (Arabic)',
    hint: 'Hint(s)',
    arabicTranslationOfHint: 'Hint (Arabic)',
    optionA: 'Option A',
    optionB: 'Option B',
    optionC: 'Option C',
    optionD: 'Option D'
  }
}

var inputColumns = {
  values: (`
    questionId,
    questionPicture,
    chapterNameTopic,
    duration,
    justificationType,
    justificationImage,
    subject,
    skillProfile,
    questionType,
    subTopic,
    contentType,
    difficultyLevel,
    correctOptions,
    inputType,
    cat1,
    cat2,
    cat3`).split(",").map(item => item.replace(/[^a-zA-Z0-9_]/gi,'')),
  texts: {
    questionId: 'Question Id',
    questionPicture: 'Question Image',
    chapterNameTopic: '(Chapter Name&nbsp;/&nbsp;Topic)',
    duration: 'Duration',
    justificationType: 'Justification Type',
    justificationImage: 'Justification Image',
    subject: 'Subject',
    skillProfile: 'Skill Profile',
    questionType: 'Question Type',
    subTopic: 'Subtopic',
    contentType: 'Content Type',
    difficultyLevel: 'Difficulty',
    correctOptions: 'Correct Options',
    inputType: 'Input Type',
    cat1: 'cat1',
    cat2: 'cat2',
    cat3: 'cat3'
  }
}

var selColumn = `questionText`;
var selectedIndex = -1;
var selectedRow = null;
var table;

function toString(val) {
  if (!val) return "";
  return val.toString();
}

function formatTableText(txt, maxLen = 30) {
  txt = toString(txt);
  txt = txt.replace(`<p>`, "").replace(`</p>`, "");
  if (maxLen != -1 && txt.length > maxLen) {
    return txt.slice(0, maxLen - 2) + "...";
  }
  return txt;
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function Uncapitalize(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
function fetchById(newID) {
  if (newID) {
    LaTexId = newID;
  }
  $.ajax({
    type: "POST",
    url: "/fetchExcelById",
    data: $.param({
      LaTexId
    }),
    processData: false,
    success: function(res) {
      console.log("fetchExcelById", res);
      XLSData = res.laTex.items;
      LaTexName = res.laTex.name;
      LaTexId = res.laTex.id;
      selectedIndex = -1;
      renderFromJson(XLSData);
    }
  });
}


$("#availableColumns").html(textEditorColumnNames.values.map(item => 
    `<option value="${item}" ${item==selColumn? "selected": ""}>${textEditorColumnNames.texts[item]}</option>`).join(""));


$("#inputColumns").html(inputColumns.values.map(item => 
    `<div class="field grid__field">
      <label class="field__label is-primary" for="item-${item}">${inputColumns.texts[item]}</label>
      <div class="field-body">
        <input
          type="text"
          id="item-${item}"
          class="input"
          onkeyup="inputColumnChange('${item}', event)"
          ${item === 'questionId' ? 'readonly' : ''}
        >
      </div>
    </div>`).join(""));


$.ajax({
  type: "POST",
  url: "/fetchExcelIds",
  processData: false,
  success: function(res) {
    console.log("fetchExcelIds", res);
    var availableExcelsHTML = ``;
    for (var i = 0; i < res.laTexes.length; i ++) {
      availableExcelsHTML += `<option value="${res.laTexes[i].id}">${res.laTexes[i].name} ${res.laTexes[i].id}</option>`
    }
    $("#availableExcels").html(availableExcelsHTML);

    if (res.laTexes.length) {
      fetchById(res.laTexes[0].id);
    }
  }
});

$('#availableExcels').change(function(){
    var selID = $(this).find("option:selected").attr('value');
    console.log("selID", selID);
    fetchById(selID);      
});

function parseExcel() {
  files = $("#uploadExcel").get(0).files;
  if (!files.length) return;
  var file = files[0];

  var reader = new FileReader();

  reader.onload = function(e) {
    var data = e.target.result;
    var workbook = XLSX.read(data, {
      type: 'binary'
    });

    workbook.SheetNames.forEach(function(sheetName) {
      // Here is your object
      var XLSData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      for (var i = 0; i < XLSData.length; i ++) {
        var objKeys = Object.keys(XLSData[i]);
        console.log("object.keys", objKeys, XLSData[i]);
        for (var j = 0; j < objKeys.length; j ++) {
          var key = objKeys[j];
          console.log("object key", key);
          if (key.indexOf(" ") != -1 || key.indexOf("_") != -1) {
            var updatedkey = key;
            var updatedkey = updatedkey.split(' ').map(item => capitalize(item)).join("");
            var updatedkey = updatedkey.split('_').map(item => capitalize(item)).join("");
            var updatedkey = Uncapitalize(updatedkey);
            console.log("updatedKey", key, updatedkey);
            XLSData[i][updatedkey] = XLSData[i][key];
            delete XLSData[i][key];
          }
        }
        XLSData[i].questionId = XLSData[i].id;
        delete XLSData[i].id;
      }
      console.log("XLSData", XLSData);
      $.ajax({
        type: "POST",
        url: "/uploadNewExcel",
        data: $.param({
          XLSData: JSON.stringify(XLSData)
        }),
        processData: false,
        success: function(res) {
          console.log(res);
          LaTexId = res.laTex.id;
          fetchById();
        }
      });
      // renderFromJson(XLSData);
    })

  };

  reader.onerror = function(ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(file);
}



function renderFromJson(XLSData) {

  table = new Tabulator(".table-data", {
    data:XLSData,           //load row data from array
    selectable:1,
    layout:"fitColumns",      //fit columns to width of table
    responsiveLayout:"hide",  //hide columns that dont fit on the table
    tooltips:true,            //show tool tips on cells
    pagination:"local",       //paginate the data
    paginationSize:14,         //allow 7 rows per page of data
    resizableRows:true,       //allow row order to be changed
    addRowPos:"bottom",
    columns:[                 
      {title:"Question Id", field:"questionId", width:120},
      {title:"Question Text", field:"questionText", width:180},
      {title:"Subject", field:"subject", width:100},
      {title:"Difficulty", field:"difficultyLevel", width:150},
    ],
    rowSelectionChanged: function(data, rows){
      // console.log(data)
      if (!data.length) return;
      selectedRow = data[0];
      // console.log("selectedRow", selectedRow);
      selectedIndex = rows[0].getIndex();
      // console.log("selectedIndex", selectedIndex);
      CKEDITOR.instances.editor1.setData(toString(data[0][selColumn]))
      inputColumns.values.forEach(item => {
        // console.log("set Value", `.tagInput #item-${item}`, data[0][item])
        $(`#item-${item}`).val(data[0][item]);
      })
    },
  });
}
$("#uploadExcel").change(parseExcel);

var LaTexId;

function addNewRow() {

  var questionId = toString(parseInt(Math.random() * 10000));
  var newRow = {
    laTexId: LaTexId,
    questionId: questionId,
    questionText: "<p>New Question</p>"
  };
  table.addRow(newRow);
}

function makeACopy() {
  if (selectedRow) {
    var newRow = JSON.parse(JSON.stringify(selectedRow));
    table.addRow(newRow);
    // table.setData(XL_row_object)
    // .then(function() {
    //   table.setPage(table.getPageMax());
    // })
  }
}

$('#availableColumns').change(function(){
    selColumn = $(this).find("option:selected").attr('value');

    if (selectedRow)
      CKEDITOR.instances.editor1.setData(toString(selectedRow[selColumn]));
});

function inputColumnChange(catName, e) {
  console.log("catName", catName, e.target.value);
  if (selectedRow) {
    selectedRow[catName] = e.target.value;
    var tableBodyRows = {
          "questionId": 1,
          "questionText": 2,
          "subject": 3,
          "difficultyLevel": 4
        };

    if (tableBodyRows[catName]) {
      table.updateRow(selectedIndex, selectedRow);
    }
  }
}

// CKEDITOR.editorConfig = function( config ) {
//   config.mathJaxLib = '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML';
//   config.mathJaxClass = 'equation';
// };

// CKEDITOR.plugins.addExternal( 'mathjax', 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/', 'MathJax.js' );


        CKEDITOR.replace( 'editor1', {
          extraPlugins: 'mathjax',
          mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
          height: 320
        } );
      

CKEDITOR.instances.editor1.on('change', function() { 
    var currentData = CKEDITOR.instances.editor1.getData();

    // console.log(currentData);
    if (selectedRow) {
      selectedRow[selColumn] = formatTableText(currentData, -1);
      var tableBodyRows = {
          "questionId": 1,
          "questionText": 2,
          "subject": 3,
          "difficultyLevel": 4
        };

      if (tableBodyRows[selColumn]) {
        table.updateRow(selectedIndex, selectedRow);
      }
    }
});


function saveExcel() {
  var XLSData = table.getData();
  $.ajax({
    type: "POST",
    url: "/saveExcel",
    data: $.param({
      XLSData: JSON.stringify(XLSData)
    }),
    processData: false,
    success: function(res) {
      // console.log(res);
      if (res.success) {
        alert("successed saving to db!");
      }
    }
  });
}
function deleteRow() {
  table.deleteRow(selectedIndex);
  selectedIndex = -1;
  selectedRow = null;
}
function downloadExcel() {
  // console.log("tableColumnNames", tableColumnNames);

  var data = table.getData();

  if(typeof XLSX == 'undefined') XLSX = require('xlsx');

  var ws = XLSX.utils.json_to_sheet(data, {
    header: tableColumnNames
  });

  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "People");

  XLSX.writeFile(wb, "sheet.xlsx");
}

function downloadCSV() {
  var tableData = table.getData();
  const Json2csvParser = json2csv.Parser;
  const fields = Object.keys(tableData[0]);

  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(tableData);

  // console.log(csv);
  
  var csvBlob = new Blob([csv], {type: "text/plain;charset=utf-8"});
  saveAs(csvBlob, "sheet.csv");
}

