import { useEffect } from 'react';

interface UseKeyboardShortcutProps {
  key: string;
  onKeyPress: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcut = ({ 
  key, 
  onKeyPress, 
  enabled = true 
}: UseKeyboardShortcutProps) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' || 
                      target.contentEditable === 'true';
      
      if (!isTyping && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        onKeyPress();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [key, onKeyPress, enabled]);
};