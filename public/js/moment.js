const $recs = document.querySelector('.recs');
// const days = ['일', '월', '화', '수', '목', '금', '토'];

const calcY = (daysIdx) => {
  let ny;
  switch (daysIdx) {
    case 0:
      ny = 0;
      break;
    case 1:
      ny = 20;
      break;
    case 2:
      ny = 40;
      break;
    case 3:
      ny = 60;
      break;
    case 4:
      ny = 80;
      break;
    case 5:
      ny = 100;
      break;
    case 6:
      ny = 120;
      break;
    default:
      console.error('error');
  }
  return ny;
};

const setRecsWithHistories = (histories) => {
  histories = histories.filter((history) => history.user === '현석 신'); // for test
  console.log(histories);
  let now = moment(); // cdn
  const coordinate = { x: 1100, y: 0 };
  const monthXCoordinate = {};
  let color = '#DDDFE0';
  let solvedNum = 0;
  for (let i = 364; i >= 0; i--) {
    // make a simple rectangle
    let newRect = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    const dateObj = now.subtract(364 - i, 'days');
    const dayIdx = dateObj.day();
    const dayInfo = dateObj.format('YYYY-MM-DD');
    const mon = +dayInfo.split('-')[2];
    const day = +dayInfo.split('-')[1];
    if (mon === 1) {
      monthXCoordinate[day] = coordinate.x;
    }
    coordinate.y = calcY(dayIdx);

    solvedNum = histories.filter((history) => history.date === dayInfo).length;
    if (solvedNum > 2) {
      color = '#4EB17C';
    } else if (solvedNum > 1) {
      color = '#78CB94';
    } else if (solvedNum > 0) {
      color = '#A1E4AC';
    } else {
      color = '#DDDFE0';
    }

    newRect.setAttribute('width', '18');
    newRect.setAttribute('height', '18');
    newRect.setAttribute('x', `${coordinate.x}`);
    newRect.setAttribute('y', `${coordinate.y}`);
    newRect.setAttribute('rx', '5');
    newRect.setAttribute('fill', color);
    newRect.setAttribute('stroke-width', '2.5');
    newRect.setAttribute('data-date', dayInfo);
    newRect.setAttribute('data-num', solvedNum);

    $recs.append(newRect);

    if (dayIdx === 0) {
      coordinate.x -= 20;
    }
    now = moment();
  }
  for (const [key, value] of Object.entries(monthXCoordinate)) {
    let newText = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    );
    newText.setAttribute('font-size', '13');
    newText.setAttribute('text-anchor', 'start');
    newText.setAttribute('x', `${value}`);
    newText.setAttribute('y', '160');
    newText.setAttribute('dy', '0.3em');
    newText.setAttribute('fill', '#8a8f95');
    newText.textContent = `${key}월`;

    $recs.append(newText);
  }
  let markRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  let markText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  markRect.classList.add('mark-rect');
  markRect.setAttribute('pointer-events', 'none');
  markRect.setAttribute('width', '200');
  markRect.setAttribute('height', '30');
  markRect.setAttribute('rx', '5');
  markRect.setAttribute('fill', '#000000');
  markRect.setAttribute('display', 'none');

  markText.classList.add('mark-text');
  markText.setAttribute('pointer-events', 'none');
  markText.setAttribute('fill', '#ffffff');
  markText.setAttribute('font-size', '13');
  markText.setAttribute('text-anchor', 'middle');
  markText.setAttribute('display', 'none');
  $recs.append(markRect, markText);

  const $markRect = document.querySelector('.mark-rect');
  const $markText = document.querySelector('.mark-text');

  Array.from($recs.children).forEach((recEl) => {
    recEl.addEventListener('mouseover', (e) => {
      if (
        recEl.classList.contains('mark-rect') ||
        recEl.classList.contains('mark-text')
      ) {
        return;
      }
      let targetX = +e.target.getAttribute('x') - 100 + 10;
      let targetY = +e.target.getAttribute('y') - 34;
      const targetDate = e.target.getAttribute('data-date');
      const targetSolvedNum = e.target.getAttribute('data-num');
      $markRect.setAttribute('display', 'inline');
      $markRect.setAttribute('x', `${targetX}`);
      $markRect.setAttribute('y', `${targetY}`);

      $markText.setAttribute('display', 'inline');
      $markText.setAttribute('x', `${targetX + 100}`);
      $markText.setAttribute('y', `${targetY + 16}`);
      $markText.setAttribute('dy', '0.25em');
      $markText.textContent = `날짜: ${targetDate} / 푼 개수: ${targetSolvedNum}`;
      /*
       * <rect pointer-events="none" width="200" height="30" rx="5" fill="#000000" display="inline" x="50.181818181818244" y="104"></rect>
       * <text pointer-events="none" fill="#ffffff" font-size="13" text-anchor="middle" display="inline" x="150.18181818181824" y="120" dy="0.25em">2021-12-09: 0문제 해결</text>
       * */
    });

    recEl.addEventListener('mouseout', () => {
      $markRect.setAttribute('display', 'none');
      $markRect.removeAttribute('x');
      $markRect.removeAttribute('y');

      $markText.setAttribute('display', 'none');
      $markRect.removeAttribute('x');
      $markRect.removeAttribute('y');
      $markRect.removeAttribute('dy');
      $markText.textContent = '';
    });
  });
};

