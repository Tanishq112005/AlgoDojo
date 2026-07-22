import axios from 'axios';
import puppeteer from 'puppeteer-core';

export class ProblemService {
  async getCodeforcesProblems(rating: number) {
    try {
      const response: any = await axios.get('https://codeforces.com/api/problemset.problems');
      const problems = response.data.result.problems;
      const filtered = problems.filter((problem: any) => problem.rating === rating);
      return filtered;
    } catch (err) {
      throw new Error("Error occurs in calling the codeforces api");
    }
  }

  async scrapeCodeforcesProblem(contestId: string, problemIndex: string) {
    const url = `https://codeforces.com/contest/${contestId}/problem/${problemIndex}?mobile=false`;
    const launchOptions: any = {
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    };
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }
    
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1280, height: 800 });
  
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
      await page.waitForSelector('div.problem-statement', { timeout: 20000 });
  
      const data = await page.evaluate(() => {
        const container = document.querySelector('div.problem-statement') as HTMLElement | null;
        if (!container) {
          return {
            title: '', timeLimit: '', memoryLimit: '', statementParas: [], statementHTML: '', samples: []
          };
        }
  
        const header = container.querySelector('.header') as HTMLElement | null;
        const title = (header?.querySelector('.title') as HTMLElement | null)?.innerText.trim() || '';
        const timeLimit = (header?.querySelector('.time-limit') as HTMLElement | null)?.innerText.trim() || '';
        const memoryLimit = (header?.querySelector('.memory-limit') as HTMLElement | null)?.innerText.trim() || '';
  
        const statementParas = Array.from(
          container.querySelectorAll('div:not(.header):not(.input-specification):not(.output-specification) > p')
        ).map(p => (p as HTMLElement).innerText.trim());
  
        const statementHTML = container.innerHTML.trim();
  
        const inputs = Array.from(
          container.querySelectorAll('.sample-test .input pre')
        ).map(el => (el as HTMLElement).innerText.trim());
        const outputs = Array.from(
          container.querySelectorAll('.sample-test .output pre')
        ).map(el => (el as HTMLElement).innerText.trim());
        const samples = inputs.map((input, i) => ({ input, output: outputs[i] || '' }));
  
        return { title, timeLimit, memoryLimit, statementParas, statementHTML, samples };
      });
  
      return { contestId, problemIndex, url, scrapedAt: new Date().toISOString(), ...data };
    } catch (error) {
      throw new Error('ScrapeFailed');
    } finally {
      await browser.close();
    }
  }

  async getLeetcodeProblems(difficulty: string) {
    const query = `
      query questionList(
        $categorySlug: String,
        $filters: QuestionListFilterInput,
        $limit: Int,
        $skip: Int
      ) {
        questionList(
          categorySlug: $categorySlug,
          filters: $filters,
          limit: $limit,
          skip: $skip
        ) {
          totalNum
          data {
            questionFrontendId
            title
            titleSlug
            difficulty
            isPaidOnly
            topicTags {
              name
            }
          }
        }
      }
    `;
    const variables = {
      categorySlug: "", skip: 0, limit: 50,
      filters: { difficulty: difficulty.toUpperCase() },
    };

    try {
      const response: any = await axios.post(
        'https://leetcode.com/graphql',
        { operationName: "questionList", query, variables },
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0',
            'Referer': 'https://leetcode.com/problemset/all/',
            'Origin': 'https://leetcode.com',
          },
        }
      );

      const nodeSet = response.data.data.questionList.data;  
      const unpaid = nodeSet.filter((q: any) => q.isPaidOnly === false);
      return { total: response.data.data.questionList.totalNum, unpaid };
    } catch (err: any) {
      throw new Error("Unexpected error fetching from LeetCode");
    }
  }

  async getFullLeetcodeQuestion(titleSlug: string) {
    const query = `
      query getQuestion($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          content
          sampleTestCase
        }
      }
    `;
    const variables = { titleSlug };

    try {
      const response: any = await axios.post(
        'https://leetcode.com/graphql',
        { operationName: "getQuestion", query, variables },
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0',
            'Referer': `https://leetcode.com/problems/${titleSlug}/`,
            'Origin': 'https://leetcode.com',
          },
        }
      );

      const q = response.data.data.question;
      if (!q) {
        throw new Error("Question not found");
      }

      return {
        titleSlug,
        descriptionHtml: q.content,
        sampleTestCase: q.sampleTestCase
      };
    } catch (err: any) {
      if (err.response?.status >= 400 && err.response.status < 500) {
        throw { status: err.response.status, data: err.response.data };
      }
      throw new Error("Failed to fetch question details");
    }
  }
}

export default new ProblemService();
