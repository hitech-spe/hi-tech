// Netlify Serverless Proxy per invio notifiche WhatsApp senza limitazioni CORS del browser

export default async function (req) {
  // Gestione preflight CORS OPTIONS se invocato da un client esterno
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  const url = new URL(req.url);
  const phone = url.searchParams.get('phone');
  const text = url.searchParams.get('text');
  const apikey = url.searchParams.get('apikey');

  if (!phone || !text || !apikey) {
    return new Response(JSON.stringify({ error: 'Parametri obbligatori mancanti: phone, text, apikey' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  const cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
  const targetUrl = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(text)}&apikey=${apikey}`;

  try {
    const res = await fetch(targetUrl);
    const body = await res.text();

    return new Response(JSON.stringify({ success: true, message: body }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('[WhatsApp Proxy Error]:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
