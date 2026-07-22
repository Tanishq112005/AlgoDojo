import { Request, Response } from 'express';
import JudgeService from '../services/JudgeService';

export class JudgeController {
  async checkProblem(req: Request, res: Response) {
    const { language = 'c++', code, testCases } = req.body;

    if (!code) {
      return res.status(400).json({ Error: "Missing 'code' in request body." });
    }

    try {
      let cases = testCases;
      
      if (!cases && req.body.question && req.body.question.sampleTestCase) {
        
        cases = [{ input: req.body.question.sampleTestCase, output: '' }]; 
        
      }

      const result = await JudgeService.evaluateCode(language, code, cases);

      if (result.success) {
        res.status(200).json({ result: "true" });
      } else {
        res.status(200).json({ result: `false\n${result.message}` });
      }

    } catch (err: any) {
      console.error("Judge error:", err);
      return res.status(500).json({
        Error: {
          message: err.message
        }
      });
    }
  }
}

export default new JudgeController();
