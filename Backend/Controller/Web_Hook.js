import { process_Lead } from "../Services/Process_Lead.js";
// web hook for get endpoint
export const get_Webhook= (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
  
  
    if (mode && token) {
      if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        
        return res.status(200).send(challenge);
      } else {
        console.log('Verification token mismatch.');
        return res.sendStatus(403);
      }
    }
  
    // 
    res.status(400).send('Missing hub query.');
  };
  //webhook for post endpoint

  export const post_Webhook=(req, res) => {
    res.status(200).send('EVENT_RECEIVED');
   
    const body = req.body;
    console.log(' RECEIVED WEBHOOK EVENT');
    console.log(JSON.stringify(body, null, 2));
   
    if (body.object !== 'page') return;
    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field === 'leadgen') {
         console.log("leadgen is successfully grabbed")
         process_Lead(change.value)

        }
      }
    }
  
   
    
  }