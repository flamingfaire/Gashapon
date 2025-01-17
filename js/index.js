import services from './service.js';
import gacha from './gacha.js';
import gems from './gems.js';
import history from './history.js';
import showResult from './showResult.js';

const singleSummon = document.getElementById('single');
const multiSummon = document.getElementById('multi');
const reSingleSummon = document.getElementById('resingle');
const reMultiSummon = document.getElementById('remulti');
const testGetHistory = document.getElementById('history-open');
let ban_type = document.getElementById('item-1').checked
  ? 'LIMITED'
  : 'STANDARD';

//get user's gem data from localstorage
let GEM_COUNT = Number(localStorage.getItem('GEMS_AMT'))
  .toString()
  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

//initiate purchase amount to 0
let PURCHASE_AMOUNT = 0;
//set user's gem data to element
document.getElementById('GEM_AMT').textContent = GEM_COUNT;

const setChar = (banner) => {
  services.getChar(banner).then((data) => {
    gacha.setGacha(data);
    singleSummon.disabled = false;
    multiSummon.disabled = false;
    testGetHistory.disabled = false;
  });
};

setChar('./characters.json');

//check if user has reached >10k gems
const whaleWatchers = () => {
  let icon = document.querySelectorAll('.status_icon');
  let currStatus =
    PURCHASE_AMOUNT >= 50000 ? 2 : PURCHASE_AMOUNT >= 10000 ? 1 : 0;
  icon.forEach((item) => {
    if (item !== icon[currStatus]) {
      item.setAttribute('hidden', true);
      return;
    }
    item.removeAttribute('hidden');
  });
};

//initial page load check
whaleWatchers();

const incrementBtns = document.querySelectorAll('.purchase_btn');


//purchasing gems function
incrementBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    GEM_COUNT = Number(localStorage.getItem('GEMS_AMT'));
    gems.purchaseGems(GEM_COUNT, Number(btn.value));
    PURCHASE_AMOUNT += Number(btn.value);
    document.getElementById('buy_number').textContent = PURCHASE_AMOUNT;
    whaleWatchers();
  });
});

//////////////////////////////////////////////////////////////

//Purchase Modal Code
/*
const modal = document.querySelector('#modal');
const openModal = document.querySelector('.open-button');
const closeModal = document.querySelector('.close-button');

openModal.addEventListener('click', () => {
  modal.showModal();
});

closeModal.addEventListener('click', () => {
  modal.close();
});
*/

//History Modal Code

const pageBtns = document.querySelectorAll('.btn-pagination');
const historyModal = document.querySelector('#historyModal');
const historyOpen = document.querySelector('.history-open');
const historyClose = document.querySelector('.history-close');

pageBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.value === 'previous') {
      history.checkPrevious();
      return;
    }
    history.checkNext();
  });
});

const pageNumber = document.getElementById("current-number");

historyOpen.addEventListener('click', () => {
  history.changePage();
  historyModal.showModal();
});

historyClose.addEventListener('click', () => {
  pageNumber.textContent = 1;
  historyModal.close();
});

//Summon Code

const doSingle = (e) => {
  GEM_COUNT = localStorage.getItem('GEMS_AMT');
  if (gems.useGems(GEM_COUNT, e)) {
    const result = ban_type === 'LIMITED' ? gacha.roll() : gacha.standardRoll();
    history.updateHistory(result);
    tosummon();
    showResult(result);
    whaleWatchers();
  } else {
    window.alert('not enough gems');
  }
};

const doMulti = (e) => {
  GEM_COUNT = localStorage.getItem('GEMS_AMT');
  if (gems.useGems(GEM_COUNT, e)) {
    const result =
      ban_type === 'LIMITED' ? gacha.multiRoll() : gacha.standardMultiRoll();
    history.updateHistory(...result);
    tosummon();
    showResult(...result);
    whaleWatchers();
  } else {
    window.alert('not enough gems');
  }
};

//single summon
singleSummon.addEventListener('click', doSingle);
reSingleSummon.addEventListener('click', doSingle);

//multi summon
multiSummon.addEventListener('click', doMulti);
reMultiSummon.addEventListener('click', doMulti);

const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('video');
const container = document.querySelector('.container');
const closeBtn = document.querySelector('.close');
const skipBtn = document.querySelector('#skip');

const tosummon = () => {
  window.scrollTo(0, 0);
  if (getComputedStyle(container).display !== 'none') {
    container.style.display = 'none';
  }
  videoContainer.style.display = 'inline';
  video.play();
};

const gotosummon = () => {
  // document.body.style['overflow'] = 'hidden';
  videoContainer.style.display = 'none';
  video.currentTime = 0; //mobile
  container.style.display = 'grid';
};

const toClose = () => {
  container.style.display = 'none';
  // document.body.style['overflow'] = 'auto';
};

const toSkip = () => {
  video.currentTime = video.duration;
};

video.addEventListener('ended', gotosummon);
closeBtn.addEventListener('click', toClose);
skipBtn.addEventListener('click', toSkip);

///////////////////////////////////////////////////////

let boxes = document.querySelectorAll('.banner_slider');

boxes.forEach((box) => {
  box.addEventListener('click', (e) => {
    ban_type = e.target.id === 'item-3' ? 'STANDARD' : 'LIMITED';
    switch (e.target.id) {
      case 'item-1':
        setChar('./characters.json');
        break;
      case 'item-2':
        setChar('./equips.json');
        break;
      case 'item-3':
        setChar('./standard.json');
        break;
      default:
        break;
    }
  });
});

const sortStar = document.querySelectorAll('.sort-star');
const resetter = document.getElementById('resetter');

sortStar.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    removeFilterActive();
    history.filterForStar(Number(e.target.value));
    e.target.classList.add('active-star')
  });
});

resetter.addEventListener('click', () => {
  removeFilterActive();
  history.resetFilter();
  resetter.classList.add('active-star')
});

const removeFilterActive = () => {
  sortStar.forEach((btn) => {
    btn.classList.remove('active-star');
  });
  resetter.classList.remove('active-star');
};
