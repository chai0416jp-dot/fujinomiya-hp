/**
 * フジノミヤパートナーズ Web サイト フォーム受信スクリプト
 * ------------------------------------------------------------------
 * ・お問い合わせ（index.html）→ スプレッドシート「contacts」に1行追記＋担当者へメール通知
 * ・Partners通信 配信登録（partners-news.html）→ スプレッドシート「newsletter」に1行追記
 *   ＋（設定していれば）Brevo の購読リストにも自動登録＋担当者へメール通知
 * ・講座申込（plan-detail.html）→ スプレッドシート「registrations」に1行追記（申込ID自動発行／ステータス=未入金）
 *   ＋申込者へ確認メール（銀行振込の場合は口座情報・振込期限を記載）＋担当者へメール通知
 *
 * ■ セットアップ手順
 * 1. Google スプレッドシートを新規作成（例：「フジノミヤパートナーズ フォーム台帳」）
 * 2. 拡張機能 → Apps Script を開き、このコードを全文貼り付けて保存
 * 3. 下の SETTINGS を自社用に変更（Brevo を使わないうちは BREVO はそのままで可。BANK/PAYMENT_DEADLINE_DAYS も確認）
 * 4. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *      実行するユーザー：自分
 *      アクセスできるユーザー：全員
 *    → 発行された「ウェブアプリの URL」をコピー
 * 5. index.html と partners-news.html の  var LOG_ENDPOINT = '';  、
 *    plan-detail.html の  var REGISTRATION_ENDPOINT = '';  にその URL を貼り付け
 *    （同じ1つのウェブアプリ URL を3箇所すべてに貼って構いません）
 * 6. （Brevo 連携する場合）Brevo → SMTP & API → API Keys で v3 キーを発行し
 *    BREVO_API_KEY に設定。購読リストの ID（Contacts → Lists の数字）を BREVO_LIST_ID に設定
 *
 * ■ 講座申込の入金確認について（重要）
 * ・クレジットカード決済（Stripe）・銀行振込のいずれも、入金確認は自動化していません。
 *   Google Apps Script は受信したHTTPリクエストのヘッダーを読み取れない仕様のため、
 *   StripeのWebhook署名検証（なりすまし防止）が技術的にできないためです。
 * ・Stripeは管理画面またはStripeからの通知メールで入金を確認し、銀行振込は実際の入金を確認して、
 *   いずれも「registrations」シートの「ステータス」列を手動で「未入金」→「完了」に書き換えてください。
 *   「申込ID」列で、Stripeの client_reference_id（決済詳細に表示）や振込人名義と対応付けできます。
 *
 * ※ シート（contacts / newsletter / registrations）は無ければ自動作成されます。
 */

var SETTINGS = {
  CONTACT_SHEET: 'contacts',
  NEWSLETTER_SHEET: 'newsletter',
  REGISTRATION_SHEET: 'registrations',
  NOTIFY_EMAIL: 'info@fpartners.jp',   // 受信時に通知するメール（不要なら '' ）
  NOTIFY_CONTACT: true,
  NOTIFY_NEWSLETTER: true,
  NOTIFY_REGISTRATION: true,

  // ▼ Brevo 連携（未設定なら newsletter シートへの記録のみ行います）
  BREVO_API_KEY: '',                   // 例: xkeysib-xxxxxxxx...
  BREVO_LIST_ID: 0,                    // 例: 3  （Brevo の購読者リスト ID）

  // ▼ 講座申込：銀行振込の振込先（完了画面・確認メールにのみ表示。サイト上には常時公開しません）
  BANK: {
    name: 'ドコモSMTBネット銀行',
    branch: '法人第一支店',
    type: '普通',
    number: '1166063',
    holder: '株式会社フジノミヤパートナーズ'
  },
  PAYMENT_DEADLINE_DAYS: 3              // 申込から何日後を振込期限にするか
};

