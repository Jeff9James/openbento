import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, RoundedBox, Html } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Maximize2,
  Info,
  Navigation,
  Tag,
  MapPin,
  ShoppingBag,
  ExternalLink,
  Box as BoxIcon,
  RotateCw,
} from 'lucide-react';
import { useProFeatures } from '../hooks/useProFeatures';
import { ProGuard, UpgradePrompt } from './ProGuard';

interface Hotspot {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
  type: 'product' | 'info' | 'link' | 'location';
  url?: string;
  price?: string;
  image?: string;
}

interface ThreeDBlockProps {
  isOpen: boolean;
  onClose: () => void;
  roomName?: string;
  roomType?: 'store' | 'gallery' | 'showroom' | 'custom';
  hotspots?: Hotspot[];
  backgroundColor?: string;
  onUpgradeClick?: () => void;
}

// 3D Room Component
const Room: React.FC<{
  roomType: string;
  hotspots: Hotspot[];
  onHotspotClick: (hotspot: Hotspot) => void;
  selectedHotspot: Hotspot | null;
}> = ({ roomType, hotspots, onHotspotClick, selectedHotspot }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const roomGeometry = useMemo(() => {
    switch (roomType) {
      case 'store':
        return (
          <>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#f3f4f6" />
            </mesh>
            {/* Walls */}
            <mesh position={[0, 3, -10]} receiveShadow>
              <planeGeometry args={[20, 10]} />
              <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
              <planeGeometry args={[20, 10]} />
              <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            <mesh position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
              <planeGeometry args={[20, 10]} />
              <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            {/* Display platforms */}
            {[...Array(4)].map((_, i) => (
              <mesh
                key={i}
                position={[-6 + i * 4, -1, -2]}
                castShadow
                receiveShadow
              >
                <cylinderGeometry args={[0.8, 1, 2, 32]} />
                <meshStandardMaterial color="#d1d5db" />
              </mesh>
            ))}
          </>
        );
      case 'gallery':
        return (
          <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
            {[...Array(6)].map((_, i) => (
              <mesh key={i} position={[(-5 + i * 2) * (i % 2 === 0 ? 1 : -1), 1, -8 + i * 2]} castShadow>
                <boxGeometry args={[2, 3, 0.1]} />
                <meshStandardMaterial color="#374151" />
              </mesh>
            ))}
          </>
        );
      default:
        return (
          <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#f9fafb" />
            </mesh>
            {/* Abstract shapes */}
            <RoundedBox args={[3, 3, 3]} radius={0.2} position={[-5, 0, -5]} castShadow>
              <meshStandardMaterial color="#8b5cf6" />
            </RoundedBox>
            <Sphere args={[2]} position={[5, 0, -5]} castShadow>
              <meshStandardMaterial color="#ec4899" />
            </Sphere>
            <Cylinder args={[1.5, 1.5, 4]} position={[0, 0, 5]} castShadow>
              <meshStandardMaterial color="#3b82f6" />
            </Cylinder>
          </>
        );
    }
  }, [roomType]);

  return (
    <group ref={groupRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />

      {/* Room geometry */}
      {roomGeometry}

      {/* Hotspots */}
      {hotspots.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          isHovered={hoveredHotspot === hotspot.id}
          isSelected={selectedHotspot?.id === hotspot.id}
          onHover={setHoveredHotspot}
          onClick={onHotspotClick}
        />
      ))}
    </group>
  );
};

