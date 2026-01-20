import React, { useEffect, useRef, useState } from "react";

// Função para desenhar um retângulo com bordas arredondadas
const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
};

// Componente para desenhar a waveform do WhatsApp
export function WaveformPlayer({ waveformBase64, color, progress }) {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);

  // Função para decodificar o waveform de base64 para array
  const decodeWaveform = (waveformBase64) => {
    const decoded = atob(waveformBase64); // Decodifica o base64 para string binária
    const waveformArray = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      waveformArray[i] = decoded.charCodeAt(i); // Converte para um array de inteiros
    }
    return Array.from(waveformArray); // Retorna como array normal
  };

  // Função para ajustar o tamanho do canvas dinamicamente
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const canvas2 = canvasRef2.current;
    const parent = canvas.parentNode;

    // Ajustar o tamanho do canvas ao tamanho do elemento pai
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    canvas2.width = parent.clientWidth;
    canvas2.height = parent.clientHeight;

    setCanvasSize({ width: canvas.width, height: canvas.height });
  };

  useEffect(() => {
    resizeCanvas();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvas2 = canvasRef2.current;
    const ctx = canvas.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    const waveformArray = decodeWaveform(waveformBase64);

    const { width, height } = canvasSize; // Ajustar o tamanho do canvas
    const halfHeight = height / 2; // Meio da altura do canvas

    // Configurando cores e limpando o canvas
    ctx.fillStyle = color;
    ctx2.fillStyle = color;
    ctx.clearRect(0, 0, width, height);
    ctx2.clearRect(0, 0, width, height);

    const spacing = 0.6; // Defina um espaçamento fixo entre as barras
    const barWidth = width / waveformArray.length - spacing; // Largura de cada barra
    waveformArray.forEach((value, index) => {
      const barHeight = (value / 125) * height; // Altura da barra proporcional
      const x = index * (barWidth + spacing); // Posição horizontal

      // Centralizar verticalmente: metade para cima, metade para baixo
      const y = halfHeight - barHeight / 2;

      // Desenhar retângulos com bordas arredondadas
      drawRoundedRect(ctx, x, y, barWidth, barHeight, 2); // Barra arredondada
      drawRoundedRect(ctx2, x, y, barWidth, barHeight, 2); // Barra arredondada
    });

    // Adiciona um listener para redimensionar o canvas quando a janela for redimensionada
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [waveformBase64, canvasSize]);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
        className="opacity-50"
      />
      <div
        style={{ width: `${progress}%` }}
        className="overflow-hidden absolute top-0 left-0 z-10 dark:brightness-150 transition-all "
      >
        <canvas
          ref={canvasRef2}
          style={{ width: canvasSize.width, height: "100%" }}
        />
      </div>
    </div>
  );
}
