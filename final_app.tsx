import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Square, 
  Settings2, 
  Music2, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface JianpuNote {
  number: number; // 0 for rest, 1-7 for notes
  octave: number; // -1, 0, 1
  length: number; // 1 = quarter, 0.5 = eighth, etc.
  isBar?: boolean; // If true, this represents a bar line
}

interface Piece {
  id: string;
  title: string;
  subtitle: string;
  key: string;
  tempo: number;
  timeSignature: string;
  notes: JianpuNote[];
}

// --- Constants & Data ---
const FLUTE_KEYS: Record<string, number> = {
  'C': 261.63,
  'D': 293.66,
  'E': 329.63,
  'F': 349.23,
  'G': 392.00,
  'A': 440.00,
  'B': 493.88
};

const NOTE_RATIOS: Record<number, number> = {
  1: 1,      // Do
  2: 1.125,  // Re
  3: 1.25,   // Mi
  4: 1.333,  // Fa
  5: 1.5,    // Sol
  6: 1.667,  // La
  7: 1.875,  // Ti
};

const LESSONS = [
  {
    id: 'lesson-23',
    courseTitle: '第二十三课',
    exercises: [
      {
        id: '23-1',
        title: '练习1',
        key: 'G',
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { number: 5, octave: -1, length: 1 },
          { number: 5, octave: -1, length: 1 },
          { number: 5, octave: -1, length: 1 },
          { number: 5, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: -1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: -1, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: -1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 7, octave: -1, length: 1 },
          { number: 7, octave: -1, length: 1 },
          { number: 7, octave: -1, length: 1 },
          { number: 7, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 7, octave: -1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 0, length: 1 },
          { number: 4, octave: 0, length: 1 },
          { number: 4, octave: 0, length: 1 },
          { number: 4, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 7, octave: 0, length: 1 },
          { number: 7, octave: 0, length: 1 },
          { number: 7, octave: 0, length: 1 },
          { number: 7, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 7, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 1, length: 4 },
        ]
      },
      {
        id: '23-2',
        title: '练习2',
        key: 'G',
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { number: 5, octave: -1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: -1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 7, octave: -1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 7, octave: 0, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 1, length: 4 },
        ]
      },
      {
        id: '23-3',
        title: '练习3',
        key: 'G',
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { number: 5, octave: -1, length: 1 },
          { number: 5, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: -1, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 7, octave: -1, length: 1 },
          { number: 7, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 0, length: 1 },
          { number: 4, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 0, length: 1 },
          { number: 4, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 7, octave: 0, length: 1 },
          { number: 7, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
        ]
      },
      {
        id: '23-4',
        title: '练习4',
        key: 'G',
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { number: 5, octave: -1, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 7, octave: -1, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 4, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 7, octave: 0, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 7, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 7, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 2, length: 1 },
          { number: 2, octave: 2, length: 1 },
          { number: 3, octave: 2, length: 1 },
          { number: 4, octave: 2, length: 1 },
          { number: 5, octave: 2, length: 1 },
          { number: 6, octave: 2, length: 1 },
          { number: 7, octave: 2, length: 1 },
          { number: 1, octave: 2, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 2, length: 1 },
          { number: 3, octave: 2, length: 1 },
          { number: 4, octave: 2, length: 1 },
          { number: 5, octave: 2, length: 1 },
          { number: 6, octave: 2, length: 1 },
          { number: 7, octave: 2, length: 1 },
          { number: 1, octave: 2, length: 1 },
          { number: 2, octave: 2, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 2, length: 1 },
          { number: 4, octave: 2, length: 1 },
          { number: 5, octave: 2, length: 1 },
          { number: 6, octave: 2, length: 1 },
          { number: 7, octave: 2, length: 1 },
          { number: 1, octave: 2, length: 1 },
          { number: 2, octave: 2, length: 1 },
          { number: 3, octave: 2, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 2, length: 1 },
          { number: 5, octave: 2, length: 1 },
          { number: 6, octave: 2, length: 1 },
          { number: 7, octave: 2, length: 1 },
          { number: 1, octave: 2, length: 1 },
          { number: 2, octave: 2, length: 1 },
          { number: 3, octave: 2, length: 1 },
          { number: 4, octave: 2, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 2, length: 1 },
          { number: 6, octave: 2, length: 1 },
          { number: 7, octave: 2, length: 1 },
          { number: 1, octave: 2, length: 1 },
          { number: 2, octave: 2, length: 1 },
          { number: 3, octave: 2, length: 1 },
          { number: 4, octave: 2, length: 1 },
          { number: 5, octave: 2, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 2, length: 1 },
          { number: 7, octave: 2, length: 1 },
          { number: 1, octave: 2, length: 1 },
          { number: 2, octave: 2, length: 1 },
          { number: 3, octave: 2, length: 1 },
          { number: 4, octave: 2, length: 1 },
          { number: 5, octave: 2, length: 1 },
          { number: 6, octave: 2, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 2, length: 1 },
          { number: 5, octave: 2, length: 1 },
          { number: 4, octave: 2, length: 1 },
          { number: 3, octave: 2, length: 1 },
          { number: 2, octave: 2, length: 1 },
          { number: 1, octave: 2, length: 1 },
          { number: 7, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 7, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 7, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 7, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 7, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 1, length: 1 },
          { number: 7, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 7, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 4, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 7, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: -1, length: 1 },
          { number: 5, octave: -1, length: 1 },
          { number: 4, octave: -1, length: 1 },
          { number: 3, octave: -1, length: 1 },
          { number: 2, octave: -1, length: 1 },
          { number: 1, octave: -1, length: 1 },
          { number: 7, octave: -1, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: -1, length: 1 },
          { number: 4, octave: -1, length: 1 },
          { number: 3, octave: -1, length: 1 },
          { number: 2, octave: -1, length: 1 },
          { number: 1, octave: -1, length: 1 },
          { number: 7, octave: -1, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 5, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 0, length: 2 },
        ]
      },
      {
        id: '23-5',
        title: '练习5',
        key: 'G',
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { number: 5, octave: -1, length: 1 },
          { number: 7, octave: -1, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 7, octave: -1, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 0, length: 1 },
          { number: 4, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 7, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 7, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 1, length: 2 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 4, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 0, length: 1 },
          { number: 7, octave: -1, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 7, octave: -1, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 4, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 4, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 7, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 0, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 7, octave: -1, length: 1 },
          { number: 5, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 0, length: 2 },
        ]
      },
      {
        id: '23-6',
        title: '练习6',
        key: 'G',
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { number: 5, octave: -1, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: -1, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: -1, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 1, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 1, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 1, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 1, length: 1 },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 0, length: 1 },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 0, length: 1 },
          { number: 3, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 0, length: 1 },
          { number: 2, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 0, length: 1 },
          { number: 1, octave: 0, length: 1 },
          { number: 6, octave: -1, length: 1 },
          { number: 5, octave: -1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 0, length: 4 },
        ]
      },
      {
        id: '23-7',
        title: '练习7',
        key: 'G',
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { number: 1, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 1, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 1, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 2, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 2, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 3, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 3, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 4, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 4, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 5, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 5, octave: 1, length: 4 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 6, octave: 1, length: 1 },
          { number: 0, octave: 0, length: 0, isBar: true },
          { number: 6, octave: 1, length: 4 },
        ]
      },
    ]
  }
];

