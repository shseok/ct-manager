const $histories = document.querySelector('#histories');
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

  histories.forEach((history) => {
    const div = document.createElement('div');
    div.className = 'history';
    div.innerHTML = `
            <h3>${history.user}</h3>
            <h3>${history.date}</h3>
            <h3>${history.tags}</h3>
        `;
    $histories.append(div);
  });
};

addHistoriesToDom();
