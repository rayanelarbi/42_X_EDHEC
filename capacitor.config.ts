import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.exemple.monpoc',
  appName: 'MonPOC',
  webDir: 'out',
  server: {
    url: 'https://carrying-content-goals-alicoen.trycloudflare.com', // ex: 172.20.10.2 si hotspot iPhone
    cleartext: true,
  },
};

export default config;