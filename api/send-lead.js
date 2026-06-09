export default async function handler(req, res) {
  // Libera CORS básico.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido.'
    });
  }

  try {
    const {
      nome,
      email,
      telefone,
      cidade,
      capital,
      mensagem,
      origem
    } = req.body || {};

    // Validação mínima.
    if (!nome || !email || !telefone) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios ausentes.'
      });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return res.status(500).json({
        success: false,
        message: 'RESEND_API_KEY não configurada.'
      });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.6;">
        <h2>Novo Lead - FORBODY Franquia</h2>

        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Cidade:</strong> ${cidade || 'Não informado'}</p>
        <p><strong>Capital:</strong> ${capital || 'Não informado'}</p>
        <p><strong>Mensagem:</strong> ${mensagem || 'Sem mensagem.'}</p>

        <hr />

        <p><strong>Origem:</strong> ${origem || 'Site'}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'FORBODY Franquias <onboarding@resend.dev>',
        to: ['robertovalhiente@gmail.com'],
        subject: `Novo Lead FORBODY - ${nome}`,
        html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro Resend:', data);

      return res.status(500).json({
        success: false,
        message: 'Erro ao enviar email.',
        error: data
      });
    }

    return res.status(200).json({
      success: true,
      id: data.id
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
}
