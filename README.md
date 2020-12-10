# Flaky tests detection

## Description

This repository contains nodejs script for detecting  Implementation-Dependent flaky tests using NonDex and Order-Dependent flaky tests using iDFlakies tools. This repository contains `projects` directory for cloning github repositories. Directory `unfixedFlakyTests` contains list of unfixed flaky tests according to the http://mir.cs.illinois.edu/flakytests/unfixed.html. Directory `mockedLogs` contains mocked logs of `mvn edu.illinois:nondex-maven-plugin:1.1.2:nondex` for faster development.

## Prerequests
 - Node v9.11.2
 - Java SDK 8
 
## Usage

In order to run script change `projectName` and `projectURL` in `script.js` file and run the following command.

```node script.js```

## Example output log

```
/usr/local/bin/node /Users/miloskotlar/Desktop/flakytests/script.js
=================================================================
             Running NonDex script for ID tests
=================================================================
               Project Name: biojava
               Project URL: https://github.com/biojava/biojava
=================================================================

Latest commit from master branch is e99364ac14294adeb9385b7b93c602c2d9b66bb6
Current commit from master branch is 245742d522d12440ece32f5c2d665ff81c465e98

Running NoDex script for ID tests. This may take up to several hours.
Analysing results, this may take up to several minutes.

There are still 0 old unfixed flaky tests, 5 new flaky tests, and 6 fixed flaky tests.
Old flaky tests:


New flaky tests:
org.biojava.nbio.structure.io.TestMMCIFWriting#test1A2C
org.biojava.nbio.structure.io.TestMMCIFWriting#test1SMT
org.biojava.nbio.structure.io.TestMMCIFWriting#test2N3J
org.biojava.nbio.structure.io.TestMMCIFWriting#testBiounitWriting
org.biojava.nbio.structure.TestStructureSerialization#testSerializeStructure

Fixed flaky tests:
org.biojava.nbio.structure.test.align.AlignmentToolsTest.testToConciseAlignmentString
org.biojava.nbio.structure.test.Test1a4w.testChemComps
org.biojava.nbio.structure.test.scop.ScopTest.testLocalScop
org.biojava.nbio.structure.test.cluster.TestSubunitClustererExamples.testPseudostoichiometry
org.biojava.nbio.structure.test.StructureToolsTest.testGetRepresentativeAtomsProtein
org.biojava.nbio.structure.test.symmetry.TestQuatSymmetryDetectorExamples.testLocal

Process finished with exit code 0

```

## Further development

This script could be further expanded to iterate through projects and automatically detect changes for flaky tests.
