   import NextPWA from 'next-pwa';

   export default NextPWA({
     dest: 'public',
     register: true,
     skipWaiting: true,
     disable: process.env.NODE_ENV === 'development'
   })({
     // 通常のNext.js設定
   });