var CONTACT_HEADERS = [
  '受信日時', '姓', '名', 'セイ', 'メイ', '会社名', '部署・役職',
  '電話番号', 'メールアドレス', 'お問い合わせ種別', 'お問い合わせ内容',
  'ご案内メール希望', '送信元ページ'
];
var NEWSLETTER_HEADERS = [
  '受信日時', 'お名前', '会社名', 'メールアドレス', '同意', 'Brevo登録', '送信元ページ'
];
var REGISTRATION_HEADERS = [
  '受信日時', '申込ID', 'プラン', 'お名前', 'メールアドレス', '電話番号',
  '決済方法', 'ステータス', 'お振込期限', '送信元ページ'
];

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var kind = data.form || 'お問い合わせ';

    if (kind === 'Partners通信') {
      return handleNewsletter_(data);
    }
    if (kind === '講座申込') {
      return handleRegistration_(data);
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

/* ---------- 講座申込 ---------- */
function handleRegistration_(data) {
  var sheet = getSheet_(SETTINGS.REGISTRATION_SHEET, REGISTRATION_HEADERS);
  var id = generateRegistrationId_(sheet);

  var planName = pick_(data, ['プラン']) || pick_(data, ['planId']);
  var name = pick_(data, ['お名前']);
  var email = pick_(data, ['email', 'メールアドレス']);
  var tel = pick_(data, ['電話番号']);
  var method = pick_(data, ['決済方法']); // 'クレジットカード' or '銀行振込'

  var due = '';
  if (method === '銀行振込') {
    var d = new Date();
    d.setDate(d.getDate() + SETTINGS.PAYMENT_DEADLINE_DAYS);
    due = Utilities.formatDate(d, 'Asia/Tokyo', 'yyyy年M月d日');
  }

  var row = [new Date(), id, planName, name, email, tel, method, '未入金', due, data.page || ''];
  sheet.appendRow(row);

  if (email) {
    sendApplicantMail_(method, { id: id, planName: planName, name: name, email: email, due: due });
  }

  if (SETTINGS.NOTIFY_REGISTRATION && SETTINGS.NOTIFY_EMAIL) {
    MailApp.sendEmail({
      to: SETTINGS.NOTIFY_EMAIL,
      subject: '【台帳】講座申込：' + id + '（' + planName + '／' + method + '）',
      body: labelValue_(REGISTRATION_HEADERS, row)
    });
  }

  var result = { result: 'ok', id: id, method: method, due: due };
  if (method === '銀行振込') result.bank = SETTINGS.BANK;
  return json_(result);
}

// 申込ID：REG-YYYYMM-XXXX（Iや0など誤読しやすい文字は除外）。シート内の既存IDと重複しないものを発行
function generateRegistrationId_(sheet) {
  var ym = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMM');
  var existing = {};
  if (sheet.getLastRow() > 1) {
    var ids = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
    ids.forEach(function (r) { existing[r[0]] = true; });
  }
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var id;
  for (var i = 0; i < 30; i++) {
    var suffix = '';
    for (var j = 0; j < 4; j++) suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    id = 'REG-' + ym + '-' + suffix;
    if (!existing[id]) return id;
  }
  return id;
}

function sendApplicantMail_(method, info) {
  var b = SETTINGS.BANK;
  var subject, body;

  if (method === '銀行振込') {
    subject = '【フジノミヤパートナーズ】お申込みを受け付けました（お振込のご案内）';
    body =
      info.name + ' 様\n\n' +
      '「' + info.planName + '」へのお申込みを受け付けました。\n' +
      '以下の内容でご確認ください。\n\n' +
      '申込ID：' + info.id + '\n' +
      'プラン：' + info.planName + '\n' +
      '決済方法：銀行振込\n\n' +
      '――――――――――――――――\n' +
      '▼お振込先\n' +
      b.name + '　' + b.branch + '（' + b.type + '）' + b.number + '\n' +
      '口座名義：' + b.holder + '\n' +
      '――――――――――――――――\n\n' +
      'お振込の際は、振込人名義欄に【申込ID＋お名前】をご入力ください。\n' +
      '（例：' + info.id + ' ' + info.name + '）\n\n' +
      'お振込期限：' + info.due + '\n\n' +
      'ご入金確認後、改めて受講開始のご案内をお送りします。\n' +
      '期限までにお振込が難しい場合は、お問い合わせまたは公式LINEよりご連絡ください。\n\n' +
      '株式会社フジノミヤパートナーズ';
  } else {
    subject = '【フジノミヤパートナーズ】お申込みを受け付けました';
    body =
      info.name + ' 様\n\n' +
      '「' + info.planName + '」へのお申込みを受け付けました。\n\n' +
      '申込ID：' + info.id + '\n' +
      'プラン：' + info.planName + '\n' +
      '決済方法：クレジットカード（Stripe）\n\n' +
      'このあとStripeの決済ページにてお支払い手続きをお願いいたします。\n' +
      '決済が完了すると、Stripeより別途受領メールが届きます。\n\n' +
      '株式会社フジノミヤパートナーズ';
  }

  MailApp.sendEmail({ to: info.email, subject: subject, body: body });
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
