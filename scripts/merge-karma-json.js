exports.mergeKarmaResults = function mergeKarmaResults(karmaResults = []) {
    resolveBrowserType(karmaResults);
    return {
        summary: mergeSummary(karmaResults),
        browsers: mergeBrowsers(karmaResults)
    };
}
function mergeBrowsers(karmaResults) {
    const browserResultMap = {
        // type: browserResult
    };
    karmaResults.forEach(karmaResult => {
        karmaResult.browsers.forEach(it => {
            const type = it.browser.type;
            if(!browserResultMap[type]) {
                browserResultMap[type] = it;
            } else {
                const result = browserResultMap[type];
                result.browser.lastResult = mergeLastResult(result.browser.lastResult, it.browser.lastResult);
                result.errors = result.errors.concat(it.errors);
                result.results = result.results.concat(it.results);
            }
        })
    })
    return Object.values(browserResultMap);
}
function mergeLastResult(a, b) {
    return {
        startTime: Math.min(a.startTime, b.startTime),
        total: a.total + b.total,
        success: a.success + b.success,
        failed: a.failed + b.failed,
        skipped: a.skipped + b.skipped,
        totalTime: a.totalTime + b.totalTime,
        error: a.error || b.error
    }
}
function mergeSummary(karmaResults) {
    return karmaResults.map(it => it.summary).reduce((summary, it) => {
        return {
            success: summary.success + it.success,
            failed: summary.failed + it.failed,
            skipped: summary.skipped + it.skipped
        }
    })
}
function resolveBrowserType(karmaResults) {
    karmaResults.forEach(karmaResult => {
        karmaResult.browsers.forEach(it => {
            const browser = it.browser;
            const name = browser.name;
            if(name) {
                const index = name.indexOf(' ');
                if(index > -1) {
                    browser.type =  name.substring(0, index);
                } else {
                    browser.type = name;
                }
            }
        })
    })
}