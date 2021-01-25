import { mergeKarmaResults } from '../../scripts/merge-karma-json';

const istanbul = require('istanbul-lib-coverage')
export function report(coverages, karmaResults) {
    const map = istanbul.createCoverageMap();
    coverages.forEach(it => {
        map.merge(it)
    })
    const mergedCoverageJSON = map.toJSON();

    const mergedKarmaResut = mergeKarmaResults(karmaResults);

    // convert html
}