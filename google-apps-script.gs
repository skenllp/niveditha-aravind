/**
 * RSVP -> Google Sheet for the Aravind & Niveditha wedding site.
 * Creates two tabs automatically:
 *   "RSVPs"   - one row per reply
 *   "Summary" - live totals (guests coming, per-celebration headcount)
 *
 * SETUP (about 3 minutes)
 * 1. Go to https://sheets.google.com and create a blank spreadsheet
 *    named "Aravind & Niveditha RSVPs".
 * 2. Extensions -> Apps Script. Delete the starter code, paste ALL of this file, Save.
 * 3. (Optional) put your email in NOTIFY_EMAIL below to get an email for every RSVP.
 * 4. Run the function "setup" once (select it in the toolbar, click Run, approve access:
 *    Advanced -> Go to project (unsafe), since it is your own script).
 * 5. Deploy -> New deployment -> gear icon -> Web app
 *      Execute as: Me      Who has access: Anyone
 *    Click Deploy and copy the Web app URL (ends in /exec).
 * 6. In index.html find:
 *      const RSVP_SHEET_ENDPOINT = "PASTE_YOUR_DEPLOYED_APPS_SCRIPT_URL_HERE";
 *    and paste your URL between the quotes. Re-upload the site.
 *
 * After editing this script later: Deploy -> Manage deployments -> pencil ->
 * New version -> Deploy (the /exec URL stays the same).
 */

var NOTIFY_EMAIL = '';            // e.g. 'you@gmail.com' - leave '' to skip emails
var RSVP_SHEET   = 'RSVPs';
var EVENTS = [['haldi','Haldi'],['mehendi','Mehendi'],['sangeeth','Sangeeth'],['wedding','Thalikettu & Wedding'],['reception','Reception']];
var HEADERS = ['Timestamp','Name','Phone','Attending','Guests','Message'].concat(EVENTS.map(function(e){return e[1];}));

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(RSVP_SHEET) || ss.insertSheet(RSVP_SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  var sum = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
  sum.clear();
  var R = RSVP_SHEET + '!';
  var rows = [
    ['Total guests coming', '=SUMIF(' + R + 'D:D,"Joyfully Accepts",' + R + 'E:E)'],
    ['Replies: accepted', '=COUNTIF(' + R + 'D:D,"Joyfully Accepts")'],
    ['Replies: declined', '=COUNTIF(' + R + 'D:D,"Regretfully Declines")'],
    ['', ''],
    ['Guests per celebration', '']
  ];
  EVENTS.forEach(function (e, i) {
    var col = String.fromCharCode(71 + i); // G, H, I, J, K
    rows.push([e[1], '=SUMIFS(' + R + 'E:E,' + R + col + ':' + col + ',"Yes",' + R + 'D:D,"Joyfully Accepts")']);
  });
  sum.getRange(1, 1, rows.length, 2).setValues(rows);
  sum.getRange('A1:A' + rows.length).setFontWeight('bold');
  sum.setColumnWidth(1, 220);
  // The other sheet (Sheet1) is left untouched; delete it if empty.
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(RSVP_SHEET);
    if (!sh) { setup(); sh = ss.getSheetByName(RSVP_SHEET); }
    var d = JSON.parse(e.postData.contents);
    var events = d.events || [];
    var guests = Math.max(0, parseInt(d.guests, 10) || 0);
    var row = [d.timestamp || new Date().toISOString(), d.name || '', "'" + (d.phone || ''), d.attending || '', guests, d.message || ''];
    EVENTS.forEach(function (ev) { row.push(events.indexOf(ev[0]) > -1 ? 'Yes' : ''); });
    sh.appendRow(row);
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'New RSVP: ' + (d.name || 'Someone') + ' - ' + (d.attending || ''),
        'Name: ' + d.name + '\nPhone: ' + d.phone + '\nAttending: ' + d.attending + '\nGuests: ' + guests +
        '\nCelebrations: ' + (events.join(', ') || '-') + '\nMessage: ' + (d.message || '-'));
    }
    return ContentService.createTextOutput(JSON.stringify({ result: 'success' })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Open the /exec URL in a browser to check it is live.
function doGet() {
  return ContentService.createTextOutput('RSVP endpoint is live.').setMimeType(ContentService.MimeType.TEXT);
}
