const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  let payload = req.body || {};
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (error) {
      res.status(400).json({ error: 'JSON inválido.' });
      return;
    }
  }
  const candidate = payload.candidate || {};
  const file = payload.file || {};

  if (!process.env.RESEND_API_KEY) {
    res.status(500).json({ error: 'RESEND_API_KEY não configurada.' });
    return;
  }

  if (!candidate.name || !candidate.email || !payload.jobTitle || !file.name || !file.content || !allowedTypes.includes(file.type)) {
    res.status(400).json({ error: 'Dados obrigatórios ausentes.' });
    return;
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: [process.env.RESEND_TO_EMAIL || 'umoliveiradev@gmail.com'],
        reply_to: candidate.email,
        subject: `Nova candidatura: ${payload.jobTitle} - ${candidate.name}`,
        html: `<h2>Nova candidatura recebida</h2><p><strong>Vaga:</strong> ${escapeHtml(payload.jobTitle)}</p><p><strong>Candidato:</strong> ${escapeHtml(candidate.name)}</p><p><strong>E-mail:</strong> ${escapeHtml(candidate.email)}</p><p><strong>Telefone:</strong> ${escapeHtml(candidate.phone || '')}</p><p><strong>Cidade:</strong> ${escapeHtml(candidate.city || '')}</p><p><strong>CNH:</strong> ${escapeHtml(candidate.cnh || '')}</p><p><strong>Estado:</strong> ${escapeHtml(candidate.state || '')}</p><p><strong>Observações:</strong> ${escapeHtml(candidate.notes || 'Não informado')}</p>`,
        attachments: [{ filename: file.name, content: file.content }]
      })
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error('Resend rejeitou o e-mail:', resendError);
      let detail = 'O Resend não aceitou o envio.';
      try {
        const parsedError = JSON.parse(resendError);
        detail = parsedError.message || parsedError.name || detail;
      } catch (error) {}
      res.status(502).json({ error: `Resend: ${detail}` });
      return;
    }

    res.status(200).json({ sent: true });
  } catch (error) {
    console.error('Erro no envio:', error);
    res.status(500).json({ error: 'Não foi possível enviar a candidatura.' });
  }
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}
