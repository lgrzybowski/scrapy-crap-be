const singleSelectorReadText = async (page, selector) => {
    await page.waitFor(500);

    if ((await page.$(selector)) !== null) {
        await page.waitForSelector(selector, {visible: true});
        return await page.evaluate((selector) => {
            return document.querySelector(selector).innerText;
        }, selector);
    } else {
        return new Promise((resolve) => {
            resolve();
        });
    }
};

const multipleSelectorsReadText = async (page, selectors) => {
    await page.waitFor(1000);
    const result = await page.evaluate((selectors) => {

        let completeText = [];
        const elementsToRead = document.querySelectorAll(selectors);

        elementsToRead.forEach((selector) => {
            let textPart = selector.innerText;
            if (textPart.length > 0) {
                completeText.push(textPart);
            }
        });
        return completeText.toString();
    }, selectors);

    return result;
};

module.exports = {
    singleSelectorReadText,
    multipleSelectorsReadText
};