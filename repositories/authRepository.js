const fs = require('fs');
const path = require('path');
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');

const authFolderPath = path.resolve(__dirname, '..', 'auth');

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
