// serve the web page
function doGet() {
  return HtmlService.createTemplateFromFile("index.html")
    .evaluate()
    .setTitle("Vue App")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}