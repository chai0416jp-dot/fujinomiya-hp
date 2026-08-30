/**
 * フジノミヤパートナーズ Web サイト フォーム受信スクリプト
 * ------------------------------------------------------------------
 * ・お問い合わせ（index.html）→ スプレッドシート「contacts」に1行追記＋担当者へメール通知
 * ・Partners通信 配信登録（partners-news.html）→ スプレッドシート「newsletter」に1行追記
 *   ＋（設定していれば）Brevo の購読リストにも自動登録＋担当者へメール通知
 *
 * ■ セットアップ手順
 * 1. Google スプレッドシートを新規作成（例：「フジノミヤパートナーズ フォーム台帳」）
 * 2. 拡張機能 → Apps Script を開き、このコードを全文貼り付けて保存
 * 3. 下の SETTINGS を自社用に変更（Brevo を使わないうちは BREVO はそのままで可）
 * 4. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *      実行するユーザー：自分
 *      アクセスできるユーザー：全員
 *    → 発行された「ウェブアプリの URL」をコピー
 * 5. index.html と partners-news.html の  var LOG_ENDPOINT = '';  にその URL を貼り付け
 * 6. （Brevo 連携する場合）Brevo → SMTP & API → API Keys で v3 キーを発行し
 *    BREVO_API_KEY に設定。購読リストの ID（Contacts → Lists の数字）を BREVO_LIST_ID に設定
 *
 * ※ シート（contacts / newsletter）は無ければ自動作成されます。
 */

var SETTINGS = {
  CONTACT_SHEET: 'contacts',
  NEWSLETTER_SHEET: 'newsletter',
  NOTIFY_EMAIL: 'info@fpartners.jp',   // 受信時に通知するメール（不要なら '' ）
  NOTIFY_CONTACT: true,
  NOTIFY_NEWSLETTER: true,

  // ▼ Brevo 連携（未設定なら newsletter シートへの記録のみ行います）
  BREVO_API_KEY: '',                   // 例: xkeysib-xxxxxxxx...
  BREVO_LIST_ID: 0                     // 例: 3  （Brevo の購読者リスト ID）
};

var CONTACT_HEADERS = [
  '受信日時', '姓', '名', 'セイ', 'メイ', '会社名', '部署・役職',
  '電話番号', 'メールアドレス', 'お問い合わせ種別', 'お問い合わせ内容',
  'ご案内メール希望', '送信元ページ'
];
var NEWSLETTER_HEADERS = [
  '受信日時', 'お名前', '会社名', 'メールアドレス', '同意', 'Brevo登録', '送信元ページ'
];

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var kind = data.form || 'お問い合わせ';

    if (kind === 'Partners通信') {
      return handleNewsletter_(data);
    }
    return handleContact_(data);
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  }
}

function doGet() {
  return json_({ result: 'ok', message: 'form-handler is running' });
}

/* ---------- お問い合わせ ---------- */
function handleContact_(data) {
  var sheet = getSheet_(SETTINGS.CONTACT_SHEET, CONTACT_HEADERS);
  var row = [
    new Date(),
    pick_(data, ['姓']),
    pick_(data, ['名']),
    pick_(data, ['セイ', 'フリガナ（セイ）']),
    pick_(data, ['メイ', 'フリガナ（メイ）']),
    pick_(data, ['会社名']),
    pick_(data, ['部署・役職']),
    pick_(data, ['電話番号']),
    pick_(data, ['email', 'メールアドレス']),
    pick_(data, ['お問い合わせ種別']),
    pick_(data, ['お問い合わせ内容']),
    pick_(data, ['ご案内メール', 'ご案内メール希望']) || '（未チェック）',
    data.page || ''
  ];
  sheet.appendRow(row);

  if (SETTINGS.NOTIFY_CONTACT && SETTINGS.NOTIFY_EMAIL) {
    MailApp.sendEmail({
      to: SETTINGS.NOTIFY_EMAIL,
      subject: '【台帳】お問い合わせ：' + row[1] + row[2],
      body: labelValue_(CONTACT_HEADERS, row)
    });
  }
  return json_({ result: 'ok' });
}

/* ---------- Partners通信 配信登録 ---------- */
function handleNewsletter_(data) {
  var email = pick_(data, ['email', 'メールアドレス']);
  var name = pick_(data, ['お名前']);
  var company = pick_(data, ['会社名']);
  var brevoResult = '—';

  if (SETTINGS.BREVO_API_KEY && SETTINGS.BREVO_LIST_ID) {
    brevoResult = addToBrevo_(email, name, company);
  }

  var sheet = getSheet_(SETTINGS.NEWSLETTER_SHEET, NEWSLETTER_HEADERS);
  var row = [
    new Date(), name, company, email,
    pick_(data, ['同意', 'consent']) || '同意',
    brevoResult,
    data.page || ''
  ];
  sheet.appendRow(row);

  if (SETTINGS.NOTIFY_NEWSLETTER && SETTINGS.NOTIFY_EMAIL) {
    MailApp.sendEmail({
      to: SETTINGS.NOTIFY_EMAIL,
      subject: '【Partners通信】配信希望：' + email,
      body: labelValue_(NEWSLETTER_HEADERS, row)
    });
  }
  return json_({ result: 'ok', brevo: brevoResult });
}

function addToBrevo_(email, firstName, company) {
  if (!email) return 'skip(メールなし)';
  try {
    var res = UrlFetchApp.fetch('https://api.brevo.com/v3/contacts', {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true,
      headers: { 'api-key': SETTINGS.BREVO_API_KEY, accept: 'application/json' },
      payload: JSON.stringify({
        email: email,
        attributes: { FIRSTNAME: firstName || '', COMPANY: company || '' },
        listIds: [Number(SETTINGS.BREVO_LIST_ID)],
        updateEnabled: true
      })
    });
    var code = res.getResponseCode();
    return (code === 201 || code === 204) ? 'OK' : ('NG(' + code + ')');
  } catch (err) {
    return 'ERR';
  }
}

/* ---------- 共通 ---------- */
function getSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}
function pick_(obj, keys) {
  for (var i = 0; i < keys.length; i++) {
    if (obj[keys[i]] != null && String(obj[keys[i]]).length) return String(obj[keys[i]]);
  }
  return '';
}
function labelValue_(headers, row) {
  return headers.map(function (h, i) { return h + '：' + row[i]; }).join('\n');
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
