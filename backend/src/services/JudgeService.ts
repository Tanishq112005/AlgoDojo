import axios from 'axios';

export interface TestCase {
  input: string;
  output: string;
}

export class JudgeService {
  private readonly wandboxUrl = 'https://wandbox.org/api/compile.json';

  async evaluateCode(language: string, code: string, testCases: TestCase[]): Promise<{ success: boolean; message?: string }> {
    if (!testCases || testCases.length === 0) {
      return { success: false, message: "No test cases provided." };
    }

    let compiler = 'gcc-head';
    let lang = language.toLowerCase();
    
    if (lang === 'c++' || lang === 'cpp') {
      compiler = 'gcc-head';
    } else if (lang === 'python') {
      compiler = 'cpython-head';
    } else if (lang === 'javascript' || lang === 'js') {
      compiler = 'nodejs-20.17.0';
    } else if (lang === 'java') {
      compiler = 'openjdk-jdk-22+36';
    } else {
      return { success: false, message: `Unsupported language: ${language}` };
    }

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      
      try {
        const response: any = await axios.post(this.wandboxUrl, {
          compiler: compiler,
          code: code,
          stdin: tc.input
        });

        const result = response.data;
        
        // Wandbox returns status '0' on success. If it's a compile error, compiler_error is populated.
        // If it's a runtime error, program_error is populated.
        if (result.compiler_error) {
           return { success: false, message: `Compilation Error:\n${result.compiler_error}` };
        }
        
        if (result.status !== '0' && result.program_error) {
           return { success: false, message: `Runtime Error:\n${result.program_error}` };
        }

        const actualOutput = (result.program_output || '').trim();
        const expectedOutput = (tc.output || '').trim();

        if (actualOutput !== expectedOutput) {
          return { 
            success: false, 
            message: `Wrong Answer on Test Case ${i + 1}\nInput:\n${tc.input}\nExpected:\n${expectedOutput}\nActual:\n${actualOutput}` 
          };
        }
      } catch (error: any) {
        console.error("Wandbox API Error:", error.response?.data || error.message);
        return { success: false, message: "Internal server error during code execution." };
      }
    }

    return { success: true, message: "All test cases passed." };
  }
}

export default new JudgeService();
