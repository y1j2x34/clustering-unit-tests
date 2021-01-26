const path = require('path');
const fs = require('fs-extra');
const istanbul = require('istanbul-lib-coverage');
const { mergeKarmaResults } = require('../../scripts/merge-karma-json');
const { json2html } = require('../../scripts/karma-json2html');

const finalReportDir = path.resolve(__dirname, '../../final-report');
const coverageDir = path.resolve(finalReportDir, 'coverage')

exports.report = function report(coverages, karmaResults) {
    const mergedKarmaResut = mergeKarmaResults(karmaResults);
    
    fs.removeSync(coverageDir);
    reportCoverage(coverages);
    reportUnit(mergedKarmaResut);
}

function reportUnit(karmaResults) {
    const html = json2html(karmaResults);
    fs.writeFileSync(
        path.resolve(finalReportDir, 'result.html'),
        html
    );
}

function reportCoverage(coverages) {
    const coverageMap = istanbul.createCoverageMap();
    coverages.forEach((it) => {
        coverageMap.merge(it);
    });
    const libReport = require('istanbul-lib-report');
    const reports = require('istanbul-reports');
    const libSourcemap = require('istanbul-lib-source-maps');
    const sourcemapStore = libSourcemap.createSourceMapStore({
        baseDir: path.resolve('../../lib')
    });
    sourcemapStore.transformCoverage(coverageMap).then(remappedCoverageMap => {
        
        const context = libReport.createContext({
            dir: coverageDir,
            coverageMap: remappedCoverageMap
        });
    
        const tree = context.getTree('pkg')
    
        const report = reports.create('html', {
            skipEmpty: false,
            skipFull: false
        });
        tree.visit(report, context);
    });
}