// Hotspot marker component
const HotspotMarker: React.FC<{
  hotspot: Hotspot;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  onClick: (hotspot: Hotspot) => void;
}> = ({ hotspot, isHovered, isSelected, onHover, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = hotspot.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const color = useMemo(() => {
    switch (hotspot.type) {
      case 'product':
        return '#10b981';
      case 'info':
        return '#3b82f6';
      case 'link':
        return '#8b5cf6';
      case 'location':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  }, [hotspot.type]);

  return (
    <group position={hotspot.position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => {
          onHover(hotspot.id);
          setActive(true);
        }}
        onPointerOut={() => {
          onHover(null);
          setActive(false);
        }}
        onClick={() => onClick(hotspot)}
        scale={isHovered || isSelected ? 1.3 : 1}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.5 : 0.2}
        />
      </mesh>
      {/* Pulse effect ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Label */}
      {(isHovered || isSelected) && (
        <Html distanceFactor={10}>
          <div className="pointer-events-none whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-900 shadow-lg">
            {hotspot.title}
          </div>
        </Html>
      )}
    </group>
  );
};

// Camera controller
const CameraController: React.FC = () => {
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(0, 2, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
};

export const ThreeDBlock: React.FC<ThreeDBlockProps> = ({
  isOpen,
  onClose,
  roomName = 'My 3D Space',
  roomType = 'store',
  hotspots = [],
  backgroundColor = '#f9fafb',
  onUpgradeClick,
}) => {
  const { canUse3DBlocks, isPro } = useProFeatures();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const defaultHotspots: Hotspot[] = useMemo(
    () => [
      {
        id: '1',
        position: [-6, 0, -2],
        title: 'Featured Product',
        description: 'Check out our bestselling item with exclusive features.',
        type: 'product',
        price: '$49.99',
      },
      {
        id: '2',
        position: [-2, 0, -2],
        title: 'New Arrival',
        description: 'Just added to our collection. Limited stock available!',
        type: 'product',
        price: '$79.99',
      },
      {
        id: '3',
        position: [2, 0, -2],
        title: 'Store Info',
        description: 'Learn more about our story and values.',
        type: 'info',
      },
      {
        id: '4',
        position: [6, 0, -2],
        title: 'Visit Website',
        description: 'Explore our full catalog online.',
        type: 'link',
        url: 'https://example.com',
      },
    ],
    []
  );

  const activeHotspots = hotspots.length > 0 ? hotspots : defaultHotspots;

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
  };

  const getHotspotIcon = (type: Hotspot['type']) => {
    switch (type) {
      case 'product':
        return <ShoppingBag className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'link':
        return <ExternalLink className="h-5 w-5" />;
      case 'location':
        return <MapPin className="h-5 w-5" />;
      default:
        return <Tag className="h-5 w-5" />;
    }
  };

  const getHotspotColor = (type: Hotspot['type']) => {
    switch (type) {
      case 'product':
        return 'bg-green-100 text-green-700';
      case 'info':
        return 'bg-blue-100 text-blue-700';
      case 'link':
        return 'bg-violet-100 text-violet-700';
      case 'location':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm ${
              isFullscreen ? '' : 'flex items-center justify-center p-4'
            }`}
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative overflow-hidden rounded-3xl bg-white shadow-2xl ${
                isFullscreen ? 'h-screen w-screen' : 'h-[85vh] w-full max-w-6xl'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <BoxIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold">{roomName}</h2>
                    <p className="text-sm text-white/80">
                      {isPro ? 'Drag to rotate • Click hotspots' : 'Pro Feature'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  >
                    <Maximize2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* 3D Canvas */}
              <div className="h-full w-full" style={{ backgroundColor }}>
                {isPro ? (
                  <Canvas shadows camera={{ position: [0, 2, 10], fov: 60 }}>
                    <CameraController />
                    <OrbitControls
                      enablePan={true}
                      enableZoom={true}
                      enableRotate={true}
                      minDistance={5}
                      maxDistance={20}
                      maxPolarAngle={Math.PI / 2 - 0.1}
                    />
                    <Room
                      roomType={roomType}
                      hotspots={activeHotspots}
                      onHotspotClick={handleHotspotClick}
                      selectedHotspot={selectedHotspot}
                    />
                  </Canvas>
                ) : (
                  <ProGuard
                    feature="canUse3DBlocks"
                    onUpgradeClick={() => setShowUpgradePrompt(true)}
                    showUpgradePrompt={true}
                  />
                )}
              </div>

              {/* Hotspot Details Panel */}
              <AnimatePresence>
                {selectedHotspot && isPro && (
                  <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    className="absolute bottom-4 right-4 top-20 w-80 overflow-hidden rounded-2xl bg-white shadow-2xl"
                  >
                    <div className="flex h-full flex-col">
                      <div className="flex items-center justify-between border-b border-gray-100 p-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            getHotspotColor(selectedHotspot.type)
                          }`}
                        >
                          {getHotspotIcon(selectedHotspot.type)}
                        </div>
                        <button
                          onClick={() => setSelectedHotspot(null)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4">
                        <h3 className="mb-2 text-lg font-bold text-gray-900">
                          {selectedHotspot.title}
                        </h3>
                        <p className="mb-4 text-sm text-gray-600">
                          {selectedHotspot.description}
                        </p>
                        {selectedHotspot.price && (
                          <div className="mb-4 text-2xl font-bold text-violet-600">
                            {selectedHotspot.price}
                          </div>
                        )}
                        {selectedHotspot.url && (
                          <a
                            href={selectedHotspot.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-medium text-white transition-colors hover:bg-violet-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Visit Link
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls hint */}
              {isPro && !selectedHotspot && (
                <div className="absolute bottom-4 left-4 rounded-xl bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <RotateCw className="h-4 w-4" />
                      Drag to rotate
                    </span>
                    <span className="flex items-center gap-1">
                      <Navigation className="h-4 w-4" />
                      Click hotspots
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onUpgrade={() => {
          setShowUpgradePrompt(false);
          onUpgradeClick?.();
        }}
        feature="3D interactive room views"
      />
    </>
  );
};

// Compact 3D Block Preview (for grid)
export const ThreeDBlockPreview: React.FC<{
  roomName?: string;
  onClick: () => void;
  isPro: boolean;
}> = ({ roomName = '3D View', onClick, isPro }) => {
  return (
    <div
      onClick={onClick}
      className="group relative flex h-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 text-white"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQgMEgwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

      <motion.div
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="relative mb-4"
      >
        <BoxIcon className="h-16 w-16 opacity-80" />
      </motion.div>

      <h3 className="relative z-10 text-center text-lg font-bold">{roomName}</h3>
      <p className="relative z-10 mt-1 text-center text-sm text-white/80">
        {isPro ? 'Click to explore' : 'Pro Feature'}
      </p>

      {!isPro && (
        <div className="absolute right-2 top-2 rounded-full bg-amber-400 px-2 py-1 text-xs font-bold text-amber-900">
          PRO
        </div>
      )}

      <div className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/10" />
    </div>
  );
};

export default ThreeDBlock;
