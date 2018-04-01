const puppeteer = require('puppeteer');
const fs = require("fs");
const constants = require("./../util/constants.js");
const emailModule = require("./send-email.js");


function matchModule() {
    async function run() {
        const browser = await puppeteer.launch({
            headless: false
        });

        // ````````````GOING TO MATCH AND HAVING AN IFRAME BLOCK ACCESS```````````````
        // const page = await browser.newPage();
        // try {
        //     console.log("1. Starting automation for Match.com...");
        //     await page.goto("http://www.lifeatmatch.com/jobs/");
        //     await page.waitFor(4000);
        //     // If iFrame is blocking page.click() from selecting an element.
        //     const iframe = await page.frames().find(f => 
        //             f.name() === 'grnhse_iframe'
        //     );
        //     const officeDropdown = await iframe.$('#offices-select');
        //     officeDropdown.click();
        //     await page.waitFor(2000);
        //     await page.keyboard.press("ArrowDown");
        //     await page.keyboard.press("Enter");
        //     await page.waitFor(2000);
        // }
        // catch (e) {
        //     console.log(e)
        // }

        //``````````````DIRECTLY GOING TO IFRAME URL````````````````````````
        const page = await browser.newPage();
        try {
            console.log("1. Starting automation for Match.com...");
            await page.goto(constants.MATCH_URI);
            await page.waitFor(3000);
            await page.click(constants.MATCH_SELECTOR_CITY_NAME);
            await page.waitFor(2000);
            await page.keyboard.press(constants.MATCH_ARROW_DOWN_KEY);
            await page.keyboard.press(constants.MATCH_ENTER_KEY);
            await page.waitFor(2000);
        }
        catch (e) {
            console.log(e)
        }

        // Depreciated
        // const JOB_COUNT_SELECTOR = "#filter-count";
        // console.log("2. Starting scraping for Match...");
        // var jobListLength = await page.evaluate((sel) => {
        //     let jobCount = document.querySelector(sel).innerText;
        //     let formatJobCount = jobCount.substr(0,jobCount.indexOf(' '))
        //     return formatJobCount;
        // }, JOB_COUNT_SELECTOR);

        console.log("2. Starting scraping for Match.com...")
        const DALLAS_JOB_SELECTOR = '[office_id="24843"]';
        var jobListing = await page.evaluate((sel) => {
            var arrayOfJobs = ["\n\n<b>Match.com Jobs in Dallas</b><ol><li>\n"];
            var nodeObject = document.querySelectorAll(sel);
            var arrayOfHtml = Array.from(nodeObject);
            for (var i = 0; i < arrayOfHtml.length; i++) {
                let textOfArray = arrayOfHtml[i].textContent;
                arrayOfJobs.push(textOfArray);
            }
            return arrayOfJobs;
        }, DALLAS_JOB_SELECTOR);

        browser.close();
        return jobListing;
    }

    run().then((value) => {
        // To format .txt files
        // let data = value.join("\r\n");
        // To format .html files
        let data = "<p>" + value.join("</li><li>") + "</ol>" + "</p>";
        //console.log(data);
        fs.appendFile("dfw-tech-jobs.html", data, function (err) {
            if (err) {
                console.log("ERROR with writing Match file");
            }
            else {
                console.log(constants.MATCH_SUCCESS_STMT);
            }
        });
        //console.log("scrape-capital-one.js - updated txt file")
        emailModule();
    });
}

module.exports = matchModule;