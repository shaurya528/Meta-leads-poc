import { flatten_Field_Data } from "./Flatten_Field.js";
import { fetch_Lead_Detail } from "./fetch_lead.js";
import { leads } from "../server.js";
const seenLeadIds = new Set();

export const process_Lead=async(value,io)=>{
    const id = value.leadgen_id;
    if (!id || seenLeadIds.has(id)) return;
    seenLeadIds.add(id);
   
    const details = await fetch_Lead_Detail(id);
    const lead = {
        id,
        formId: value.form_id,
        pageId: value.page_id,
        adId: value.ad_id ?? null,
        createdAt: new Date().toISOString(),
        fields: details ? flatten_Field_Data(details.field_data) : {},
      };

    
      leads.unshift(lead);
      console.log('Lead generated:', lead);
      if (io) {
        io.emit('new_lead', lead);
        console.log('Lead successfully emitted to Socket.io:', lead.id);
      } else {
        console.warn('Socket.io instance (io) was not provided to process_Lead');
      }
     
}