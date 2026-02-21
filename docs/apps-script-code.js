/**
 * Google Apps Script — doGet() for Gruzja 2026 survey results.
 *
 * SETUP:
 * 1. Open the Google Form in edit mode
 * 2. Click "..." menu → Script editor
 * 3. Paste this code, replacing any existing content
 * 4. Click Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL — it's already in index.html
 *
 * After any code changes: Deploy → Manage deployments → Edit → New version → Deploy
 */

function doGet() {
  var form = FormApp.getActiveForm();
  var responses = form.getResponses();
  var items = form.getItems();

  var respondents = [];
  var questions = [];
  var comments = [];

  // Process each form item
  items.forEach(function(item, idx) {
    var title = item.getTitle();
    var type = item.getType();

    if (type == FormApp.ItemType.TEXT && idx === 0) {
      // First text field = name
      responses.forEach(function(resp) {
        var itemResp = resp.getResponseForItem(item);
        if (itemResp) respondents.push(itemResp.getResponse());
      });
    } else if (type == FormApp.ItemType.MULTIPLE_CHOICE) {
      var mcItem = item.asMultipleChoiceItem();
      var choices = mcItem.getChoices().map(function(c) { return c.getValue(); });
      var results = {};
      choices.forEach(function(c) { results[c] = 0; });

      responses.forEach(function(resp) {
        var itemResp = resp.getResponseForItem(item);
        if (itemResp) {
          var val = itemResp.getResponse();
          if (results.hasOwnProperty(val)) results[val]++;
          else results[val] = 1;
        }
      });

      questions.push({
        title: title,
        type: "choice",
        results: results
      });
    } else if (type == FormApp.ItemType.PARAGRAPH_TEXT || (type == FormApp.ItemType.TEXT && idx > 0)) {
      // Long text = comments
      responses.forEach(function(resp) {
        var itemResp = resp.getResponseForItem(item);
        if (itemResp && itemResp.getResponse().trim()) {
          comments.push(itemResp.getResponse().trim());
        }
      });
    }
  });

  var output = JSON.stringify({
    respondents: respondents,
    questions: questions,
    comments: comments,
    total: responses.length,
    updated: new Date().toISOString()
  });

  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}
