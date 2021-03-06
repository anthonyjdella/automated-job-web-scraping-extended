const puppeteer = require('puppeteer');
const fs = require("fs");
const constants = require("./../util/constants.js");
const emailModule = require("./send-email.js");
const capitalOneModule = require("./scrape-capital-one.js");


function stateFarmModule() {
    async function run() {
        const browser = await puppeteer.launch({
            headless: true
        });

        console.log("- Starting automation for State Farm...");
        const page = await browser.newPage();
        await page.goto(constants.STATE_FARM_URI);
        await page.click(constants.STATE_FARM_LOC_DRPDWN);
        await page.click(constants.STATE_FARM_TX_RD_BTN);
        await page.click(constants.STATE_FARM_SRCH_FRM);
        await page.keyboard.type(constants.STATE_FARM_SRCH_TECH);
        await page.click(constants.STATE_FARM_SUBMIT_BTN);
        await page.waitFor(2000);

        const numPages = await getNumPages(page);
        //console.log('Number of pages: ', numPages);

        const LIST_JOB_SELECTOR = constants.STATE_FARM_JOB_SELECTOR;
        const JOB_SELECTOR_ID = constants.STATE_FARM_JOB_SELECTOR_ID;
        var arrayJobResults = [constants.CSS_STYLING_STATE_FARM, constants.STATE_FARM_RESULTS_TITLE];

        console.log("-- Starting scraping for State Farm...");
        for (let h = 1; h <= numPages; h++) {
            //console.log("Page Number : " + h);
            let jobListLength = await page.evaluate((sel) => {
                let jobSelectorID = document.getElementById(sel);
                let jobSelectorTagName = jobSelectorID.getElementsByTagName("li");
                return jobSelectorTagName.length;
            }, JOB_SELECTOR_ID);

            for (let i = 1; i <= jobListLength; i++) {
                let jobSelector = LIST_JOB_SELECTOR.replace("INDEX", i)

                let jobListing = await page.evaluate((sel) => {
                    return document.querySelector(sel).innerText;
                }, jobSelector);

                arrayJobResults.push(jobListing);
            }
            if (numPages != 1) {
                await page.click(constants.STATE_FARM_NEXT_PAGE_SELECTOR);
                await page.waitFor(2000);
            }
        }

        browser.close();
        return arrayJobResults;
    }

    async function getNumPages(page) {
        const PAGE_CONTAINTER_SELECTOR = constants.STATE_FARM_PAGE_CONTAINTER_SELECTOR;
        let pageCount = await page.evaluate((sel) => {
            let defaultCount = 1;
            let pageContainer = document.querySelector(sel);
            try {
                let allPages = pageContainer.getElementsByClassName("pagerLink");
                if (allPages.length > 0) {
                    return allPages.length;
                }
                else {
                    return defaultCount;
                }
            }
            catch (err) {
                console.log("Caught an exception: " + err);
            }
        }, PAGE_CONTAINTER_SELECTOR);
        return pageCount;
    }


    run().then((value) => {
        // To format .txt files
        // let data = value.join("\r\n");
        // To format .html files
        let data = "<p>" + value.join("</li><li>") + "</ol>" + "</p>";
        //console.log(data);
        fs.writeFile("dfw-tech-jobs.html", data, function (err) {
            if (err) {
                console.log("ERROR with writing State Farm file");
            }
            else {
                console.log(constants.STATE_FARM_SUCCESS_STMT);
            }
        });
        //console.log("scrape-state-farm.js - created txt file")
        capitalOneModule();
    });
}

module.exports = stateFarmModule;