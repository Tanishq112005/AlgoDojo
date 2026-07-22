import  { useState, useEffect } from 'react';
import { useSelector} from 'react-redux';
import { type RootState } from '../redux_state_manegemet/store';


type TestCase = {
  input: string;
  expectedOutput: string;
};

function TestCases() {

  const [results, setResults] = useState<string[]>([]);
  const [userOutputs, setUserOutputs] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);


  const sampleTestCases = (useSelector((s: RootState) => s.sample_test.value) as TestCase[]) || [];
  const lang = useSelector((s: RootState) => s.lang.value);
  const files = useSelector((s: RootState) => s.files.value);
  const question_is_on = useSelector((s: RootState) => s.question_is_on.value);

  useEffect(() => {
    setResults(new Array(sampleTestCases.length).fill('pending'));
    setUserOutputs(new Array(sampleTestCases.length).fill(''));
  }, [sampleTestCases]);

  
  const runSingleTestCase = async (code: string, lang: string, input: string): Promise<{ stdout: string; stderr: string }> => {
    try {
      let compiler = 'gcc-head';
      let pistonLang = lang.toLowerCase();
      
      if (pistonLang === 'c++' || pistonLang === 'cpp') {
        compiler = 'gcc-head';
      } else if (pistonLang === 'python') {
        compiler = 'cpython-head';
      } else if (pistonLang === 'javascript' || pistonLang === 'js') {
        compiler = 'nodejs-20.17.0';
      } else if (pistonLang === 'java') {
        compiler = 'openjdk-jdk-22+36';
      }

      const res = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compiler: compiler,
          code: code,
          stdin: input,
        }),
      });
      const data = await res.json();
      
      if (data.compiler_error) {
        return { stdout: '', stderr: data.compiler_error };
      }
      
      if (data.status !== '0' && data.program_error) {
        return { stdout: '', stderr: data.program_error };
      }
      
      return { stdout: data.program_output || '', stderr: '' };
    } catch (err) {
      console.error('Execution error:', err);
      return { stdout: '', stderr: 'Execution failed' };
    }
  };

 
  const handleRunCode = async () => {
    if (isRunningTests) return;
    if (!files || !files[question_is_on - 1]) {
      alert('Error: Code file not found for the current question.');
      return;
    }
    if (sampleTestCases.length === 0) {
      alert('Error: No test cases available for this question.');
      return;
    }

    setIsRunningTests(true);
    const newResults: string[] = new Array(sampleTestCases.length).fill('pending');
    const newOutputs: string[] = new Array(sampleTestCases.length).fill('');
    setResults(newResults);
    setUserOutputs(newOutputs);

    for (let i = 0; i < sampleTestCases.length; i++) {
      setActiveTestCaseIndex(i);
      const testCase = sampleTestCases[i];
      const { stdout, stderr } = await runSingleTestCase(files[question_is_on - 1].value, lang, testCase.input);

      if (stderr) {
        newResults[i] = 'failed';
        newOutputs[i] = `Error:\n${stderr}`;
        console.error(`Test Case ${i + 1} Error:`, stderr);
      } else {
        newOutputs[i] = stdout;
        if (stdout.trim() === testCase.expectedOutput.trim()) {
          newResults[i] = 'passed';
        } else {
          newResults[i] = 'failed';
        }
      }
      setResults([...newResults]);
      setUserOutputs([...newOutputs]);
    }

    setIsRunningTests(false);
  };


  const getStatusClass = (status: string) => {
    if (status === 'passed') return 'status-dot passed';
    if (status === 'failed') return 'status-dot failed';
    return 'status-dot pending';
  };

  const activeTestCase = sampleTestCases[activeTestCaseIndex];

  const isProcessing = isRunningTests;

  return (
    <div className="test-cases-container">



    
      <div className="test-cases-header">
        <h4>Test Cases</h4>
        <div className="action-buttons">
          <button onClick={handleRunCode} className="run-code-btn" disabled={isProcessing}>
            {isRunningTests ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      <div className="test-cases-list">
        {sampleTestCases.map((_, index) => (
          <div
            key={index}
            className={`test-case-item ${index === activeTestCaseIndex ? 'active' : ''}`}
            onClick={() => !isProcessing && setActiveTestCaseIndex(index)}
          >
            <div className={getStatusClass(results[index])}></div>
            <div className="test-case-label">Test Case {index + 1}</div>
          </div>
        ))}
      </div>

      {activeTestCase && (
        <div className="test-case-details">
          <div className="detail-item">
            <span className="detail-label">Input:</span>
            <pre className="detail-value">{activeTestCase.input}</pre>
          </div>
          <div className="detail-item">
            <span className="detail-label">Expected Output:</span>
            <pre className="detail-value">{activeTestCase.expectedOutput}</pre>
          </div>
          <div className="detail-item">
            <span className="detail-label">Your Output:</span>
            {userOutputs[activeTestCaseIndex] && (
              <pre className="detail-value">{userOutputs[activeTestCaseIndex]}</pre>
            )}
            <span className={`detail-result ${results[activeTestCaseIndex]}`}>
              {results[activeTestCaseIndex]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestCases;