import { ThreeElements } from '@react-three/fiber';

declare module '@react-three/fiber' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      ringGeometry: any;
      meshBasicMaterial: any;
      planeGeometry: any;
      cylinderGeometry: any;
      boxGeometry: any;
    }
  }
}

export {};
