const { execSync } = require('child_process');
const Utilities = require('./utilities');
const path = require("path");

async function main(){
    const projectName = 'biojava';
    const projectURL = 'https://github.com/biojava/biojava';
    const unfixedFlakyTestsFilePath = 'unfixedFlakyTests/list.csv';


    console.log('=================================================================');
    console.log(`             Running NonDex script for ID tests`);
    console.log('=================================================================');
    console.log(`               Project Name: ${projectName}`);
    console.log(`               Project URL: ${projectURL}`);
    console.log('=================================================================');
    console.log();

    const unfixedFlakyTests = await Utilities.readCSV(unfixedFlakyTestsFilePath);
    const unfixedTests = unfixedFlakyTests.map(x=>x['Fully-Qualified Test Name (packageName.ClassName.methodName)']);
    const commits = Array.from(new Set(unfixedFlakyTests.map(x=>x['SHA Detected'])));
    const latestCommit = execSync(`git ls-remote ${projectURL} | head -1 | sed "s/HEAD//"`).toString().replace('\t\n','');

    console.log(`Latest commit from master branch is ${latestCommit}`);
    console.log(`Current commit from master branch is ${commits}`);
    console.log();

    if (commits.includes(latestCommit)) {
        console.log(`There are no updates on the git repository. There are still ${unfixedFlakyTests.length} flaky tests:`);
        console.log(unfixedTests.join('\n'));
        return 0;
    }


    console.log(`Running NoDex script for ID tests. This may take up to several hours.`);
    execSync('rm -rf projects/*');
    execSync('cd projects && git clone https://github.com/biojava/biojava.git');
    const output = execSync(`cd projects/${projectName} && mvn edu.illinois:nondex-maven-plugin:1.1.2:nondex`).toString();

    // mocking log file
    // const output = Utilities.readFile('mockedLogs/output.log');

    const rePattern = new RegExp(/file:\/\/(.*)/g);
    let paths = output.match(rePattern);
    paths = paths.map(x=>Utilities.removeFilePart(x.replace('file:\/\/','')));


    console.log(`Analysing results, this may take up to several minutes.`);
    console.log();

    let newflakyTests = [];
    for (const p of paths){
        const failurePath = path.join(p,'failures');
        if (Utilities.fileExists(failurePath)){
            const result = Utilities.readFile(failurePath);
            newflakyTests = newflakyTests.concat(result.split('\n').filter((item) => newflakyTests.indexOf(item) < 0 && item !== ''));
        }
    }

    const oldTests = unfixedTests.filter(x=>newflakyTests.includes(x));
    const newTests = newflakyTests.filter(x=>!unfixedTests.includes(x));
    const fixedTests = unfixedTests.filter(x=>!newflakyTests.includes(x));


    console.log(`There are still ${oldTests.length} old unfixed flaky tests, ${newTests.length} new flaky tests, and ${fixedTests.length} fixed flaky tests.`);
    console.log('Old flaky tests:');
    console.log(oldTests.join('\n'));
    console.log();
    console.log('New flaky tests:');
    console.log(newTests.join('\n'));
    console.log();
    console.log('Fixed flaky tests:');
    console.log(fixedTests.join('\n'));

}

main();