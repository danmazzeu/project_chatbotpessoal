const express = require('express');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { createAuthState } = require('./repositories/authRepository');
const { handleMessage } = require('./repositories/messageRepository');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

const qrCodeFolderPath = path.resolve(__dirname, 'qrcode');
console.log('Caminho da pasta qrcode:', qrCodeFolderPath);

if (!fs.existsSync(qrCodeFolderPath)) {
    fs.mkdirSync(qrCodeFolderPath, { recursive: true });
    console.log('Pasta qrcode criada!');
}

const app = express();
app.use(express.static('qrcode'));

let botPaused = false;
let pausedUntil = null;

const ownerNumber = '5516993630686@c.us';  // Use o formato correto de número para WhatsApp (adicionando @c.us)

app.get('/', async (req, res) => {
    try {
        console.log('Acessando URL, iniciando o bot...');
        const { state, saveCreds } = await createAuthState();
        const sock = makeWASocket({ auth: state });

        sock.ev.on('connection.update', async (update) => {
            console.log('Atualização de conexão:', update);
            if (update.qr) {
                console.log('QR Code gerado:', update.qr);
                const qrFilePath = path.join(qrCodeFolderPath, 'qrcode.png');
                await qrcode.toFile(qrFilePath, update.qr);
                console.log('QR Code salvo em:', qrFilePath);

                res.send(`
                    <html>
                        <body>
                            <h1>Escaneie o QR Code para conectar o bot</h1>
                            <img src="/qrcode.png" alt="QR Code">
                        </body>
                    </html>
                `);
            }
            if (update.connection === 'close') {
                console.error('Conexão fechada. Tentando reiniciar...');
            }
            if (update.connection === 'open') {
                console.log('Bot conectado com sucesso!');
            }
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('messages.upsert', async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message || msg.key.fromMe) return;

            // Verificar se é a mensagem do dono e se é "/pausar"
            if (msg.message.conversation === '/pausar' && msg.key.remoteJid === ownerNumber) {
                if (!botPaused) {
                    console.log('Automação pausada por 15 minutos');
                    botPaused = true;
                    pausedUntil = Date.now() + 15 * 60 * 1000; // 15 minutos em milissegundos

                    await sock.sendMessage(msg.key.remoteJid, { text: 'Automação pausada por 15 minutos.' });

                    // Após 15 minutos, retomar o bot
                    setTimeout(() => {
                        botPaused = false;
                        pausedUntil = null;
                        console.log('Bot retomado!');
                        sock.sendMessage(msg.key.remoteJid, { text: 'Automação reiniciada!' });
                    }, 15 * 60 * 1000); // 15 minutos
                } else {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'A automação já está pausada.' });
                }
            }

            if (!botPaused) {
                await handleMessage(sock, msg);
            } else {
                console.log('Automação está pausada, ignorando mensagens...');
            }
        });

    } catch (error) {
        console.error('Erro ao iniciar o bot:', error);
        res.status(500).send('Erro ao iniciar o bot');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
