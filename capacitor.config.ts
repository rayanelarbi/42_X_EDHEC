import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourorg.paulaschoiceproto',
  appName: 'PaulasChoiceProto',
  webDir: 'out', // sans importance en mode server.url, mais laisse-le
  server: {
    url: 'http://localhost:3000', // tu lanceras `npm run dev`
    cleartext: true,               // autoriser http en dev
  },
};

export default config;