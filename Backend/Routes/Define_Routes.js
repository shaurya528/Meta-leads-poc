import express from 'express'
import { get_Webhook,post_Webhook } from '../Controller/Web_Hook.js'
const router=express.Router();

router.get('/webhook',get_Webhook);
router.post('/webhook',post_Webhook);

export default router;