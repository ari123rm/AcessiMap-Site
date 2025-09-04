// src/hooks/useSpeechRecognition.ts
import { useEffect, useState, useRef } from 'react';


// Informa ao TypeScript que a API pode existir no objeto window
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useSpeechRecognition = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  // useRef para manter a instância da API entre renderizações
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Seu navegador não suporta a Web Speech API.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    
    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setText('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return {
    text,
    isListening,
    startListening,
    hasRecognitionSupport: !!recognitionRef.current,
  };
};