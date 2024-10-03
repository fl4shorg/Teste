async function getUserIP() {
    const response = await fetch('https://api64.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
}
// Função para enviar dados para Supabase
async function enviarDadosParaSupabase(dados) {
    const response = await fetch('https://bszyccsuhpeigrruqdmd.supabase.co/rest/v1/Neext', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sua_chave_publica',
            'apikey': 'sua_chave_publica'
        },
        body: JSON.stringify(dados)
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao enviar os dados, por favor tente novamente.');
    } else {
        const result = await response.json();
        console.log('Dados enviados com sucesso:', result);
    }
}

// No seu evento de envio do formulário
document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio do formulário

    // Coleta os dados do formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const idade = document.getElementById('idade').value;
    const numero = document.getElementById('numero').value;
    const ip = document.getElementById('ip').value;
    const grupo = document.getElementById('grupo').value;
    const motivo = document.getElementById('motivo').value;

    const dados = { nome, email, idade, numero, ip, grupo, motivo };

    await enviarDadosParaSupabase(dados); // Chama a função para enviar os dados

    // Resto do código para notificações
});