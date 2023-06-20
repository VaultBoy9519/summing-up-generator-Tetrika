const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // setupNodeEvents может быть определен в конфигурации e2e или component
  e2e: {
    defaultCommandTimeout: 10000,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        // Предоставьте абсолютный путь к распакованной папке расширения
        // ПРИМЕЧАНИЕ: расширения не могут быть загружены в безголовый Chrome
        launchOptions.extensions.push("D:/Programming/WebstormProjects/projects/summing-up-generator/testProject/cypress/extensions/extention_sug_v2");

        return launchOptions;
      });
    }
  }
});
