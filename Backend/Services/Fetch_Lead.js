export const fetch_Lead_Detail= async (leadGenId)=>{
  if(!process.env.PAGE_ACCESS_TOKEN){
    console.warn('PAGE_ACCESS_TOKEN is not there');
    return null;
  }
  try {
    const res = await fetch(`https://graph.facebook.com/${process.env.GRAPH_VERSION}/${leadGenId}`, {
      headers: { Authorization: `Bearer ${process.env.PAGE_ACCESS_TOKEN}` },
    });
    const data = await res.json();
    if (!res.ok) {
      
      console.warn('Lead detail fetch failed:', data.error?.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Lead detail fetch error:', err.message);
    return null;
  }
}