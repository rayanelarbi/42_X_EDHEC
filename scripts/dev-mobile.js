#!/usr/bin/env node

const qrcode = require('qrcode-terminal');
const { networkInterfaces } = require('os');

function getAllIPs() {
  const ips = [];
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal and non-ipv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        ips.push({ name, address: net.address });
      }
    }
  }
  return ips;
}

const port = process.env.PORT || 3000;
const ips = getAllIPs();
const mainIP = ips.length > 0 ? ips[0].address : 'localhost';
const url = `http://${mainIP}:${port}`;

console.log('\n');
console.log('═══════════════════════════════════════════════════');
console.log('📱  MOBILE DEV SERVER - Paula\'s Choice');
console.log('═══════════════════════════════════════════════════\n');

console.log('🖥️  Local (PC):');
console.log(`   http://localhost:${port}\n`);

console.log('📱 Mobile (Réseau):');
ips.forEach(ip => {
  console.log(`   http://${ip.address}:${port} (${ip.name})`);
});

console.log('\n📲 QR CODE - Scanne avec ton téléphone:\n');

qrcode.generate(url, { small: true }, (qr) => {
  console.log(qr);

  console.log('\n═══════════════════════════════════════════════════');
  console.log('⚠️  IMPORTANT - Lis bien:');
  console.log('═══════════════════════════════════════════════════');
  console.log('1. Ton téléphone ET ton PC doivent être sur le MÊME WiFi');
  console.log('2. Si tu as plusieurs WiFi disponibles, utilise la bonne IP');
  console.log('3. Sur iPhone: Safari peut bloquer HTTP → utilise Chrome');
  console.log('4. Désactive le VPN si tu en as un');
  console.log('5. Si ça marche pas, essaie avec le câble USB\n');

  console.log('🔥 URL PRINCIPALE:');
  console.log(`   ${url}`);
  console.log('\n═══════════════════════════════════════════════════\n');
});
