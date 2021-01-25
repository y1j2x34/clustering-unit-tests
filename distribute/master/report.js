const istanbul = require('istanbul-lib-coverage');
const { mergeKarmaResults } = require('../../scripts/merge-karma-json')

exports.report = function report(coverages, karmaResults) {
    const map = istanbul.createCoverageMap();
    coverages.forEach((it) => {
        map.merge(it);
    });
    const mergedCoverageJSON = map.toJSON();

    const mergedKarmaResut = mergeKarmaResults(karmaResults);

    const coverageSumary = map.getCoverageSummary();

    console.log(mergedCoverageJSON);
    console.log(coverageSumary);
    console.log(mergedKarmaResut);
    // convert html
}
