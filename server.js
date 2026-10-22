const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MAX_REQUEST_SIZE = 8 * 1024 * 1024;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/send-application') {
    handleApplicationEmail(req, res);
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 - Arquivo não encontrado');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 - Erro interno do servidor');
      }
      return;
    }

    if (stats.isDirectory()) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 - Acesso proibido');
      return;
    }

    const range = req.headers.range;
    if (range && (ext === '.mp4' || ext === '.webm')) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

function handleApplicationEmail(req, res) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.RESEND_TO_EMAIL || 'umoliveiradev@gmail.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  if (!resendApiKey) {
    sendJson(res, 500, { error: 'RESEND_API_KEY não configurada no servidor.' });
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk;
    if (Buffer.byteLength(body) > MAX_REQUEST_SIZE) req.destroy();
  });
  req.on('error', () => sendJson(res, 400, { error: 'Requisição inválida.' }));
  req.on('end', async () => {
    try {
      const payload = JSON.parse(body);
      const candidate = payload.candidate || {};
      const file = payload.file || {};
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!candidate.name || !candidate.email || !payload.jobTitle || !file.name || !file.content || !allowedTypes.includes(file.type)) {
        sendJson(res, 400, { error: 'Dados obrigatórios ausentes.' });
        return;
      }

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromEmail,
          to: [adminEmail],
          reply_to: candidate.email,
          subject: `Nova candidatura: ${payload.jobTitle} - ${candidate.name}`,
          html: `<h2>Nova candidatura recebida</h2><p><strong>Vaga:</strong> ${escapeHtml(payload.jobTitle)}</p><p><strong>Candidato:</strong> ${escapeHtml(candidate.name)}</p><p><strong>E-mail:</strong> ${escapeHtml(candidate.email)}</p><p><strong>Telefone:</strong> ${escapeHtml(candidate.phone || '')}</p><p><strong>Cidade:</strong> ${escapeHtml(candidate.city || '')}</p><p><strong>CNH:</strong> ${escapeHtml(candidate.cnh || '')}</p><p><strong>Estado:</strong> ${escapeHtml(candidate.state || '')}</p><p><strong>Observações:</strong> ${escapeHtml(candidate.notes || 'Não informado')}</p>`,
          attachments: [{ filename: file.name, content: file.content }]
        })
      });
      if (!resendResponse.ok) {
        console.error('Resend rejeitou o e-mail:', await resendResponse.text());
        sendJson(res, 502, { error: 'O Resend não aceitou o envio.' });
        return;
      }
      sendJson(res, 200, { sent: true });
    } catch (error) {
      console.error('Erro no envio da candidatura:', error);
      sendJson(res, 500, { error: 'Não foi possível enviar a candidatura.' });
    }
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
