import React, { useState, useEffect } from 'react';
import './App.css';

const confluenceKeys = [
  'liquiditySweep',
  'breakOfStructure',
  'fairValueGap',
  'orderBlock',
  'equilibrium',
  'fibonacciRetracements',
  'session',
  'risk',
  'availability',
];

function App() {
  const [tradeType, setTradeType] = useState('');
  const [confluences, setConfluences] = useState({
    liquiditySweep: null,
    breakOfStructure: null,
    fairValueGap: null,
    orderBlock: null,
    equilibrium: null,
    fibonacciRetracements: null,
    session: null,
    risk: null,
    availability: null,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [warning, setWarning] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [decision, setDecision] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const essentialConfluences = confluenceKeys.slice(0, 7);
    const allEssentialMet = essentialConfluences.every(key => confluences[key]);
    setCanSubmit(allEssentialMet);
  }, [confluences]);

  const handleTradeTypeChange = (e) => {
    setTradeType(e.target.value);
  };

  const handleConfluenceChange = (e) => {
    setConfluences({ ...confluences, [e.target.name]: e.target.value === 'yes' });
  };

  const handleNext = () => {
    if (currentStep < confluenceKeys.length) {
      setConfluences({
        ...confluences,
        [confluenceKeys[currentStep]]: null
      });
      setCurrentStep(currentStep + 1);
    } else {
      const essentialConfluences = confluenceKeys.slice(0, 7);
      const allEssentialMet = essentialConfluences.every(key => confluences[key]);
      if (allEssentialMet) {
        if (!confluences.risk || !confluences.availability) {
          setWarning('Warning: Risk or availability condition not met.');
        } else {
          setWarning('');
        }
        setDecision('You can enter the trade.');
      } else {
        setDecision('Confluences not met. Cannot enter trade.');
      }
      const currentDate = new Date().toISOString().split('T')[0];
      setDate(currentDate);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const downloadCSV = () => {
    const headers = ['Confluence', 'Status'];
    const rows = Object.keys(confluences).map((key) => [key, confluences[key] ? 'Positive' : 'Negative']);
    rows.push(['Date', date]);
    rows.push(['Trade Type', tradeType]);
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `confluences.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const confluenceLabels = {
    liquiditySweep: "Is there a liquidity sweep?",
    breakOfStructure: "Is there a break of structure?",
    fairValueGap: "Is there a fair value gap (imbalance)?",
    orderBlock: "Is an order block formed?",
    equilibrium: "Is the equilibrium above 0.5 for sell or below 0.5 for buy?",
    fibonacciRetracements: "Are the Fibonacci retracements respected perfectly?",
    session: "Is it either the London or New York session?",
    risk: "Are you not risking more than $5 for the stop loss?",
    availability: "Are you ready and not busy at the moment?"
  };

  return (
    <div className="App">
      <h1>Forex Trading Confluence Checker</h1>
      {currentStep === 0 && (
        <div className="trade-type">
          <label>
            <input type="radio" value="buy" name="tradeType" onChange={handleTradeTypeChange} /> Buy
          </label>
          <label>
            <input type="radio" value="sell" name="tradeType" onChange={handleTradeTypeChange} /> Sell
          </label>
          <button onClick={handleNext} disabled={!tradeType} className="big-button">Next</button>
        </div>
      )}
      {currentStep > 0 && currentStep <= confluenceKeys.length && (
        <div className="confluence-step">
          <h2>{confluenceLabels[confluenceKeys[currentStep - 1]]}</h2>
          <label>
            <input type="radio" value="yes" name={confluenceKeys[currentStep - 1]} onChange={handleConfluenceChange} checked={confluences[confluenceKeys[currentStep - 1]] === true} /> Yes
          </label>
          <label>
            <input type="radio" value="no" name={confluenceKeys[currentStep - 1]} onChange={handleConfluenceChange} checked={confluences[confluenceKeys[currentStep - 1]] === false} /> No
          </label>
          <div className="navigation-buttons">
            <button onClick={handlePrevious} className="big-button">Previous</button>
            <button onClick={handleNext} className="big-button">{currentStep === confluenceKeys.length ? 'Submit' : 'Next'}</button>
          </div>
        </div>
      )}
      {decision && (
        <div className="decision-section">
          <h2>{decision}</h2>
          {warning && <div className="warning">{warning}</div>}
          <button onClick={downloadCSV} className="big-button">Download Confluences</button>
        </div>
      )}
    </div>
  );
}

export default App;
