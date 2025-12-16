/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-syntax-highlighter/dist/esm/prism' {
  import { ComponentType } from 'react';
  const Prism: ComponentType<any>;
  export default Prism;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const vscDarkPlus: any;
  export const atomDark: any;
  // Add others as needed
}