export const messages = {
  cookieRec: `\n\nДля решения возникшей неполадки рекомендую провести очистку временных файлов браузера. Заранее сообщаю, что после этих действий вы выйдете из всех аккаунтов на сайтах, где авторизовались ранее, и вам нужно будет сделать это повторно. Чтобы провести очистку, воспользуйтесь инструкцией для своего браузера:

Google Chrome: https://support.google.com/accounts/answer/32050?hl=ru&co=GENIE.Platform%3DDesktop
Mozilla Firefox: https://support.mozilla.org/ru/kb/udalenie-kuki-i-dannyh-sajtov-v-firefox?redirectslug=udalenie-kukov-dlya-udaleniya-informacii-kotoruyu-&redirectlocale=ru
Safari: https://support.apple.com/ru-ru/guide/safari/sfri11471/mac`,
  internetRec: `\n\nУ вас зафиксирована низкая скорость интернет-соединения. Рекомендую во время урока находиться ближе к роутеру или, при возможности, использовать проводное подключение. Также, перед следующим занятием, перезагрузите, пожалуйста, роутер. Если неполадка все равно повторится и рекомендации выше не помогут, обратитесь, пожалуйста, к вашему интернет-провайдеру.

Скорость интернет-соединения вы можете проверить на сайте www.speedtest.net. Подробная инструкция по измерению скорости доступна по ссылке:
https://tetrikasupp.notion.site/9ca6313f16384947ad499d64bf064580`,
  browserRec: `\n\nИспользуемый вами браузер не подходит для занятий. Пользуйтесь, пожалуйста, Google Chrome или Mozilla Firefox. Скачать их вы можете по этим ссылкам:

Google Chrome: https://www.google.com/intl/ru/chrome/
Mozilla Firefox: https://www.mozilla.org/ru/firefox/new/

Для устройств от компании Apple вы можете использовать стандартный браузер Safari.

Более подробно с установкой браузера вы можете ознакомиться в этих статьях:
https://tetrikasupp.notion.site/Windows-bcc2b1b95f4849d59bf8a9024e011f37
https://tetrikasupp.notion.site/Mac-ff3f6f8346e541669122d88def2042b4`,
  mobileAndBrowserRec: [`\n\nСогласно тесту оборудования, вы проводите занятия через мобильное устройство. По правилам школы, преподаватель может вести уроки только с использованием компьютера или ноутбука.`,
    `\n\nИспользуемый вами браузер не подходит для занятий. Используйте, пожалуйста, Google Chrome или Mozilla Firefox. Скачать их из Google Play Market вы можете по этим ссылкам:

Google Chrome - https://play.google.com/store/apps/details?id=com.android.chrome&hl=ru&gl=US
Mozilla Firefox - https://play.google.com/store/apps/details?id=org.mozilla.firefox&hl=ru&gl=US

Для устройств от компании Apple вы можете использовать стандартный браузер Safari.

Более подробно с установкой браузера вы можете ознакомиться в этой статье: https://tetrikasupp.notion.site/Android-27fa5d85fd294beba2941fda74df000a`],
  hardwareRec: `\n\nУстройство, которое вы используете, не подходит для занятий по системным требованиям, указанным в договоре-оферте. Для комфортных уроков рекомендую сменить его на более современное.

Для выбора устройства ознакомьтесь, пожалуйста, с системными требованиями по ссылке ниже:
https://tetrikasupp.notion.site/54f51d9eb9b64a8f93856f635bcc30b3.`,
  serviceRec: `\n\nДля устранения неполадки, возникшей с вашим устройством, вам нужно обратиться в сервисный центр, поскольку присутствуют признаки аппаратной неисправности или сбоя драйвера устройства.`,
  //всегда в конце - подведение итогов. Перед ним добавляем любые новые рекомендации. Не забываем добавить соотв.чекбокс в checkboxProps
  compOnpMessage: [`\n\nЧерез две недели с вами свяжется мой коллега, чтобы узнать, удалось ли исправить неполадки, а также записать на повторную проверку.`,
    `\n\nПо вашей просьбе, передал запрос на компенсацию урока. В течение трех дней ваш запрос будет рассмотрен. Если запрос будет согласован, вам будет начислен компенсационный урок, и ответ об этом поступит в чат вашего личного кабинета.`]
};

export const finishFragmentMessage = {
  noCallMessage: `Мы закрываем это обращение, так как не получилось связаться с вами.
Если вы ждете нашей помощи, пожалуйста, напишите удобный способ и время для связи.`,
  summarizingMessage: `Если у вас остались вопросы, напишите, пожалуйста, в чат поддержки личного кабинета. Также, вы можете нажать на кнопку в уроке "Сообщить о тех. проблеме", я или мой коллега оперативно придем к вам на помощь. Кнопка расположена в разделе "Чат с поддержкой", рядом с кнопкой "Чат с репетитором".`
};