// --- Utilities ---
const getNoteFrequency = (baseFreq: number, note: JianpuNote) => {
  if (note.number === 0 || note.isBar) return 0;
  const ratio = NOTE_RATIOS[note.number] || 1;
  const octaveMod = Math.pow(2, note.octave);
  return baseFreq * ratio * octaveMod;
};

// --- Main Components ---
export default function App() {
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [expandedLessons, setExpandedLessons] = useState<Record<number, boolean>>({ 0: true });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIdx, setCurrentNoteIdx] = useState(-1);
  const [tempo, setTempo] = useState(LESSONS[0].exercises[0].tempo);
  const [volume, setVolume] = useState(0.5);
  const [fluteKey, setFluteKey] = useState(LESSONS[0].exercises[0].key);
  
  const currentPiece = LESSONS[activeLessonIdx].exercises[activeExerciseIdx];

  // Logic to handle expansion
  const toggleLesson = (idx: number) => {
    setExpandedLessons(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const selectExercise = (lessonIdx: number, exerciseIdx: number) => {
    stopPlayback();
    setActiveLessonIdx(lessonIdx);
    setActiveExerciseIdx(exerciseIdx);
    setTempo(LESSONS[lessonIdx].exercises[exerciseIdx].tempo);
  };
  
  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);

  // Initialize Audio
  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNode.current = audioContext.current.createGain();
      gainNode.current.connect(audioContext.current.destination);
    }
  };

  // Synthesis Logic (keeping existing work)
  const playFluteNote = (freq: number, duration: number) => {
    if (!audioContext.current || !gainNode.current || freq === 0) return;

    const ctx = audioContext.current;
    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const noteGain = ctx.createGain();
    
    osc.type = 'sine';
    subOsc.type = 'triangle';
    subOsc.frequency.value = freq;
    osc.frequency.value = freq;
    
    // Add breath noise
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 4000;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.05 * volume;

    const now = ctx.currentTime;
    const attack = 0.05;
    const decay = 0.1;
    const sustain = 0.6;
    const release = 0.1;

    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(volume, now + attack);
    noteGain.gain.exponentialRampToValueAtTime(volume * sustain, now + attack + decay);
    noteGain.gain.setValueAtTime(volume * sustain, now + duration - release);
    noteGain.gain.linearRampToValueAtTime(0, now + duration);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 5;
    lfoGain.gain.value = freq * 0.01;
    lfo.connect(lfoGain.gain);
    lfoGain.connect(osc.frequency);
    lfoGain.connect(subOsc.frequency);
    lfo.start();

    osc.connect(noteGain);
    subOsc.connect(noteGain);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(noteGain);
    noteGain.connect(gainNode.current);

    osc.start(now);
    subOsc.start(now);
    noise.start(now);
    
    osc.stop(now + duration);
    subOsc.stop(now + duration);
    noise.stop(now + duration);
  };

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    setCurrentNoteIdx(-1);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const playSequence = useCallback((idx: number) => {
    if (idx >= currentPiece.notes.length) {
      stopPlayback();
      return;
    }

    setCurrentNoteIdx(idx);
    const note = currentPiece.notes[idx];
    
    // If it's a bar line, skip to next index immediately with zero duration
    if (note.isBar) {
      playSequence(idx + 1);
      return;
    }

    const beatDuration = (60 / tempo);
    const duration = note.length * beatDuration;

    const freq = getNoteFrequency(FLUTE_KEYS[fluteKey], note);
    playFluteNote(freq, duration);

    timerRef.current = window.setTimeout(() => {
      playSequence(idx + 1);
    }, duration * 1000);
  }, [currentPiece, tempo, fluteKey, volume, stopPlayback]);

  const togglePlayback = () => {
    initAudio();
    if (isPlaying) {
      stopPlayback();
    } else {
      setIsPlaying(true);
      playSequence(0);
    }
  };

  useEffect(() => {
    return () => stopPlayback();
  }, [stopPlayback]);

  return (
    <div className="h-screen w-screen bg-window-bg overflow-hidden font-sans">
      <div className="w-full h-full bg-white flex flex-col overflow-hidden">
        
        <header className="h-14 px-6 flex justify-between items-center border-b border-black/5 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-bamboo-green flex items-center justify-center rounded-md text-white font-serif font-bold italic shadow-sm">
              笛
            </div>
            <h1 className="text-xl font-serif font-bold text-bamboo-green tracking-tight">
              Bamboo Flute Master
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs font-semibold text-ink">练习者：闲海山人</span>
              <span className="w-[1px] h-3 bg-black/10" />
              <span className="text-[10px] text-ink/40 font-medium">今日已练习: 45分钟</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          
          <aside className="w-56 bg-[#faf8f3] p-4 border-r border-black/5 overflow-y-auto overflow-x-hidden shrink-0 flex flex-col">
            <div className="mb-8">
              <h3 className="text-[11px] uppercase tracking-widest font-bold text-ink/30 mb-4 flex items-center gap-2">
                <Music2 size={12} />
                教材曲目
              </h3>
              
              <div className="space-y-2">
                {LESSONS.map((lesson, lessonIdx) => (
                  <div key={lesson.id} className="space-y-1">
                    <button 
                      onClick={() => toggleLesson(lessonIdx)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-xl transition-all ${
                        activeLessonIdx === lessonIdx ? 'bg-bamboo-green/10 text-bamboo-green font-bold' : 'text-ink/70 hover:bg-black/5'
                      }`}
                    >
                      <span className="text-sm">{lesson.courseTitle}</span>
                      <ChevronRight size={14} className={`transition-transform ${expandedLessons[lessonIdx] ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {expandedLessons[lessonIdx] && (
                      <div className="pl-4 space-y-1 mt-1">
                        {lesson.exercises.map((ex, exIdx) => (
                          <button
                            key={ex.id}
                            onClick={() => selectExercise(lessonIdx, exIdx)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all ${
                              activeLessonIdx === lessonIdx && activeExerciseIdx === exIdx
                              ? 'bg-bamboo-green text-white shadow-sm'
                              : 'text-ink/60 hover:text-bamboo-green hover:bg-bamboo-green/5'
                            }`}
                          >
                            {ex.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 p-4 bg-white/50 rounded-2xl border border-black/5">
              <h3 className="text-[11px] uppercase tracking-widest font-bold text-ink/30 mb-4 flex items-center gap-2">
                <Settings2 size={12} />
                练习设置
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-ink/40 font-bold uppercase block mb-2">演奏调性</label>
                  <div className="grid grid-cols-5 gap-1">
                    {Object.keys(FLUTE_KEYS).map(k => (
                      <button
                        key={k}
                        onClick={() => setFluteKey(k)}
                        className={`py-1.5 rounded-md font-bold text-[10px] transition-all border ${
                          fluteKey === k 
                          ? 'bg-bamboo-green text-white border-bamboo-green' 
                          : 'bg-white text-ink/60 border-black/5 hover:border-bamboo-green'
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-ink/40 font-bold uppercase">速度</label>
                    <span className="text-[10px] font-mono font-bold text-wood-brown">{tempo} BPM</span>
                  </div>
                  <input 
                    type="range" min="40" max="200" value={tempo}
                    onChange={(e) => setTempo(parseInt(e.target.value))}
                    className="w-full h-1 bg-black/5 rounded-lg appearance-none cursor-pointer accent-bamboo-green"
                  />
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 bg-paper p-4 md:p-6 flex flex-col gap-6 overflow-y-auto">
            <div className="grid grid-cols-3 gap-4 shrink-0">
              <div className="bg-white p-3 rounded-xl border border-black/5 soft-shadow flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest text-ink/40 mb-1 font-bold">章节进度</span>
                <span className="text-xl font-bold text-wood-brown">{activeExerciseIdx + 1}/{LESSONS[activeLessonIdx].exercises.length}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-black/5 soft-shadow flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest text-ink/40 mb-1 font-bold">小节计数</span>
                <span className="text-xl font-bold text-wood-brown">{currentPiece.notes.filter(n => n.isBar).length}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-black/5 soft-shadow flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest text-ink/40 mb-1 font-bold">建议速度</span>
                <span className="text-xl font-bold text-wood-brown">{currentPiece.tempo} BPM</span>
              </div>
            </div>

            <section className="bg-white rounded-2xl p-6 md:p-10 soft-shadow border border-[#f0eee8] flex-1 flex flex-col">
              <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-bamboo-green">{currentPiece.title}</h3>
                
                <div className="flex items-center justify-center gap-4 mt-1 text-ink/40 text-sm font-medium">
                  <span className="text-wood-brown font-bold text-lg">{currentPiece.timeSignature}</span>
                  <span className="w-1 h-1 bg-ink/20 rounded-full" />
                  <span>1={fluteKey}</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 gap-y-8 gap-x-2 content-start">
                <AnimatePresence>
                  {currentPiece.notes.map((note, idx) => {
                    if (note.isBar) {
                      return (
                        <div key={`bar-${idx}`} className="flex items-center justify-center">
                          <div className="w-[2px] h-12 bg-ink/30 rounded-full" />
                        </div>
                      );
                    }
                    return (
                      <motion.div 
                        key={`${currentPiece.id}-note-${idx}`}
                        onClick={() => {
                          initAudio();
                          const freq = getNoteFrequency(FLUTE_KEYS[fluteKey], note);
                          playFluteNote(freq, (60/tempo) * note.length);
                          setCurrentNoteIdx(idx);
                          if (!isPlaying) setTimeout(() => setCurrentNoteIdx(-1), 500);
                        }}
                        animate={{ 
                          scale: currentNoteIdx === idx ? 1.25 : 1,
                          color: currentNoteIdx === idx ? '#b33a3a' : '#2c2c2c',
                        }}
                        className={`relative flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-all ${currentNoteIdx === idx ? 'bg-accent-red/5' : 'hover:bg-bamboo-green/5'}`}
                      >
                        {currentNoteIdx === idx && (
                          <div className="absolute -left-1 w-1 h-10 bg-accent-red/60 rounded-full" />
                        )}
                        
                        <div className="h-4 flex items-end">
                          {note.octave > 0 && Array.from({ length: note.octave }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-current rounded-full mb-1 mx-0.5" />
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-3xl font-serif font-bold leading-none scale-x-125">
                            {note.number === 0 ? '0' : note.number}
                          </span>
                          {note.length > 1 && Array.from({ length: Math.floor(note.length) - 1 }).map((_, i) => (
                            <span key={i} className="text-2xl opacity-30 font-serif">-</span>
                          ))}
                        </div>
                        <div className="h-4 mt-1">
                          {note.octave < 0 && Array.from({ length: Math.abs(note.octave) }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-current rounded-full mx-0.5" />
                          ))}
                        </div>
                        <div className="w-full h-[1px] mt-1 flex justify-center gap-1">
                          {note.length === 0.5 && <div className="h-full w-6 bg-current" />}
                          {note.length === 0.25 && (
                            <div className="flex flex-col gap-[2px]">
                              <div className="h-[2px] w-6 bg-current" />
                              <div className="h-[2px] w-6 bg-current" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </section>
          </main>
        </div>

        <footer className="h-16 px-6 bg-ink flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={togglePlayback}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-lg active:scale-95 ${
                isPlaying ? 'bg-accent-red ring-4 ring-accent-red/20' : 'bg-bamboo-green'
              }`}
            >
              {isPlaying ? <Square fill="currentColor" size={18} /> : <Play fill="currentColor" size={18} className="ml-1" />}
            </button>
            <button 
              className="px-4 py-2 border border-white/20 rounded-full text-white text-[10px] hover:bg-white/10 transition-colors flex items-center gap-2"
              onClick={() => setVolume(v => (v > 0 ? 0 : 0.5))}
            >
              {volume > 0 ? <Volume2 size={12} /> : <VolumeX size={12} />}
              音量: {Math.round(volume * 100)}%
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-white/40 uppercase tracking-tighter">音高检测</div>
              <div className="note-display text-xl font-serif font-bold text-bamboo-green">D5</div>
            </div>
            <div className="w-48 h-2 bg-white/10 rounded-full relative">
              <div className="absolute top-0 left-1/2 -ml-[0.5px] w-[1px] h-4 bg-white/30 -mt-1" />
              <motion.div 
                animate={{ left: isPlaying ? '55%' : '50%' }}
                className="absolute -top-[2px] w-3 h-3 bg-bamboo-green rounded-full shadow-[0_0_10px_#5b7c54]" 
              />
            </div>
            <div className="text-xs text-bamboo-green font-bold">+8 cents</div>
          </div>

          <button 
            onClick={stopPlayback}
            className="px-5 py-2 rounded-full border border-accent-red text-accent-red text-xs hover:bg-accent-red hover:text-white transition-all font-bold"
          >
            结束练习
          </button>
        </footer>
      </div>
    </div>
  );
}

