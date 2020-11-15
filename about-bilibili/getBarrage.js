const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // enable request interception
    await page.setRequestInterception(true);
    // add header for the navigation requests
    page.on('request', request => {
    // Do nothing in case of non-navigation requests.
    if (!request.isNavigationRequest()) {
        request.continue();
        return;
    }
    // Add a new header for navigation request.
    const headers = request.headers();
    headers['cookie'] = "你的cookie信息";
    request.continue({ headers });
    });

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36');

    await page.goto('https://api.bilibili.com/x/v2/dm/history?type=1&oid=241263497&date=2020-11-03');

    const selector = 'i > d';
    const elementHandle = await page.$$(selector);
    const stream = fs.createWriteStream("bilibili.txt");
    for (let i=0;i<elementHandle.length;i++) {
        const value = await (await elementHandle[i].getProperty('textContent')).jsonValue();
        stream.write(value + '\n');
    }
    stream.end();
    await browser.close();
  })();