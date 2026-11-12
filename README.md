# Portfólio de Vinicius Maia da Silva

Publicado em https://vinicius-cyber-debug.github.io/ pelo GitHub Pages, a partir da raiz da branch main.

# Portfólio — Vinicius Maia da Silva

Site responsivo em português com foco em desenvolvimento full stack, backend, dados e integração de sistemas.

O visual principal usa fundo escuro com grade, destaques em azul e ciano e uma apresentação centralizada. Os links de contato levam ao GitHub, LinkedIn e WhatsApp de Vinicius.

## Arquivos

- `index.html`: textos, estrutura, navegação e links.
- `styles.css`: estilos, responsividade e temas claro/escuro.
- `app.js`: conteúdo das cinco abas de habilidades e interações.
- `assets/fonts/`: fontes Manrope e JetBrains Mono hospedadas localmente.
- `favicon.svg`: marca do portfólio.

## Visualizar

Abra `index.html` em um navegador ou sirva a raiz do repositório com um servidor HTTP estático. Não é necessário instalar dependências nem compilar.

## Personalizar

Edite os textos e os links de GitHub, LinkedIn e WhatsApp em `index.html`. As tecnologias, descrições e conhecimentos de cada aba ficam no objeto `skills` em `app.js`.

A seção `#projetos` apresenta Next Portaria, o MVP da API ERP e um laboratório demonstrativo SQL/Python. Novos projetos continuam como “em breve”. A API usa dados sintéticos e ERP simulado. SQL Server está preparado no código, mas não foi executado nem validado.

A API ERP mantém o download do ZIP de fontes fornecido. A antiga demonstração temporária está indisponível; seus links foram removidos. A captura histórica da documentação foi preservada.

O site não coleta dados, não envia formulários e não usa analytics. A preferência de tema é armazenada no navegador.

## Animações

Entradas ao rolar, transições nas abas e etapas, brilho ambiente leve e microinterações em cartões e botões estão em `styles.css` e nos auxiliares de movimento em `app.js`. Os efeitos respeitam a configuração `prefers-reduced-motion` do dispositivo; o conteúdo também permanece acessível sem JavaScript. As fontes continuam hospedadas localmente.

## Publicar em outro serviço

Envie o conteúdo da raiz para uma hospedagem estática. O documento principal é `index.html`. Mantenha a estrutura dos arquivos e a pasta `assets`.

## Créditos

Estrutura inspirada no portfólio de Rhuan Bello (https://www.rhuanbello.com/), com composição e código próprios.
Fontes Manrope e JetBrains Mono distribuídas sob a SIL Open Font License.

## Atualização de novembro de 2026

Next Portaria destacado com captura do repositório público, demo visual em memória, código e estudo de caso. Perfil GitHub atualizado para vinicius-cyber-debug. Swagger temporário da API ERP indisponível: links removidos, código ZIP preservado.

Trajetória e formação transcritas do currículo fornecido, com objetivo Backend / Full Stack e PDF atualizado em `assets/cv/`. Idiomas e modalidade de trabalho foram omitidos por falta de informação confirmada.

Os cards apresentam problema, escopo e decisões técnicas. Os números de testes dos projetos são registros datados nas evidências, não novas execuções nem percentuais de cobertura.

O laboratório em `projetos/analise-dados.html` usa dados sintéticos e foi criado com assistência de IA. Seu ZIP contém pipeline Python, SQL, CSV, indicadores e verificações executadas. Para reproduzir, extraia e execute `python pipeline.py`. Não existe relatório Power BI validado; as medidas DAX são propostas. A API ERP ainda depende de repositório próprio e hospedagem estável.
