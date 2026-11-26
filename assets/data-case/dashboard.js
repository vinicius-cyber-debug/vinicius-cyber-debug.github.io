const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const decimal = new Intl.NumberFormat('pt-BR');
const periodControl = document.getElementById('period');
const retryButton = document.getElementById('retry-dashboard');
const statusMessage = document.getElementById('dashboard-status');
const defaultPeriod = periodControl.value;
const periodOptions = new Map(Array.from(periodControl.options, option => [option.value, option.label]));
let periods = new Map();
let loading = false;

function announce(message, visuallyHidden = false) {
  statusMessage.classList.toggle('visually-hidden', visuallyHidden);
  statusMessage.textContent = message;
}

function renderPeriod() {
  const period = periods.get(periodControl.value);
  const revenue = currency.format(period.receita_centavos / 100);
  const margin = decimal.format(period.margem_pct) + '%';
  const orders = decimal.format(period.pedidos);
  const maxRevenue = Math.max(1, ...period.canais.map(channel => channel.receita_centavos));

  const rows = period.canais.map(channel => {
    const row = document.createElement('div');
    row.className = 'bar-row';
    const label = document.createElement('div');
    const name = document.createElement('span');
    name.textContent = channel.canal;
    const value = document.createElement('span');
    value.textContent = currency.format(channel.receita_centavos / 100) + ' · margem ' + decimal.format(channel.margem_pct) + '%';
    label.append(name, value);

    const meter = document.createElement('div');
    meter.className = 'bar-meter';
    meter.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('span');
    fill.className = 'bar-fill';
    fill.style.width = (100 * channel.receita_centavos / maxRevenue) + '%';
    meter.append(fill);
    row.append(label, meter);
    return row;
  });

  document.getElementById('revenue').textContent = revenue;
  document.getElementById('margin').textContent = margin;
  document.getElementById('orders').textContent = orders;
  document.getElementById('conclusion').textContent = period.conclusao;
  document.getElementById('channels').replaceChildren(...rows);
  announce(`${periodOptions.get(period.periodo)}. Faturamento de ${revenue}, margem bruta de ${margin} e ${orders} pedidos concluídos.`, true);
}

function restorePeriod() {
  const requestedPeriod = new URLSearchParams(window.location.search).get('periodo');
  periodControl.value = periodOptions.has(requestedPeriod) && periods.has(requestedPeriod)
    ? requestedPeriod
    : defaultPeriod;
  renderPeriod();
}

async function loadIndicators() {
  if (loading) return;
  loading = true;
  periodControl.disabled = true;
  retryButton.setAttribute('aria-disabled', 'true');
  announce('Carregando os indicadores…');

  try {
    const response = await fetch('../assets/data-case/indicadores.json');
    if (!response.ok) throw new Error('Falha ao carregar os indicadores.');
    const data = await response.json();
    periods = new Map(data.periodos.map(period => [period.periodo, period]));
    if (!periods.has(defaultPeriod)) throw new Error('Período padrão indisponível.');

    for (const option of periodControl.options) {
      option.disabled = !periods.has(option.value);
    }
    restorePeriod();
    periodControl.disabled = false;
    if (document.activeElement === retryButton) periodControl.focus();
    retryButton.hidden = true;
  } catch {
    periods.clear();
    announce('Os indicadores estão indisponíveis. Tente novamente ou baixe os arquivos da análise.');
    retryButton.hidden = false;
  } finally {
    loading = false;
    retryButton.removeAttribute('aria-disabled');
  }
}

periodControl.addEventListener('change', () => {
  if (!periods.has(periodControl.value)) return;
  const url = new URL(window.location.href);
  if (periodControl.value === defaultPeriod) url.searchParams.delete('periodo');
  else url.searchParams.set('periodo', periodControl.value);
  if (url.href !== window.location.href) history.replaceState(history.state, '', url);
  renderPeriod();
});

window.addEventListener('popstate', () => {
  if (periods.size) restorePeriod();
});

retryButton.addEventListener('click', loadIndicators);
loadIndicators();
