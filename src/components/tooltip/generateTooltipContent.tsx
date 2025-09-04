
function generateTooltipContent (items: { nome: string; percentualSim: number }[] | undefined)  {
    if (!items || items.length === 0) {
      return 'Sem dados de checklist suficientes.';
    }
    // Ordena os itens pelo maior percentual de "Sim"
    const sortedItems = [...items].sort((a, b) => b.percentualSim - a.percentualSim);

    return `
      <div className="custom-tooltip">
        <strong>Checklist da Comunidade:</strong>
        <ul>
          ${sortedItems.map(item => `
            <li>
              <span>${item.nome}</span>
              <span style="font-weight: bold; color: ${item.percentualSim >= 50 ? '#28a745' : '#dc3545'};">
                ${item.percentualSim.toFixed(0)}% Sim
              </span>
            </li>
          `).join('')}
        </ul>
      </div>
        `;
  };

export default generateTooltipContent;