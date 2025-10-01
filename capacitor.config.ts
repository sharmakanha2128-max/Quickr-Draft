import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quickr.app',
  appName: 'Quickr',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
