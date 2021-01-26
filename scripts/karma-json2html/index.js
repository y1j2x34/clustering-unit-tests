exports.json2html = function json2html(json, title = 'Karma Result') {

    const ejs = require('ejs');

    const tplStr = readTemplate();

    const renderTemplate = ejs.compile(tplStr)
    json.title = title;
    return renderTemplate(json);
}

function readTemplate() {
    const fs = require('fs');
    const path = require('path');
    const templatePath = path.resolve(__dirname, './html/index.ejs');
    return fs.readFileSync(templatePath).toString('utf8');
}

// const html = json2html(require('../../unit-report/karma-result.json'))

// const fs = require('fs')

// fs.writeFileSync('./result.html', html)