import { LucideIcon } from 'lucide-react';
import React from 'react';

export enum AppId {
  TERMINAL = 'terminal',
  BROWSER = 'browser',
  NOTEPAD = 'notepad',
  SETTINGS = 'settings',
  FILES = 'files',
  CHAT = 'chat',
  SOCIAL = 'social',
  STEAM = 'steam',
  GAME = 'game',
}

export interface AppConfig {
  id: AppId;
  title: string;
  icon: LucideIcon;
  component: React.FC<AppWindowProps>;
  defaultWidth: number;
  defaultHeight: number;
}

export interface WindowState {
  id: string; // Unique instance ID
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFloating: boolean;
  args?: any; // Arguments passed to the app on launch
}

export interface AppWindowProps {
  windowId: string;
  isActive: boolean;
  onLaunchApp: (appId: AppId, args?: any) => void;
  args?: any;
}

export interface FileSystemNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileSystemNode[];
}