import { flatten_Field_Data } from "./Flatten_Field.js";
import { fetch_Lead_Detail } from "./fetch_lead.js";
const leads = [];
const seenLeadIds = new Set();

export const process_Lead=async(value)=>{
    const id = value.leadgen_id;
    if (!id || seenLeadIds.has(id)) return;
    seenLeadIds.add(id);
   
    const details = await fetch_Lead_Detail(id);
    const lead = {
        id,
        formId: value.form_id,
        pageId: value.page_id,
        adId: value.ad_id ?? null,
        fields: details ? flatten_Field_Data(details.field_data) : {},
      };

    
      leads.unshift(lead);
      console.log('Lead generated:', lead);
}