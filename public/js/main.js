// const $histories = document.querySelector('#histories');
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
  console.log(histories);
  var now = moment(); // cdn
  console.log(now.format());
  // histories.forEach((history) => {
  //   console.log(history);
  // });
};

addHistoriesToDom();
