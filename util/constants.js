module.exports = Object.freeze({

    //State Farm
    STATE_FARM_URI: "https://statefarm.csod.com/ats/careersite/search.aspx?site=1&c=statefarm",
    STATE_FARM_LOC_DRPDWN: "#ctl00_siteContent_widgetLayout_rptWidgets_ctl03_widgetContainer_ctl00_rptCustomFields_ctl02_customFieldWrapper > button",
    STATE_FARM_TX_RD_BTN: "body > div > ul > li:nth-child(46) > label > span",
    STATE_FARM_SRCH_FRM: "#ctl00_siteContent_widgetLayout_rptWidgets_ctl03_widgetContainer_ctl00_rptCustomFields_ctl00_customFieldWrapper_ctl00_txtValue",
    STATE_FARM_SRCH_TECH: "technology",
    STATE_FARM_SUBMIT_BTN: "#ctl00_siteContent_widgetLayout_rptWidgets_ctl03_widgetContainer_ctl00_btnSearch",
    STATE_FARM_SUCCESS_STMT: "File successfully written with State Farm Jobs! - Check your project directory for the dfw-tech-jobs.txt file",
    STATE_FARM_JOB_SELECTOR: "#ctl00_siteContent_widgetLayout_rptWidgets_ctl03_widgetContainer_ctl00_ctl00 > ul > li:nth-child(INDEX)",
    STATE_FARM_JOB_SELECTOR_ID: "ctl00_siteContent_widgetLayout_rptWidgets_ctl03_widgetContainer_ctl00_ctl00",
    STATE_FARM_RESULTS_TITLE: "<b>State Farm Jobs in Texas for -Technology-</b><ol><li>\n",
    STATE_FARM_NEXT_PAGE_SELECTOR: "#ctl00_siteContent_widgetLayout_rptWidgets_ctl03_widgetContainer_ctl00_pgrList_nextPageLink",
    STATE_FARM_PAGE_CONTAINTER_SELECTOR: '#ctl00_siteContent_widgetLayout_rptWidgets_ctl03_widgetContainer_ctl00_ctl00 > div.results-paging',

    //Capital One
    CAPITAL_ONE_URI: "https://www.capitalonecareers.com/search-jobs",
    CAPITAL_ONE_SELECTOR_CITY: '[id^="search-location-"]',
    CAPITAL_ONE_SELECTOR_CITY_NAME: "plano",
    CAPITAL_ONE_SELECTOR_CATEGORY: '[id^="search-keyword-"]',
    CAPITAL_ONE_SELECTOR_CATEGORY_TYPE: "developer",
    CAPITAL_ONE_ARROW_DOWN: "ArrowDown",
    CAPITAL_ONE_SELECTOR_PAGE_NUMBER: "#pagination-current-bottom",
    CAPITAL_ONE_RESULTS_TITLE: "\n\n<b>Capital One Jobs in Texas for -Developer-</b><ol><li>\n",
    CAPITAL_ONE_NEXT_PAGE_SELECTOR: '[id^="search-submit-"]',
    CAPITAL_ONE_JOB_SELECTOR: "#search-results-list > ul > li:nth-child(INDEX) > a > h2",
    CAPITAL_ONE_SUCCESS_STMT: "File successfully written with Capital One Jobs! - Check your project directory for the dfw-tech-jobs.txt file"

});