export default setRecsWithHistories;

/*
*                   <text font-size="13" text-anchor="start" x="1080" y="160" dy="0.3em" fill="#8a8f95">12월</text>
                    <text font-size="13" text-anchor="start" x="1000" y="160" dy="0.3em" fill="#8a8f95">11월</text>
                    <text font-size="13" text-anchor="start" x="900" y="160" dy="0.3em" fill="#8a8f95">10월</text>
                    <text font-size="13" text-anchor="start" x="820" y="160" dy="0.3em" fill="#8a8f95">9월</text>
                    <text font-size="13" text-anchor="start" x="740" y="160" dy="0.3em" fill="#8a8f95">8월</text>
                    <text font-size="13" text-anchor="start" x="640" y="160" dy="0.3em" fill="#8a8f95">7월</text>
                    <text font-size="13" text-anchor="start" x="560" y="160" dy="0.3em" fill="#8a8f95">6월</text>
                    <text font-size="13" text-anchor="start" x="480" y="160" dy="0.3em" fill="#8a8f95">5월</text>
                    <text font-size="13" text-anchor="start" x="380" y="160" dy="0.3em" fill="#8a8f95">4월</text>
                    <text font-size="13" text-anchor="start" x="300" y="160" dy="0.3em" fill="#8a8f95">3월</text>
                    <text font-size="13" text-anchor="start" x="220" y="160" dy="0.3em" fill="#8a8f95">2월</text>
                    <text font-size="13" text-anchor="start" x="120" y="160" dy="0.3em" fill="#8a8f95">1월</text>
*                   <rect width="18" height="18" x="1100" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1100" y="60" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1100" y="40" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1100" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1100" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1080" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1080" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1080" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1080" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1080" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1080" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1080" y="0" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1060" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1060" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1060" y="80" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1060" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1060" y="40" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1060" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1060" y="0" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1040" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1040" y="100" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1040" y="80" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1040" y="60" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1040" y="40" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1040" y="20" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1040" y="0" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1020" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1020" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1020" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1020" y="60" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1020" y="40" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1020" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1020" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1000" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1000" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1000" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1000" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1000" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1000" y="20" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="1000" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="980" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="980" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"
                          stroke="transparent"></rect>
                    <rect width="18" height="18" x="980" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="980" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="980" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="980" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="980" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="960" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="960" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="960" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="960" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="960" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="960" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="960" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="940" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="940" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="940" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"
                          stroke="transparent"></rect>
                    <rect width="18" height="18" x="940" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="940" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="940" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="940" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="920" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="920" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="920" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="920" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="920" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="920" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="920" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="900" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="900" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="900" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="900" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="900" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="900" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="900" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="880" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="880" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="880" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="880" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="880" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="880" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="880" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="860" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="860" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="860" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="860" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="860" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="860" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="860" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="840" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="840" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="840" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="840" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"
                          stroke="transparent"></rect>
                    <rect width="18" height="18" x="840" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="840" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="840" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="820" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="820" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="820" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="820" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"
                          stroke="transparent"></rect>
                    <rect width="18" height="18" x="820" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="820" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="820" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="800" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="800" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="800" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="800" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"
                          stroke="transparent"></rect>
                    <rect width="18" height="18" x="800" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="800" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="800" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="780" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="780" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="780" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="780" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="780" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="780" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="780" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="760" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="760" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="760" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="760" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="760" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="760" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="760" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="740" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="740" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="740" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="740" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="740" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="740" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="740" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="720" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="720" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="720" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="720" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="720" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="720" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="720" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="700" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="700" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="700" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="700" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="700" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="700" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="700" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="680" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="680" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="680" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="680" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="680" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="680" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="680" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="660" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="660" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="660" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="660" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="660" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="660" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="660" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="640" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="640" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="640" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="640" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="640" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="640" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="640" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="620" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="620" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="620" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="620" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="620" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="620" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="620" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="600" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="600" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="600" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="600" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="600" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="600" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="600" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="580" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="580" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="580" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="580" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="580" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="580" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="580" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="560" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="560" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="560" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="560" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="560" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="560" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="560" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="540" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="540" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="540" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="540" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="540" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="540" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="540" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="520" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="520" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="520" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="520" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="520" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="520" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="520" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="500" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="500" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="500" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="500" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="500" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="500" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="500" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="480" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="480" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="480" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="480" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="480" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="480" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="480" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="460" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="460" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="460" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="460" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="460" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="460" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="460" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="440" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="440" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="440" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="440" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="440" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="440" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="440" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="420" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="420" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="420" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="420" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="420" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="420" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="420" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="400" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="400" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="400" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="400" y="60" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="400" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="400" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="400" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="380" y="120" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="380" y="100" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="380" y="80" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="380" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="380" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="380" y="20" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="380" y="0" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="360" y="120" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="360" y="100" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="360" y="80" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="360" y="60" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="360" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="360" y="20" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="360" y="0" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="340" y="120" rx="5" fill="#78cb94" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="340" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="340" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="340" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="340" y="40" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="340" y="20" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="340" y="0" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="320" y="120" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="320" y="100" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="320" y="80" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="320" y="60" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="320" y="40" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="320" y="20" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="320" y="0" rx="5" fill="#4eb17c" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="300" y="120" rx="5" fill="#a1e4ac" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="300" y="100" rx="5" fill="#4eb17c" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="300" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="300" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="300" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="300" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="300" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="280" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="280" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="280" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="280" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="280" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="280" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="280" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="260" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="260" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="260" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="260" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="260" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="260" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="260" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="240" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="240" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="240" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="240" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="240" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="240" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="240" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="220" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="220" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="220" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="220" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="220" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="220" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="220" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="200" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="200" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="200" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="200" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="200" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="200" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="200" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="180" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="180" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="180" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="180" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="180" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="180" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="180" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="160" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="160" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="160" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="160" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="160" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="160" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="160" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="140" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="140" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="140" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="140" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="140" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="140" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="140" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="120" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="120" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"
                          stroke="transparent"></rect>
                    <rect width="18" height="18" x="120" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="120" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="120" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="120" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="120" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="100" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"
                          stroke="transparent"></rect>
                    <rect width="18" height="18" x="100" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="100" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="100" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="100" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="100" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="100" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="80" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="80" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="80" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="80" y="60" rx="5" fill="#dddfe0" stroke-width="2.5"
                          stroke="transparent"></rect>
                    <rect width="18" height="18" x="80" y="40" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="80" y="20" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="80" y="0" rx="5" fill="#dddfe0" stroke-width="2.5"></rect>
                    <rect width="18" height="18" x="60" y="120" rx="5" fill="#dddfe0" stroke-width="2.5"
                          stroke="transparent"></rect>
                    <rect width="18" height="18" x="60" y="100" rx="5" fill="#dddfe0" stroke-width="2.5"
                          stroke="transparent"></rect>
                    <rect width="18" height="18" x="60" y="80" rx="5" fill="#dddfe0" stroke-width="2.5"
                          stroke="transparent"></rect>
                    <rect pointer-events="none" width="200" height="30" rx="5" fill="#000000" display="none"
                          x="50.181818181818244" y="104"></rect>
                    <text pointer-events="none" fill="#ffffff" font-size="13" text-anchor="middle" display="none"
                          x="150.18181818181824" y="120" dy="0.25em">2021-12-09: 0문제 해결
                    </text>
 * */
