const express = require('express');
const router = express.Router();
const Joi = require('joi');
const logger = require('../utils/logger');
const { callLLM } = require('../services/llmService');

const messageSchema = Joi.object({
  message: Joi.string().min(5).max(2000).required(),
});

router.post('/', async (req, res) => {
  const { error } = messageSchema.validate(req.body);
  if (error) {
    logger.warn('Invalid request payload');
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    logger.info('Processing /summarize request');
    const result = await callLLM(req.body.message);
    res.json(result);
  } catch (err) {
    logger.error(`Error in /summarize: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
