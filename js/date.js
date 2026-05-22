var d = new Date();
var date = d.getDate();
var month = d.getMonth() + 1;
var year = d.getFullYear();

if (date < 10) {
  date = "0" + date;
}

if (month < 10) {
  month = "0" + month;
}

document.write("");
var datStr = date + "/" + month + "/" + year;
document.write(datStr);
