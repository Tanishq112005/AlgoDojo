import { Request, Response } from 'express';
import ProblemService from '../services/ProblemService';

export class ProblemController {
  async getCodeforcesProblems(req: Request, res: Response) {
    const rating: number = req.body.rating;
    try {
      const filtered = await ProblemService.getCodeforcesProblems(rating);
      res.status(200).json({ status: "OK", result: { problems: filtered } });
    } catch (err) {
      res.status(404).json({ Error: "Error occurs in calling the codeforces api" });
    }
  }

  async getFullCodeforcesQuestion(req: Request, res: Response) {
    const { contestId, index } = req.body;
    if (!contestId || !index) {
      return res.status(400).json({ error: 'Please provide both contestId and index' });
    }

    try {
      const result = await ProblemService.scrapeCodeforcesProblem(contestId.toString(), index.toString());
      res.status(200).json(result);
    } catch (err: any) {
      console.error('Error scraping full question:', err);
      if (err.message === 'ScrapeFailed') {
        res.status(502).json({ error: 'Failed to scrape full question from Codeforces' });
      } else {
        res.status(500).json({ error: err.message || err });
      }
    }
  }

  async getLeetcodeProblems(req: Request, res: Response) {
    const { difficulty } = req.body;
    if (!difficulty) {
      return res.status(400).json({ error: "Please send { difficulty: 'easy' } as JSON" });
    }

    try {
      const result = await ProblemService.getLeetcodeProblems(difficulty);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getFullLeetcodeQuestion(req: Request, res: Response) {
    const { titleSlug } = req.body;
    if (!titleSlug) {
      return res.status(400).json({ error: "Please send { titleSlug: 'two-sum' }" });
    }

    try {
      const result = await ProblemService.getFullLeetcodeQuestion(titleSlug);
      return res.json(result);
    } catch (err: any) {
      if (err.status) {
        return res.status(err.status).json(err.data);
      }
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new ProblemController();
