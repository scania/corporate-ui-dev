import * as fs from 'fs';
import * as path from 'path';

const componentName = path.basename(__filename).split('.')[0];
const componentClass = componentName.replace(/\b\w/g, l => l.toUpperCase());

const Component = require(`./${componentName}`)[componentClass];

const tsComponentProps = Component.properties;
const result = {};
let diff = {};
let errormessage:string;
let arrayOfDiffEntries = {};
let arrayOfRequiredEntries = {};
let requiredObject;

Object.entries(tsComponentProps).forEach(entry => {
  result[entry[0]] = (Object.keys(entry[1]).includes('type') === true) && !(Object.keys(entry[1]).includes('state')) ? (((Object.keys(entry[1]).includes('type') === true) && (Object.values(entry[1]).shift().name)) ? Object.values(entry[1]).shift().name : Object.values(entry[1]).shift()) : 'state';
});

(!fs.existsSync(`src/components/${componentName}/${componentName}.json`)) ? fs.writeFileSync(`src/components/${componentName}/${componentName}.json`, JSON.stringify(result), { flag: 'w+' }) : null;

const buff = fs.readFileSync(`src/components/${componentName}/${componentName}.json`);
requiredObject = JSON.parse(buff.toString());

diff = Object.keys(requiredObject).reduce((diff, key) => {
  if (requiredObject[key] === result[key]) return diff;
  return {
    ...diff,
    [key]: result[key],
  };
}, {});

arrayOfDiffEntries = [Object.entries(diff)].map(nested => nested.map(element => ((element[1] === undefined) ? (` '${element[0]} : ` + 'undefined\'') : `'${element.join(' : ')}'`)));

arrayOfRequiredEntries = [Object.entries(diff)].map(nested => nested.map((element, index) => (((requiredObject[Object.keys(requiredObject)[index]]) = element[0]) ? ` '${([element[0], `'${requiredObject[Object.values(requiredObject)[index]]}`]).join(' : ')}'` : null)));

console.log(`${arrayOfDiffEntries} ARRAYOFDIFFENTRIES`);
console.log(`${arrayOfRequiredEntries} ARRAYOFREQUIREDENTRIES`);

errormessage = `@Prop() ${arrayOfDiffEntries.join(' ')} are missing or wrong, should be ` + ` @Prop() ${arrayOfRequiredEntries.join(' ')}`;

it('builds', () => {
  expect(new Component()).toBeTruthy();
});

describe('Test if types are correct and correct Props are present', () => {
  it('Are the @Props present and correct', async () => {
    expect(requiredObject).toEqual(result);
  });

  it('Are the @Props present and correct', async () => {
    try {
      expect(requiredObject).toEqual(result);
    } catch (e) {
      throw new Error(errormessage);
    }
  });
});
