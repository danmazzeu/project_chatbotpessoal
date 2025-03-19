const fs = require('fs');
const path = require('path');
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');

// Alterando o caminho para '/tmp', que é geralmente acessível em containers
const authFolderPath = path.resolve('/tmp', 'auth');

function createAuthFolder() {
    if (!fs.existsSync(authFolderPath)) {
        fs.mkdirSync(authFolderPath, { recursive: true });
        console.log('Pasta auth criada!');
    }
}

async function createAuthState() {
    createAuthFolder();
    const { state, saveCreds } = await useMultiFileAuthState(authFolderPath);
    return { state, saveCreds };
}

module.exports = { createAuthState };
