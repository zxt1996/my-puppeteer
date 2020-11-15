const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://juejin.im/books');
    const options = await page.$$eval('.books-list div .item .info', options => {
        return options.map((el) => {
            const child = el.childNodes;
            let now;
            for (let i=0;i<child.length;i++) {
                if (child[i].className === 'other') {
                    now = child[i].lastChild.lastChild.firstChild.textContent;
                }
            }
            return el.firstChild.textContent + ': ' + now;
        })
    });
    await console.log(options);
    await browser.close();
  })();