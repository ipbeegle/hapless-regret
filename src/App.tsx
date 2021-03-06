import { useState, useEffect } from 'react';
import _ from 'lodash';

import { adjectives, nouns } from './words';
import './App.css';

function generateProjectName(options?: {number: boolean, words: number, iterative: boolean}) {
  const defaults = {
    number: false,
    words: 2,
    iterative: false,
  };
  const parsedOptions = _.merge(defaults, options || {});

  let raw = getRawProjName(parsedOptions);

  return {
    raw: raw,
    dashed: raw.join('-'),
    spaced: raw.join(' ')
  };
}

function getRawProjName(options: {number: boolean, words: number, iterative: boolean}) {
  let raw: string[] = [];
  _.times(options.words - 1, function() {
    if (options.iterative && raw.length)
      raw.push(_.sample(getiterativeMatches(adjectives, raw[0].charAt(0))));
    else
      raw.push(_.sample(adjectives).toLowerCase());
  });

  if (options.iterative)
    raw.push(_.sample(getiterativeMatches(nouns, raw[0].charAt(0))));
  else
    raw.push(_.sample(nouns).toLowerCase());

  if (options.number) {
    raw.push(_.random(1, 9999).toString());
  }
  return raw;
}

function getiterativeMatches(arr: string[], letter: string) {
  var check = letter.toLowerCase();
  return _.filter(arr, function(elm) { return elm.substring(0, 1).toLowerCase() === check; });
}

function NameGenerator(props: {projectNames: string[]}) {
  return (
    <div className="ProjectNamesContainer">
      <div className="ProjectNames">
        {props.projectNames.map(name => <p key={name}>{name}</p>)}
      </div>
    </div>
  )
}

function App() {
  const [nameNumWords, setNameNumWords] = useState(2);
  const [nameUseNumber, setNameUseNumber] = useState(false);
  const [nameDashed, setNameDashed] = useState(false);
  const [nameIterative, setNameIterative] = useState(false);
  const [projectNames, setProjectNames] = useState([]);

  function generateProjectNames(props?: {words: number, number: boolean, dashed: boolean, iterative: boolean}) {
    setProjectNames(_.times(10, () => generateProjectName(props)[props.dashed ? "dashed" : "spaced"]));
  }

  function refreshProjectNames() {
    generateProjectNames({words: nameNumWords, number: nameUseNumber, dashed: nameDashed, iterative: nameIterative});
  }

  useEffect(() => refreshProjectNames(), [nameNumWords, nameUseNumber, nameDashed, nameIterative])

  return (
    <div className="App">
      <div className="GeneratorOptions">
        <label>
          <button onClick={() => refreshProjectNames()}>&#x21bb;</button>
        </label>
        <label>
          <input type="number" style={{width: "40px"}} min="2" value={nameNumWords}
                 onChange={e => setNameNumWords(e.target.value)} /> Words
        </label>
        <label>
          <input type="checkbox" checked={nameUseNumber} onChange={e => setNameUseNumber(e.target.checked)} /> Number
        </label>
        <label>
          <input type="checkbox" checked={nameDashed} onChange={e => setNameDashed(e.target.checked)} /> Dashed
        </label>
        <label>
          <input type="checkbox" checked={nameIterative} onChange={e => setNameIterative(e.target.checked)} />
          <span title="Every word starts with the same letter" style={{paddingLeft: "5px", borderBottom: "1px dashed black"}}>
            Iterative
          </span>
        </label>
      </div>
      <NameGenerator projectNames={projectNames} />
    </div>
  );
}

export default App;
