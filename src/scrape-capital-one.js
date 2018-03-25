const puppeteer = require('puppeteer');
const fs = require("fs");
const constants = require("./../util/constants.js");
const emailModule = require("./send-email.js");

//function capitalOneModule() {
async function run() {
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();
    await page.goto(constants.CAPITAL_ONE_URI);
    //await page.click(constants.CAPITAL_ONE_SELECTOR_CITY);
    //await page.click(constants.CAPITAL_ONE_SELECTOR_CITY_NAME);
    // const yo = await clickCity(page);
    // try {
    //     await page.click("#search-keyword-9d3ee3c98e");
    //     await page.keyboard.type("technology");
    //     await page.click("#search-location-9d3ee3c98e");
    //     await page.keyboard.type("plano");
    //     await page.waitFor(4000);
    //     await page.keyboard.press("ArrowDown");
    //     await page.keyboard.press("ArrowDown");
    //     await page.keyboard.press("ArrowDown");
    //     await page.click("#search-submit-9d3ee3c98e");
    // }
    // catch (e){
    //     console.log(e)
    // }
    await page.waitFor(1000);

    //TO TEST FOR SINGLE PAGE RESULTS
    //await page.click(constants.CAPITAL_ONE_SELECTOR_CITY);
    //await page.click("#search-filters > div > section:nth-child(4) > ul > li:nth-child(1) > label");

    // await page.waitFor(1000);
    // await page.click(constants.CAPITAL_ONE_SELECTOR_CATEGORY);
    // await page.click(constants.CAPITAL_ONE_SELECTOR_CATEGORY_SELECTION);
    // await page.waitFor(1000);

    const numPages = await getNumPages(page);
    console.log('Number of pages: ', numPages);

    // const LIST_JOB_SELECTOR = "#search-results-list > ul";
    const LIST_JOB_SELECTOR = constants.CAPITAL_ONE_JOB_SELECTOR;
    const JOB_SELECTOR_ID = "#search-results";
    var arrayJobResults = [constants.CAPITAL_ONE_RESULTS_TITLE];

    for (let i = 1; i <= numPages; i++) {
        console.log("Page Number : " + i);
        if (i <= numPages-1){
        var jobListLength = await page.evaluate((sel) => {
            let jobSelectorID = document.querySelector(sel);
            //TODO error here, data-records-per-page always returns 15. need to count number of li per page. manually.
            var numberJobsPerPage = jobSelectorID.getAttribute("data-records-per-page");
            // var num1 = jobSelectorID.getAttribute("data-total-results");
            // var num2 = jobSelectorID.getAttribute("data-records-per-page");
            // var num3 = num1 % num2;
            //window.alert(jobListLength)
            return numberJobsPerPage;
            //return num3;
        }, JOB_SELECTOR_ID);
        }
        else {
            var jobListLength = await page.evaluate((sel) => {
                let jobSelectorID = document.querySelector(sel);
                //TODO error here, data-records-per-page always returns 15. need to count number of li per page. manually.
                // var numberJobsPerPage = jobSelectorID.getAttribute("data-records-per-page");
                var num1 = jobSelectorID.getAttribute("data-total-results");
                var num2 = jobSelectorID.getAttribute("data-records-per-page");
                var num3 = num1 % num2;
                //window.alert(jobListLength)
                // return numberJobsPerPage;
                return num3;
            }, JOB_SELECTOR_ID);
        }

        // let testing = await page.evaluate((sel) => {
        //     var arrayJobResults = ["Capital One Jobs in Texas for InformationTechnology\n"];
        //     let foo = document.querySelector(sel);
        //     let bar = foo.getElementsByTagName("li");
        //     for (let i = 0; i < bar.length; i++){
        //         let eachJob = bar[i].innerText;
        //         console.log(eachJob)
        //         arrayJobResults.push(eachJob);
        //     }
        //     console.log(arrayJobResults);
        //     return arrayJobResults;
        // }, LIST_JOB_SELECTOR);


        for (let i = 1; i <= jobListLength; i++) {
            console.log(jobListLength)
            var jobSelector = LIST_JOB_SELECTOR.replace("INDEX", i)

            var jobListing = await page.evaluate((sel) => {
                return document.querySelector(sel).innerText;
            }, jobSelector);

            arrayJobResults.push(jobListing);
        }
        //console.log("ANTHONYYYYYYYYY: " + arrayJobResults)
        if (numPages != 1) {
            if (i!=numPages){
                await page.click(constants.CAPITAL_ONE_NEXT_PAGE_SELECTOR);
                await page.waitFor(2000);
            }
            else{
                break;
            }
        }
    }

    //browser.close();
    console.log("arrayJobResults "+arrayJobResults);
    //console.log("testing" +testing)
    //return testing;
    return arrayJobResults;
}

//const EY = "#search-filters > div > section:nth-child(4) > ul";
// async function clickCity(page) {
//     var test = await page.evaluate((sel) => {
//         // var test2 = document.querySelector("#search-filters > div > section:nth-child(4) > ul").getElementsByTagName("li");
//         var test1 = document.querySelector("#search-filters > div > section:nth-child(4) > ul");
//         var test2 = test1.getElementsByTagName("li");
//         console.log(test2)
//         window.alert(test2.length)
//         for (var i=0; i< test2.length; i++){
//             if (test2[i].innerText == "Plano, Texas, United States") {
//                 console.log("HIIIIIIIII "+test2[i]);
//                 test2.click();
//                 window.alert("hi")
//                 //await page.click(test2[i].innerText);
//             }
//             else{
//                 //window.alert("NO")
//             }
//         }
//     }/*,EY*/);
//     return test;
// }


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


// run().then((value) => {
//     let data = value.join("\r\n");
//     console.log(data);
//     fs.appendFile("dfw-tech-jobs.txt", data, function (err) {
//         console.log(constants.SUCCESS_STMT);
//     });
//     fs.
//     console.log("scrape-capital-one.js - updated txt file")
//     emailModule();
// });
// }

//module.exports = capitalOneModule;
run();