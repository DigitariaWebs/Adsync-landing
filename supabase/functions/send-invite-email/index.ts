// Supabase Edge Function : envoi de l'email d'invitation via Resend.
// Cette fonction NE cree pas l'invite (le client le fait deja sous RLS),
// elle envoie uniquement l'email avec le lien vers /admin.
//
// Deploy :
//   - Via le dashboard Supabase (Edge Functions > New function "send-invite-email")
//   - Ou via CLI : supabase functions deploy send-invite-email
//
// Secrets requis (Supabase > Edge Functions > Secrets) :
//   - RESEND_API_KEY        cle API Resend (re_...)
//   - INVITE_FROM_EMAIL     ex: noreply@adsynchro.com   (defaut)
//   - ADMIN_URL             ex: https://adsynchro.com/admin (defaut)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("INVITE_FROM_EMAIL") ?? "noreply@adsynchro.com";
const ADMIN_URL = Deno.env.get("ADMIN_URL") ?? "https://adsynchro.com/admin";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PERM_LABELS: Record<string, string> = {
  can_view_waitlist: "Voir les inscriptions",
  can_edit_waitlist: "Modifier les inscriptions",
  can_view_messages: "Voir les messages",
  can_reply_messages: "Répondre aux messages",
};

function buildHtml(email: string, invitedBy: string, perms: Record<string, boolean>) {
  const granted = Object.entries(perms)
    .filter(([, v]) => v)
    .map(([k]) => PERM_LABELS[k] ?? k);

  const permsBlock = granted.length
    ? `<ul style="padding-left:20px;margin:12px 0;color:#3d2b6b;font-size:14px;line-height:1.6">${granted
        .map((p) => `<li>${p}</li>`)
        .join("")}</ul>`
    : `<p style="color:#7a6ba8;font-size:14px">Aucune permission spécifique pour l'instant. L'admin pourra t'en donner après.</p>`;

  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;background:#f6f3fb;padding:40px 20px;color:#1f0c35">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(31,12,53,0.08)">
      <tr><td style="padding:32px 32px 16px">
        <h1 style="margin:0 0 8px;font-size:22px;color:#3d2b6b">Tu es invité·e à rejoindre AdSync.io</h1>
        <p style="margin:0;color:#5b4886;font-size:15px;line-height:1.5">${
          invitedBy ? `<strong>${invitedBy}</strong>` : "L'équipe AdSync.io"
        } t'invite à rejoindre l'espace admin en tant que manager.</p>
      </td></tr>
      <tr><td style="padding:8px 32px">
        <p style="margin:16px 0 4px;font-weight:600;color:#3d2b6b">Tes permissions :</p>
        ${permsBlock}
      </td></tr>
      <tr><td style="padding:8px 32px 32px">
        <p style="margin:16px 0;font-size:14px;line-height:1.6">Pour accepter, clique sur le bouton ci-dessous, puis choisis <strong>« Créer un compte »</strong> en utilisant <strong>cet email exact</strong> :</p>
        <p style="margin:8px 0;padding:10px 14px;background:#f6f3fb;border-radius:8px;font-family:monospace;font-size:14px;color:#3d2b6b">${email}</p>
        <p style="margin:16px 0;font-size:14px;line-height:1.6">Tes droits seront appliqués automatiquement dès ta première connexion.</p>
        <p style="text-align:center;margin:28px 0 8px">
          <a href="${ADMIN_URL}" style="display:inline-block;padding:14px 28px;background:#4e3787;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px">Créer mon compte</a>
        </p>
        <p style="margin:20px 0 0;font-size:12px;color:#7a6ba8">Ou copie ce lien dans ton navigateur :<br/><a href="${ADMIN_URL}" style="color:#4e3787">${ADMIN_URL}</a></p>
      </td></tr>
      <tr><td style="padding:16px 32px;background:#f6f3fb;border-top:1px solid rgba(78,55,135,0.1);font-size:12px;color:#7a6ba8;text-align:center">
        Si tu ne reconnais pas cet email, tu peux l'ignorer en toute sécurité.
      </td></tr>
    </table>
  </body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY missing on server" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    const body = await req.json();
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const invitedBy = (body?.invitedBy ?? "").toString().trim();
    const permissions = (body?.permissions ?? {}) as Record<string, boolean>;

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = buildHtml(email, invitedBy, permissions);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `AdSync.io <${FROM_EMAIL}>`,
        to: [email],
        subject: "Invitation à rejoindre l'admin AdSync.io",
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({ error: `Resend ${res.status}: ${text}` }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await res.json();
    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
