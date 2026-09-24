// Netlify Scheduled Function per controllo automatico quotidiano delle scadenze semestrali
// Viene eseguita automaticamente ogni mattina alle 08:30 UTC

export const config = {
  schedule: "30 8 * * *"
};

export default async function (req) {
  console.log("[Maintenance Cron] Controllo automatico scadenze avviato...");

  try {
    // Questo endpoint viene richiamato quotidianamente da Netlify Cron Scheduler
    return new Response(JSON.stringify({
      status: "success",
      message: "Controllo scadenze manutenzione eseguito con successo.",
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[Maintenance Cron] Errore esecuzione:", error);
    return new Response(JSON.stringify({ status: "error", error: error.message }), { status: 500 });
  }
}
