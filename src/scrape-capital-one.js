const puppeteer = require('puppeteer');
const fs = require("fs");
const constants = require("./../util/constants.js");
const emailModule = require("./send-email.js");

function capitalOneModule() {
    async function run() {
        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();
        await page.goto(constants.CAPITAL_ONE_URI);
        try {
            await page.waitFor(4000);
            //clicking on an ID that contains "search-keyword". Useful if ID is changing.
            page.click('[id^="search-keyword-"]');
            await page.waitFor(2000);
            await page.keyboard.type("developer");
            await page.waitFor(2000);
            page.click('[id^="search-location-"]');
            await page.waitFor(2000);
            await page.keyboard.type("plano");
            await page.waitFor(4000);
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("ArrowDown");
            page.click('[id^="search-submit-"]');
        }
        catch (e) {
            console.log(e)
        }
        await page.waitFor(3000);

        //TO TEST FOR SINGLE PAGE RESULTS
        //await page.click(constants.CAPITAL_ONE_SELECTOR_CITY);
        //await page.click("#search-filters > div > section:nth-child(4) > ul > li:nth-child(1) > label");

        const numPages = await getNumPages(page);
        console.log('Number of pages: ', numPages);

        const LIST_JOB_SELECTOR = constants.CAPITAL_ONE_JOB_SELECTOR;
        const JOB_SELECTOR_ID = "#search-results";
        var arrayJobResults = [constants.CAPITAL_ONE_RESULTS_TITLE];

        for (let i = 1; i <= numPages; i++) {
            //console.log("Page Number : " + i);
            if (i <= numPages - 1) {
                var jobListLength = await page.evaluate((sel) => {
                    let jobSelectorID = document.querySelector(sel);
                    var numberJobsPerPage = jobSelectorID.getAttribute("data-records-per-page");
                    return numberJobsPerPage;
                }, JOB_SELECTOR_ID);
            }
            else {
                var jobListLength = await page.evaluate((sel) => {
                    let jobSelectorID = document.querySelector(sel);
                    var num1 = jobSelectorID.getAttribute("data-total-results");
                    var num2 = jobSelectorID.getAttribute("data-records-per-page");
                    var num3 = num1 % num2;
                    return num3;
                }, JOB_SELECTOR_ID);
            }

            for (let i = 1; i <= jobListLength; i++) {
                //console.log(jobListLength)
                var jobSelector = LIST_JOB_SELECTOR.replace("INDEX", i)

                var jobListing = await page.evaluate((sel) => {
                    var string = document.querySelector(sel).innerText;
                    return toTitleCase(string);

                    //Format text. Upper case first letter, lower case rest.
                    function toTitleCase(str){
                        return str.replace(/\w\S*/g, function(txt){
                            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                        });
                    }
                }, jobSelector);

                arrayJobResults.push(jobListing);
            }
            if (numPages != 1) {
                if (i != numPages) {
                    await page.click(constants.CAPITAL_ONE_NEXT_PAGE_SELECTOR);
                    await page.waitFor(2000);
                }
                else {
                    break;
                }
            }
        }

        browser.close();
        return arrayJobResults;
    }

    async function getNumPages(page) {
        const PAGE_CONTAINTER_SELECTOR = constants.CAPITAL_ONE_SELECTOR_PAGE_NUMBER;
        let pageCount = await page.evaluate((sel) => {
            let defaultCount = 1;
            try {
                let pageContainer = document.querySelector(sel);
                if (pageContainer != null) {
                    let pageNumber = pageContainer.getAttribute("max");
                    return pageNumber;
                }
                else {
                    return defaultCount;
                }
            }
            catch (error) {
                console.log("Caught an exception: " + error);
            }
        }, PAGE_CONTAINTER_SELECTOR);
        return pageCount;
    }


    run().then((value) => {
        // To format .txt files
        // let data = value.join("\r\n");
        // To format .html files
        let data = "<p>" + value.join("</li><li>") + "</ol>" + "</p>";
        console.log(data);
        fs.appendFile("dfw-tech-jobs.html", data, function (err) {
            if (err) {
                console.log("ERROR with writing Capital One file");
            }
            else {
                console.log(constants.CAPITAL_ONE_SUCCESS_STMT);
            }
        });
        //console.log("scrape-capital-one.js - updated txt file")
        emailModule();
    });
}

module.exports = capitalOneModule;