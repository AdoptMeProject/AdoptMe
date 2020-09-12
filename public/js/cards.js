const CARD = document.getElementById('post-content');


CARD.addEventListener('mouseover', event => {
    const postCardAppear = setTimeout(() => {
        CARD.classList.toggle('hide');
        CARD.classList.toggle('fade-in');
    }, 100);
});

CARD.addEventListener('mouseout', event => {
    const postCardAppear = setTimeout(() => {
        CARD.classList.toggle('hide');
        CARD.classList.toggle('fade-out');
    }, 100);
});