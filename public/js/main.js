// const $histories = document.querySelector('#histories');
import setRecsWithHistories from './moment.js';

const $loading = document.querySelector('#loading');
let loading = false;

const getHistoriesFromBackend = async () => {
  loading = true;
  const res = await fetch('http://localhost:5000/histories');
  const data = await res.json();
  loading = false;
  return data;
};

const addHistoriesToDom = async () => {
  const histories = await getHistoriesFromBackend();
  if (!loading) {
    $loading.innerHTML = '';
  }
  setRecsWithHistories(histories);
};

addHistoriesToDom();
